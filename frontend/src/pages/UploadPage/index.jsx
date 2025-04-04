import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./index.css";

function UploadPage() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImageURL, setUploadedImageURL] = useState(null);
  const [retrievedImages, setRetrievedImages] = useState([]);
  const [sketchImage, setSketchImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingAction, setLoadingAction] = useState("");
  const navigate = useNavigate();

  // Download image function
  const downloadImage = (imageUrl, filename = 'retrieved-image') => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${filename}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setUploadedImage(file);
      setRetrievedImages([]);
      setSketchImage(null);
      setErrorMessage("");

      const imageUrl = URL.createObjectURL(file);
      setUploadedImageURL(imageUrl);
    } else {
      setErrorMessage("Please upload a valid image file.");
    }
  };

  const handleAnalyze = async () => {
    setSketchImage(null);
    if (!uploadedImage) {
      setErrorMessage("No image uploaded for analysis.");
      return;
    }

    setLoadingAction("analyze");
    setErrorMessage("");

    const formData = new FormData();
    formData.append("image", uploadedImage);
    formData.append("top_n", 10);

    try {
      const response = await axios.post("http://127.0.0.1:5000/find_similar", formData);
      const data = response.data;
      console.log(data);
      if (data.message === "No similar image found.") {
        setErrorMessage(data.message);
      } else {
        const decodedImages = data.similar_images.map((image) => ({
          url: "data:image/png;base64," + image.image,
          similarity: image.similarity
        }));
        setRetrievedImages(decodedImages);
      }
    } catch (error) {
      setErrorMessage("Error during analysis: " + (error.response?.data?.message || error.message));
    } finally {
      setLoadingAction("");
    }
  };

  const handleImageToSketch = async () => {
    setRetrievedImages([]);
    if (!uploadedImage) {
      setErrorMessage("No image uploaded for conversion.");
      return;
    }

    setLoadingAction("sketch");
    setErrorMessage("");

    const formData = new FormData();
    formData.append("image", uploadedImage);

    try {
      const response = await axios.post("http://127.0.0.1:5000/sketch", formData);
      const data = response.data;
      const sketch = "data:image/png;base64," + data.sketch;
      setSketchImage(sketch);
    } catch (error) {
      setErrorMessage("Error during sketch conversion: " + (error.response?.data?.message || error.message));
    } finally {
      setLoadingAction("");
    }
  };

  useEffect(() => {
    return () => {
      if (uploadedImageURL) {
        URL.revokeObjectURL(uploadedImageURL);
      }
    };
  }, [uploadedImageURL]);

  const handleReturnHome = () => {
    navigate("/");
  };

  const handleDrawsketch = () => {
    navigate("/sketch");
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="logo" onClick={handleReturnHome}>Sketch It</h1>
          <nav className="nav-links">
            <button className="nav-btn" onClick={handleReturnHome}>Home</button>
            <button className="nav-btn" onClick={handleDrawsketch}>Draw Sketch</button>
            <button className="nav-btn active">Upload Image</button>
            <button className="nav-btn" onClick={() => navigate('/generate_text')}>Generate Description</button>
            <button className="nav-btn" onClick={() => navigate('/edit_image')}>Edit Image</button>

          </nav>
        </div>
      </header>

      <main className="main-content">
        <div className="upload-section">
          <div className="upload-card">
            <h1 className="upload-title">Upload Your Image</h1>
            
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
              <div className="action-buttons">
                <button
                  className="action-btn analyze-btn"
                  onClick={handleAnalyze}
                  disabled={loadingAction === "analyze"}
                >
                  {loadingAction === "analyze" ? "Processing..." : "Analyze"}
                </button>
                <button
                  className="action-btn sketch-btn"
                  onClick={handleImageToSketch}
                  disabled={loadingAction === "sketch"}
                >
                  {loadingAction === "sketch" ? "Processing..." : "Convert to Sketch"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="results-section">
          {sketchImage && (
            <div className="result-card">
              <h2 className="result-title">Sketch Result</h2>
              <div className="result-content">
                <img src={sketchImage} alt="Sketch result" className="result-image" />
                <button 
                  className="download-btn sketch-download"
                  onClick={() => downloadImage(sketchImage, 'sketch-result')}
                >
                  Download Sketch
                </button>
              </div>
            </div>
          )}

          {retrievedImages && retrievedImages.length > 0 && (
            <div className="result-card">
              <h2 className="result-title">Similar Images ({retrievedImages.length})</h2>
              <div className="image-grid">
                {retrievedImages.map((image, index) => (
                  <div key={index} className="image-box">
                    <div className="image-container">
                      <img
                        src={image.url}
                        alt={`Retrieved ${index + 1}`}
                        className="retrieved-image"
                      />
                      <div className="image-overlay">
                        <span className="similarity-badge">
                          {Math.round(image.similarity * 100)}% match
                        </span>
                        <button 
                          className="download-btn"
                          onClick={() => downloadImage(image.url, `similar-image-${index+1}`)}
                          title="Download image"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 15V3M12 15L8 11M12 15L16 11M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" 
                                  stroke="currentColor" 
                                  strokeWidth="2" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!sketchImage && !(retrievedImages && retrievedImages.length > 0) && (
            <div className="empty-state">
              <div className="empty-icon">
                <svg viewBox="0 0 24 24" width="64" height="64">
                  <path fill="currentColor" d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" />
                </svg>
              </div>
              <h3>No results yet</h3>
              <p>Upload an image and click analyze or convert to see results</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default UploadPage;