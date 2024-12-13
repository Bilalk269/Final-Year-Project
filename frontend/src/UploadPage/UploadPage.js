import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UploadPage.css';

function UploadPage() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [retrievedImages, setRetrievedImages] = useState([]);
  const [sketchImage, setSketchImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);  // Single loading state for both actions
  const navigate = useNavigate();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedImage(file);
      setRetrievedImages([]);
      setSketchImage(null);
      setErrorMessage('');
    } else {
      setErrorMessage('Please upload a valid image file.');
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedImage) {
      setErrorMessage('No image uploaded for analysis.');
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    
    const formData = new FormData();
    formData.append('image', uploadedImage);
    try {
      const response = await fetch('http://127.0.0.1:5000/find_similar', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const decodedImages = data.similar_images.map(
          (image) => "data:image/jpg;base64," + image.image
        );
        setRetrievedImages(decodedImages);
      } else {
        setErrorMessage('Failed to analyze image. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Error during analysis: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageToSketch = async () => {
    if (!uploadedImage) {
      setErrorMessage('No image uploaded for conversion.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    const formData = new FormData();
    formData.append('image', uploadedImage);
    try {
      const response = await fetch('http://127.0.0.1:5000/sketch', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const sketchImage = "data:image/jpg;base64," + data.sketch;
        setSketchImage(sketchImage);
      } else {
        setErrorMessage('Failed to convert image to sketch. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Error during sketch conversion: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (uploadedImage) {
        URL.revokeObjectURL(uploadedImage);
      }
    };
  }, [uploadedImage]);

  const handleReturnHome = () => {
    navigate('/');
  };

  const getUploadedImageURL = () => {
    return URL.createObjectURL(uploadedImage);
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

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {uploadedImage && (
          <div className="preview-container">
            <h2 className="preview-title">Preview</h2>
            <img src={getUploadedImageURL()} alt="Uploaded" className="preview-image" />
            <div className="action-buttons">
              <button 
                className="analyze-btn" 
                onClick={handleAnalyze} 
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Analyze'}
              </button>
              <button 
                className="convert-btn" 
                onClick={handleImageToSketch} 
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Convert to Sketch'}
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
