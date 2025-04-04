import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

function EditImage() {
  const [image, setImage] = useState(null);
  const [editedImage, setEditedImage] = useState(null);
  const [edits, setEdits] = useState({
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    sepia: 0,
    blur: 0,
    hue: 0
  });
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  // Add missing navigation handlers
  const handleReturnHome = () => navigate('/');
  const handleDrawsketch = () => navigate('/sketch');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
        setEditedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyFilters = () => {
    if (!image) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.filter = `
        brightness(${edits.brightness}%)
        contrast(${edits.contrast}%)
        grayscale(${edits.grayscale}%)
        sepia(${edits.sepia}%)
        blur(${edits.blur}px)
        hue-rotate(${edits.hue}deg)
      `;
      
      ctx.drawImage(img, 0, 0);
      setEditedImage(canvas.toDataURL('image/png'));
    };
    
    img.src = image;
  };

  const handleDownload = () => {
    if (!editedImage) return;
    
    const link = document.createElement('a');
    link.href = editedImage;
    link.download = `edited-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setEdits({
      brightness: 100,
      contrast: 100,
      grayscale: 0,
      sepia: 0,
      blur: 0,
      hue: 0
    });
    setEditedImage(image);
  };

  return (
    <div className="edit-image-page">
      <header className="edit-header">
        <div className="header-content">
          <h1 className="logo" onClick={handleReturnHome}>Sketch It</h1>
          <nav className="nav-links">
            <button className="nav-btn" onClick={handleReturnHome}>Home</button>
            <button className="nav-btn" onClick={handleDrawsketch}>Draw Sketch</button>
            <button className="nav-btn" onClick={() => navigate('/upload-img')}>Upload Image</button>
            <button className="nav-btn" onClick={() => navigate('/generate_text')}>Generate Description</button>
            <button className="nav-btn active">Edit Image</button>
          </nav>
        </div>
      </header>

      <div className="edit-container">
        <div className="upload-section">
          <div 
            className="upload-box"
            onClick={() => fileInputRef.current.click()}
          >
            {image ? (
              <img src={image} alt="Original" className="preview-image" />
            ) : (
              <>
                <div className="upload-icon">
                  <svg viewBox="0 0 24 24" width="48" height="48">
                    <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                </div>
                <p>Click to upload an image</p>
              </>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>
        </div>

        <div className="editor-section">
          <div className="controls">
            <div className="control-group">
              <label>Brightness</label>
              <input
                type="range"
                min="0"
                max="200"
                value={edits.brightness}
                onChange={(e) => setEdits({...edits, brightness: e.target.value})}
              />
              <span>{edits.brightness}%</span>
            </div>

            <div className="control-group">
              <label>Contrast</label>
              <input
                type="range"
                min="0"
                max="200"
                value={edits.contrast}
                onChange={(e) => setEdits({...edits, contrast: e.target.value})}
              />
              <span>{edits.contrast}%</span>
            </div>

            <div className="control-group">
              <label>Grayscale</label>
              <input
                type="range"
                min="0"
                max="100"
                value={edits.grayscale}
                onChange={(e) => setEdits({...edits, grayscale: e.target.value})}
              />
              <span>{edits.grayscale}%</span>
            </div>

            <div className="control-group">
              <label>Sepia</label>
              <input
                type="range"
                min="0"
                max="100"
                value={edits.sepia}
                onChange={(e) => setEdits({...edits, sepia: e.target.value})}
              />
              <span>{edits.sepia}%</span>
            </div>

            <div className="control-group">
              <label>Blur</label>
              <input
                type="range"
                min="0"
                max="10"
                value={edits.blur}
                onChange={(e) => setEdits({...edits, blur: e.target.value})}
              />
              <span>{edits.blur}px</span>
            </div>

            <div className="control-group">
              <label>Hue Rotate</label>
              <input
                type="range"
                min="0"
                max="360"
                value={edits.hue}
                onChange={(e) => setEdits({...edits, hue: e.target.value})}
              />
              <span>{edits.hue}°</span>
            </div>

            <div className="action-buttons">
              <button onClick={applyFilters} className="apply-btn">
                Apply Filters
              </button>
              <button onClick={handleReset} className="reset-btn">
                Reset
              </button>
            </div>
          </div>

          <div className="result-section">
            <h3>Edited Preview</h3>
            <div className="result-box">
              {editedImage ? (
                <img src={editedImage} alt="Edited" className="result-image" />
              ) : (
                <p>Your edited image will appear here</p>
              )}
            </div>
            <button 
              onClick={handleDownload} 
              className="download-btn"
              disabled={!editedImage}
            >
              Download Edited Image
            </button>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

export default EditImage;