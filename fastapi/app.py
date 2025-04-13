from fastapi import FastAPI, UploadFile, File, Form
import os
import shutil
import zipfile
import patoolib
from ultralytics import YOLO
from typing import List, Dict
import uvicorn
from PIL import Image

app = FastAPI()

BASE_UPLOAD_FOLDER = "uploads"
BASE_PREDICTIONS_FOLDER = "predictions"

# Load YOLO models
garment_model = YOLO(r"models/best_garment.pt")
color_model = YOLO(r"models/best_color.pt")
pattern_model = YOLO(r"models/best_pattern.pt")

# Allowed image extensions
IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff']


# 🛠️ Helper Functions
def setup_user_folders(user_id: str):
    """Creates user-specific folders, deleting old ones if they exist."""
    user_upload_folder = os.path.join(BASE_UPLOAD_FOLDER, user_id)
    user_prediction_folder = os.path.join(BASE_PREDICTIONS_FOLDER, user_id)

    # Remove existing folders
    if os.path.exists(user_upload_folder):
        shutil.rmtree(user_upload_folder)
    if os.path.exists(user_prediction_folder):
        shutil.rmtree(user_prediction_folder)

    # Create fresh folders
    os.makedirs(user_upload_folder, exist_ok=True)
    os.makedirs(user_prediction_folder, exist_ok=True)

    return user_upload_folder, user_prediction_folder


def extract_archive(file_path: str, extract_to: str):
    """Extracts ZIP or RAR files to the given directory."""
    os.makedirs(extract_to, exist_ok=True)

    if file_path.endswith(".zip"):
        with zipfile.ZipFile(file_path, "r") as zip_ref:
            zip_ref.extractall(extract_to)
    elif file_path.endswith(".rar"):
        patoolib.extract_archive(file_path, outdir=extract_to)
    else:
        raise ValueError("Unsupported archive format")


def get_images_from_folder(folder: str) -> List[str]:
    """Returns a list of image file paths in the given folder."""
    return [
        os.path.join(folder, file)
        for file in os.listdir(folder)
        if os.path.splitext(file)[1].lower() in IMAGE_EXTENSIONS
    ]


def process_images(image_paths: List[str], model, model_type: str, prediction_folder: str) -> Dict[str, int]:
    """Processes a list of images with the given model and saves the predictions."""
    results_data = {}

    for img_path in image_paths:
        result = model(img_path)[0]

        # Save the prediction image
        prediction_path = os.path.join(prediction_folder, f"{model_type}_{os.path.basename(img_path)}")
        result.save(prediction_path)  # 🔥 Fix: Ensure the predicted image is saved
        print(f"Saved {model_type} prediction at: {prediction_path}")

        # Process results
        for obj in result.boxes.data:
            category = result.names[int(obj[5])]
            results_data[category] = results_data.get(category, 0) + 1

    return results_data


@app.post("/predict/")
async def predict(user_id: str = Form(...), file: UploadFile = File(...), model_type: str = Form(...)):
    """Handles file uploads and runs predictions."""
    user_upload_folder, user_prediction_folder = setup_user_folders(user_id)

    # Save the uploaded file
    file_path = os.path.join(user_upload_folder, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract files if necessary
    extracted_folder = os.path.join(user_upload_folder, "extracted")
    if file.filename.endswith((".zip", ".rar")):
        extract_archive(file_path, extracted_folder)
        image_paths = get_images_from_folder(extracted_folder)
    else:
        image_paths = [file_path]

    # Run predictions
    results = {}
    if model_type == "all_in_one":
        # Garment Prediction
        garment_results = process_images(image_paths, garment_model, "garment", user_prediction_folder)

        # Use garment prediction image as input for color model
        garment_images = get_images_from_folder(user_prediction_folder)
        color_results = process_images(garment_images, color_model, "color", user_prediction_folder)

        # Use color prediction image as input for pattern model
        color_images = get_images_from_folder(user_prediction_folder)
        pattern_results = process_images(color_images, pattern_model, "pattern", user_prediction_folder)

        results.update({"garment": garment_results, "color": color_results, "pattern": pattern_results})

    else:
        if model_type == "garment":
            results["garment"] = process_images(image_paths, garment_model, "garment", user_prediction_folder)
        if model_type == "color":
            results["color"] = process_images(image_paths, color_model, "color", user_prediction_folder)
        if model_type == "pattern":
            results["pattern"] = process_images(image_paths, pattern_model, "pattern", user_prediction_folder)

    return {"user_id": user_id, "results": results}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 
