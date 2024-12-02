import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UploadPage.css';

function UploadPage() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [retrievedImages, setRetrievedImages] = useState([]);
  const [sketchImage, setSketchImage] = useState(null);
  const navigate = useNavigate();

  // Handle Image Upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      setRetrievedImages([]);
      setSketchImage(null);
    }
  };

  // Fetch Retrieved Images for Analyze
  const handleAnalyze = async () => {
    if (!uploadedImage) {
      console.error('No image uploaded for analysis.');
      return;
    }

    const formData = new FormData();
    formData.append('image', uploadedImage);

    try {
      const response = await fetch('YOUR_ANALYZE_API_ENDPOINT', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        let images = data.images || []; // Expecting an array of image URLs

        // Ensure there are exactly 10 images (pad with placeholders if needed)
        const placeholder = 'https://via.placeholder.com/224';
        images = [...images.slice(0, 10), ...Array(10 - images.length).fill(placeholder)];
        setRetrievedImages(images);
      } else {
        console.error('Failed to analyze image:', response.statusText);
      }
    } catch (error) {
      console.error('Error during analysis:', error);
    }
  };

  // Convert Uploaded Image to Sketch
  const handleImageToSketch = async () => {
    if (!uploadedImage) {
      console.error('No image uploaded for conversion.');
      return;
    }

    const formData = new FormData();
    formData.append('image', uploadedImage);

    try {
      const response = await fetch('YOUR_CONVERSION_API_ENDPOINT', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.blob(); // Expecting a sketch image blob
        const sketchUrl = URL.createObjectURL(data);
        setSketchImage(sketchUrl);
      } else {
        console.error('Failed to convert image to sketch:', response.statusText);
      }
    } catch (error) {
      console.error('Error during sketch conversion:', error);
    }
  };

  // Navigate back to Home
  const handleReturnHome = () => {
    navigate('/');
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <h1 className="upload-title">Upload Your Image</h1>
        <button
          className="upload-button"
          onClick={() => document.getElementById('file-input').click()}
        >
          Choose Image File
        </button>
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="file-input"
        />

        {uploadedImage && (
          <div className="preview-container">
            <h2 className="preview-title">Preview</h2>
            <img src={uploadedImage} alt="Uploaded" className="preview-image" />
            <div className="action-buttons">
              <button className="analyze-butn" onClick={handleAnalyze}>
                Analyze
              </button>
              <button className="convert-btn" onClick={handleImageToSketch}>
                Convert to Sketch
              </button>
            </div>
          </div>
        )}

        {sketchImage && (
          <div className="sketch-preview">
            <h2 className="preview-title">Sketch Preview</h2>
            <img src={sketchImage} alt="Sketch" className="preview-image" />
          </div>
        )}

        {retrievedImages.length > 0 && (
          <div className="retrieved-images">
            <h2 className="preview-title">Retrieved Images</h2>
            <div className="image-grid">
              {retrievedImages.map((imageUrl, index) => (
                <div key={index} className="image-box">
                  <img
                    src={imageUrl}
                    alt={`Retrieved ${index + 1}`}
                    className="retrieved-image"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="button-group">
          <button onClick={handleReturnHome} className="home-btn">
            Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadPage;
