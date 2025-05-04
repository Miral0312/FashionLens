from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os, shutil, zipfile, time, base64, requests
import patoolib
from typing import List, Dict
from ultralytics import YOLO
from PIL import Image
import numpy as np
import cv2
import joblib, pickle
import tensorflow as tf
from tensorflow.keras.applications.resnet50 import preprocess_input, ResNet50
from tensorflow.keras.models import Model
from tensorflow.keras.preprocessing import image as keras_image
from tensorflow.keras.layers import GlobalMaxPooling2D
from numpy.linalg import norm
from sklearn.neighbors import NearestNeighbors
import pandas as pd
from neuralprophet import NeuralProphet
from pytrends.request import TrendReq

# ========== Initialize FastAPI App ==========
app = FastAPI()

# ========== CORS Configuration ==========
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== Constants ==========
BASE_UPLOAD_FOLDER = "uploads"
BASE_PREDICTIONS_FOLDER = "predictions"
IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff']
TIMEFRAME = "today 5-y"

# ========== Load Models ==========
garment_model = YOLO("models/best_garment.pt")
color_model = YOLO("models/best_color.pt")
pattern_model = YOLO("models/best_pattern.pt")

classifier = joblib.load("models/fabric_classifier_resnet50.pkl")
scaler = joblib.load("models/scaler_resnet50.pkl")
pca = joblib.load("models/pca_resnet50.pkl")
class_names = np.load("models/class_names.npy", allow_pickle=True)

base_model = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
textile_model = Model(inputs=base_model.input, outputs=base_model.output)

feature_model = tf.keras.Sequential([ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3)), GlobalMaxPooling2D()])
feature_model.trainable = False

feature_list = np.array(pickle.load(open('./models/embeddings.pkl', 'rb')))
filenames = pickle.load(open('./models/filenames.pkl', 'rb')) 

# ========== Helper Functions ==========
def setup_user_folders(user_id: str):
    upload_path = os.path.join(BASE_UPLOAD_FOLDER, user_id)
    pred_path = os.path.join(BASE_PREDICTIONS_FOLDER, user_id)
    for path in [upload_path, pred_path]:
        if os.path.exists(path): shutil.rmtree(path)
        os.makedirs(path, exist_ok=True)
    return upload_path, pred_path

def extract_archive(file_path: str, extract_to: str):
    os.makedirs(extract_to, exist_ok=True)
    if file_path.endswith(".zip"):
        with zipfile.ZipFile(file_path, "r") as zip_ref:
            zip_ref.extractall(extract_to)
    elif file_path.endswith(".rar"):
        patoolib.extract_archive(file_path, outdir=extract_to)
    else:
        raise ValueError("Unsupported archive format")

def get_images_from_folder(folder: str) -> List[str]:
    return [os.path.join(folder, f) for f in os.listdir(folder) if os.path.splitext(f)[1].lower() in IMAGE_EXTENSIONS]

def process_images(image_paths: List[str], model, model_type: str, pred_folder: str) -> Dict[str, int]:
    results_data = {}
    for img_path in image_paths:
        result = model(img_path)[0]
        pred_path = os.path.join(pred_folder, f"{model_type}_{os.path.basename(img_path)}")
        result.save(pred_path)
        for obj in result.boxes.data:
            category = result.names[int(obj[5])]
            results_data[category] = results_data.get(category, 0) + 1
    return results_data

def process_textile_image(image_path: str):
    try:
        img = cv2.imread(image_path)
        if img is None: return None
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = cv2.resize(img, (224, 224))
        img = preprocess_input(np.array([img]))
        features = textile_model.predict(img)
        features = features.mean(axis=(1, 2))
        features = scaler.transform(features)
        features = pca.transform(features)
        prediction = classifier.predict(features)
        return class_names[prediction[0]]
    except Exception as e:
        print(f"Textile processing error: {e}")
        return None

def extract_features(img_path):
    img = keras_image.load_img(img_path, target_size=(224, 224))
    img_array = keras_image.img_to_array(img)
    expanded = np.expand_dims(img_array, axis=0)
    preprocessed = preprocess_input(expanded)
    result = feature_model.predict(preprocessed).flatten()
    return result / norm(result)

def get_recommendations(features):
    neighbors = NearestNeighbors(n_neighbors=6, algorithm='brute', metric='euclidean')
    neighbors.fit(feature_list)
    _, indices = neighbors.kneighbors([features])
    return indices

