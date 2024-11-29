import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UploadPage.css';

function UploadPage() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [retrievedImages, setRetrievedImages] = useState([]);
  const navigate = useNavigate();

  // Handle Image Upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      fetchRetrievedImages(file);
    }
  };

  // Fetch Retrieved Images
  const fetchRetrievedImages = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setRetrievedImages(data.images || []);
      } else {
        console.error('Failed to retrieve images:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
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
          Upload Image
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
        {/* Add Home and Sketch Buttons */}
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
