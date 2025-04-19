"use client";

import React, { useState } from "react";
import axios from "axios";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function VirtualTryOnPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [recommendedImages, setRecommendedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [vtonImage, setVtonImage] = useState(null);
  const [humanBase64, setHumanBase64] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setRecommendedImages([]);
    setSelectedImage(null);
    setVtonImage(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = () => {
        setHumanBase64(reader.result.split(",")[1]);
      };

      const response = await axios.post("http://localhost:4000/business/recommend", formData);
      setRecommendedImages(response.data.recommended_images); 
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSelectImage = (img) => {
    setSelectedImage(img);
  };

  const handleTryOn = async () => {
    if (!selectedImage || !humanBase64) {
      alert("Please select an image and upload first!");
      return;
    }

    try {
      const cleanHumanBase64 = humanBase64.replace(/^data:image\/\w+;base64,/, "");
      const cleanGarmBase64 = selectedImage.replace(/^data:image\/\w+;base64,/, "");

      const response = await axios.post("http://localhost:4000/business/tryon", {
        human_base64: cleanHumanBase64,
        garm_base64: cleanGarmBase64,
      });

      setVtonImage(response.data.vton_image);
    } catch (error) {
      console.error("Error with VTON API:", error.response?.data || error.message);
      alert("Try-On failed. Please check console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Navbar />

      <section className="pt-24 pb-12 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="font-playfair text-4xl md:text-5xl">Virtual Try-On</h1>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
            Try our AI-powered virtual try-on experience. Upload your photo and see yourself in recommended outfits instantly!
          </p>
        </div>
      </section>

      <section className="px-4 pb-24 flex justify-center">
        <div className="max-w-3xl w-full bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold mb-4 text-center">Upload Your Photo</h2>
          <input type="file" onChange={handleFileChange} className="mb-4" />
          <div className="text-center">
            <button
              onClick={handleUpload}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Upload & Get Recommendations
            </button>
          </div>

          {recommendedImages.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4 text-center">Select a Recommended Garment</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {recommendedImages.map((img, index) => (
                  <img
                    key={index}
                    src={`data:image/jpeg;base64,${img}`}
                    alt="Recommended"
                    className={`w-32 h-32 object-cover cursor-pointer rounded-md border-4 ${
                      selectedImage === img ? "border-blue-500" : "border-transparent"
                    }`}
                    onClick={() => handleSelectImage(img)}
                  />
                ))}
              </div>
              <div className="text-center mt-6">
                <button
                  onClick={handleTryOn}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
                  disabled={!selectedImage}
                >
                  Try On
                </button>
              </div>
            </div>
          )}

          {vtonImage && (
            <div className="mt-12 text-center">
              <h3 className="text-lg font-medium mb-4">Virtual Try-On Result</h3>
              <img src={vtonImage} alt="VTON Result" className="mx-auto w-80 rounded-lg shadow" />
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
