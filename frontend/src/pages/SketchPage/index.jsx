import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const SketchPage = () => {
  const canvasRef = useRef(null);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [retrievedImages, setRetrievedImages] = useState([]);
  const navigate = useNavigate();

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);

    const draw = (event) => {
      ctx.lineTo(event.offsetX, event.offsetY);
      ctx.stroke();
    };

    const stopDrawing = () => {
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
    };

    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleAnalyze = () => {
    // Simulate API call with mock data
    const mockImages = Array(10).fill().map((_, i) => ({
      id: i,
      url: `https://source.unsplash.com/random/200x200?sig=${i}`
    }));
    setRetrievedImages(mockImages);
  };

  return (
    <div className="sketch-app">
      {/* Navigation Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="logo" onClick={() => navigate('/')}>Sketch It</h1>
          <nav className="nav-links">
            <button className="nav-btn" onClick={() => navigate('/')}>Home</button>
            <button className="nav-btn" onClick={() => navigate('/upload-img')}>Upload Image</button>
            <button className="nav-btn active">Draw Sketch</button>
            <button className="nav-btn" onClick={() => navigate('/generate_text')}>Generate Description</button>
          </nav>
        </div>
      </header>

      <main className="sketch-main">
        {/* Left Section: Toolbox */}
        <div className="toolbox-section">
          <div className="toolbox">
            <h3 className="toolbox-title">Drawing Tools</h3>
            
            <div className="tool-group">
              <label className="tool-label">Brush Color</label>
              <input 
                type="color" 
                value={color} 
                onChange={(e) => setColor(e.target.value)}
                className="color-picker"
              />
            </div>
            
            <div className="tool-group">
              <label className="tool-label">Brush Size: {brushSize}px</label>
              <input 
                type="range" 
                min="1" 
                max="20" 
                value={brushSize} 
                onChange={(e) => setBrushSize(e.target.value)}
                className="brush-slider"
              />
            </div>
            
            <div className="tool-group">
              <button className="tool-btn clear-btn" onClick={clearCanvas}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="currentColor"/>
                </svg>
                Clear Canvas
              </button>
            </div>
          </div>
        </div>

        {/* Middle Section: Canvas */}
        <div className="canvas-section">
          <div className="canvas-container">
            <h2 className="section-title">Draw Your Sketch</h2>
            <canvas
              ref={canvasRef}
              width={650}
              height={650}
              className="drawing-canvas"
              onMouseDown={handleMouseDown}
            />
            <button className="analyze-btn" onClick={handleAnalyze}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{marginRight: "8px"}}>
                <path d="M10 3H4C3.46957 3 2.96086 3.21071 2.58579 3.58579C2.21071 3.96086 2 4.46957 2 5V19C2 20.1 2.9 21 4 21H20C20.5304 21 21.0391 20.7893 21.4142 20.4142C21.7893 20.0391 22 19.5304 22 19V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M18.25 2.5C18.5815 2.18934 19.0318 2.01034 19.5 2.01034C19.9682 2.01034 20.4185 2.18934 20.75 2.5C21.0815 2.81066 21.267 3.23726 21.267 3.6825C21.267 4.12774 21.0815 4.55434 20.75 4.865L12.75 12.5L9 14L10.5 10.25L18.25 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Analyze Sketch
            </button>
          </div>
        </div>

        {/* Right Section: Results */}
        <div className="results-section">
          <h2 className="section-title">Retrieved Images</h2>
          {retrievedImages.length > 0 ? (
            <div className="image-grid">
              {retrievedImages.map((image) => (
                <div key={image.id} className="image-card">
                  <img src={image.url} alt={`Retrieved ${image.id}`} />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <svg viewBox="0 0 24 24" width="64" height="64">
                  <path fill="#888" d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" />
                </svg>
              </div>
              <h3>No results yet</h3>
              <p>Draw a sketch and click "Analyze" to find similar images</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SketchPage;