import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./index.css";

function GenerateTextPage() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImageURL, setUploadedImageURL] = useState(null);
  const [generatedText, setGeneratedText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setUploadedImage(file);
      setGeneratedText("");
      setErrorMessage("");

      const imageUrl = URL.createObjectURL(file);
      setUploadedImageURL(imageUrl);
    } else {
      setErrorMessage("Please upload a valid image file.");
    }
  };

  const handleGenerateText = async () => {
    if (!uploadedImage) {
      setErrorMessage("No image uploaded for text generation.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("image", uploadedImage);

    try {
      const response = await axios.post("http://127.0.0.1:5000/generate_text", formData);
      setGeneratedText(response.data.description);
    } catch (error) {
      setErrorMessage("Error during text generation: " + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturnHome = () => {
    navigate("/");
  };

  const handleDrawSketch = () => {
    navigate("/sketch");
  };

  const handleUploadImage = () => {
    navigate("/upload");
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="logo" onClick={handleReturnHome}>Sketch It</h1>
          <nav className="nav-links">
            <button className="nav-btn" onClick={handleReturnHome}>Home</button>
            <button className="nav-btn" onClick={handleUploadImage}>Upload Image</button>
            <button className="nav-btn" onClick={handleDrawSketch}>Draw Sketch</button>
            <button className="nav-btn active">Generate Text</button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <div className="upload-section">
          <div className="upload-card">
            <h1 className="upload-title">Upload Image for Text Generation</h1>
            
            <div className="upload-area" onClick={() => document.getElementById("file-input").click()}>
              {uploadedImageURL ? (
                <img src={uploadedImageURL} alt="Uploaded preview" className="upload-preview" />
              ) : (
                <>
                  <div className="upload-icon">
                    <svg viewBox="0 0 24 24" width="48" height="48">
                      <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                  </div>
                  <p className="upload-instruction">Click to select an image</p>
                  <p className="upload-subtext">or drag and drop</p>
                </>
              )}
            </div>

            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="file-input"
            />

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            {uploadedImageURL && (
              <button
                className="action-btn generate-btn"
                onClick={handleGenerateText}
                disabled={isLoading}
              >
                {isLoading ? "Generating..." : "Generate Text"}
              </button>
            )}
          </div>
        </div>

        <div className="results-section">
          <div className="text-result-card">
            <h2 className="result-title">Generated Description</h2>
            <div className="text-content">
              {generatedText ? (
                <p className="generated-text">{generatedText}</p>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <svg viewBox="0 0 24 24" width="64" height="64">
                      <path fill="#888" d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" />
                    </svg>
                  </div>
                  <h3>No description yet</h3>
                  <p>Upload an image and click "Generate Text" to get a description</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default GenerateTextPage;