def fetch_trends_data(keywords, retries=3, backoff_factor=2):
    pytrends = TrendReq()
    trends_data = {}  
    for item in keywords:
        attempt = 0
        while attempt < retries:
            try:
                pytrends.build_payload([item], timeframe=TIMEFRAME)
                data = pytrends.interest_over_time()
                if data.empty:
                    raise HTTPException(status_code=404, detail=f"No data found for '{item}'")
                trends_data[item] = data[item]
                break
            except requests.exceptions.Timeout:
                attempt += 1
                time.sleep(backoff_factor ** attempt)
            except Exception as e:
                print(f"Error fetching data for {item}: {e}")
                break
    if not trends_data:
        raise HTTPException(status_code=404, detail="No data fetched from Google Trends.")
    df = pd.DataFrame(trends_data)
    return df.dropna()

def forecast_trends(data, periods=365):
    df = data.reset_index()
    df.columns = ['ds', 'y']
    model = NeuralProphet(yearly_seasonality=True, learning_rate=0.1)
    model.fit(df, freq='D', epochs=100)
    future = model.make_future_dataframe(df, periods=periods)
    forecast = model.predict(future)
    yearly_seasonality = model.predict_seasonal_components(future)
    yearly_seasonality['month'] = yearly_seasonality['ds'].dt.month
    monthly_avg = yearly_seasonality.groupby('month')['yearly'].mean()
    peak_month = int(monthly_avg.idxmax())
    low_month = int(monthly_avg.idxmin())
    return forecast, peak_month, low_month

# ========== API Endpoints ==========

@app.post("/predict/")
async def predict(user_id: str = Form(...), file: UploadFile = File(...), model_type: str = Form(...)):
    user_upload_folder, user_prediction_folder = setup_user_folders(user_id)
    file_path = os.path.join(user_upload_folder, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    extracted_folder = os.path.join(user_upload_folder, "extracted")
    image_paths = [file_path]
    if file.filename.endswith((".zip", ".rar")):
        extract_archive(file_path, extracted_folder)
        image_paths = get_images_from_folder(extracted_folder)

    results = {}
    if model_type == "all_in_one":
        garment_res = process_images(image_paths, garment_model, "garment", user_prediction_folder)
        color_res = process_images(get_images_from_folder(user_prediction_folder), color_model, "color", user_prediction_folder)
        pattern_res = process_images(get_images_from_folder(user_prediction_folder), pattern_model, "pattern", user_prediction_folder)
        results.update({"garment": garment_res, "color": color_res, "pattern": pattern_res})
    else:
        if "garment" in model_type:
            results["garment"] = process_images(image_paths, garment_model, "garment", user_prediction_folder)
        if "color" in model_type:
            results["color"] = process_images(image_paths, color_model, "color", user_prediction_folder)
        if "pattern" in model_type:
            results["pattern"] = process_images(image_paths, pattern_model, "pattern", user_prediction_folder)

    if "textile" in model_type:
        textile_results = {}
        for img_path in image_paths:
            fabric = process_textile_image(img_path)
            if fabric:
                textile_results[os.path.basename(img_path)] = fabric
        results["textile"] = textile_results

    return {"user_id": user_id, "results": results}

@app.post("/recommend-binary/")
async def recommend_images(file: UploadFile = File(...)):
    file_path = f"uploads/{file.filename}"
    with open(file_path, "wb") as f:
        f.write(await file.read())
    try:
        features = extract_features(file_path)
        indices = get_recommendations(features)
        recommended_images = []
        for idx in indices[0]:
            with open(filenames[idx], "rb") as img_file:
                encoded = base64.b64encode(img_file.read()).decode('utf-8')
                recommended_images.append(encoded)
        os.remove(file_path)
        return {"recommended_images": recommended_images}
    except Exception as e:
        return {"error": str(e)}

@app.get("/fetch_trends/{keyword}")
async def get_trends(keyword: str):
    try:
        trends_data = fetch_trends_data([keyword])
        forecast, peak_month, low_month = forecast_trends(trends_data[keyword])
        response = {
            "keyword": keyword,
            "historical_data": {
                "dates": trends_data.index.strftime('%Y-%m-%d').tolist(),
                "values": trends_data[keyword].tolist()
            },
            "forecast_data": {
                "dates": forecast['ds'].dt.strftime('%Y-%m-%d').tolist(),
                "values": forecast['yhat1'].tolist()
            },
            "peak_month": peak_month,
            "low_month": low_month
        }
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ========== Run App ==========
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
