import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const SketchPage = () => {
  const canvasRef = useRef(null);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [retrievedImages, setRetrievedImages] = useState([]);
  const [isErasing, setIsErasing] = useState(false);
  const [shape, setShape] = useState('freehand');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const startX = e.nativeEvent.offsetX;
    const startY = e.nativeEvent.offsetY;

    ctx.strokeStyle = isErasing ? '#FFFFFF' : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';

    if (shape === 'freehand') {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      
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
    } else {
      const handleMouseUp = (event) => {
        const endX = event.offsetX;
        const endY = event.offsetY;
        const width = endX - startX;
        const height = endY - startY;

        switch (shape) {
          case 'rectangle':
            ctx.strokeRect(startX, startY, width, height);
            break;
          case 'circle':
            ctx.beginPath();
            const radius = Math.sqrt(width ** 2 + height ** 2);
            ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
            ctx.stroke();
            break;
          case 'line':
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            break;
          case 'arrow': {
            // Draw line
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            // Draw arrowhead
            const angle = Math.atan2(endY - startY, endX - startX);
            const headLength = 10;
            ctx.beginPath();
            ctx.moveTo(endX, endY);
            ctx.lineTo(endX - headLength * Math.cos(angle - Math.PI / 6), endY - headLength * Math.sin(angle - Math.PI / 6));
            ctx.lineTo(endX - headLength * Math.cos(angle + Math.PI / 6), endY - headLength * Math.sin(angle + Math.PI / 6));
            ctx.lineTo(endX, endY);
            ctx.lineTo(endX - headLength * Math.cos(angle - Math.PI / 6), endY - headLength * Math.sin(angle - Math.PI / 6));
            ctx.stroke();
            break;
          }
          case 'polygon': {
            const sides = 5;
            const centerX = startX;
            const centerY = startY;
            const polyRadius = Math.sqrt(width ** 2 + height ** 2);
            ctx.beginPath();
            for (let i = 0; i < sides; i++) {
              const theta = (2 * Math.PI / sides) * i - Math.PI / 2;
              const x = centerX + polyRadius * Math.cos(theta);
              const y = centerY + polyRadius * Math.sin(theta);
              if (i === 0) {
                ctx.moveTo(x, y);
              } else {
                ctx.lineTo(x, y);
              }
            }
            ctx.closePath();
            ctx.stroke();
            break;
          }
          case 'star': {
            const points = 5;
            const outerRadius = Math.sqrt(width ** 2 + height ** 2);
            const innerRadius = outerRadius / 2;
            ctx.beginPath();
            for (let i = 0; i < 2 * points; i++) {
              const angle = Math.PI / points * i - Math.PI / 2;
              const r = i % 2 === 0 ? outerRadius : innerRadius;
              const x = startX + r * Math.cos(angle);
              const y = startY + r * Math.sin(angle);
              if (i === 0) {
                ctx.moveTo(x, y);
              } else {
                ctx.lineTo(x, y);
              }
            }
            ctx.closePath();
            ctx.stroke();
            break;
          }
          default:
            break;
        }
        canvas.removeEventListener('mouseup', handleMouseUp);
      };

      canvas.addEventListener('mouseup', handleMouseUp);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setError(null);
  };

  const createWhiteBackgroundImage = () => {
    const canvas = canvasRef.current;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.fillStyle = '#FFFFFF';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(canvas, 0, 0);
    return tempCanvas;
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const tempCanvas = createWhiteBackgroundImage();
      const imageData = tempCanvas.toDataURL('image/png');
      const blob = await (await fetch(imageData)).blob();
      const formData = new FormData();
      formData.append('image', blob, 'sketch.png');
      formData.append('threshold', 0.20);

      const response = await fetch('http://localhost:5000/find_similar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      if (data.similar_images) {
        setRetrievedImages(data.similar_images);
      } else {
        setRetrievedImages([]);
        setError('No similar images found');
      }
    } catch (err) {
      console.error('Error fetching similar images:', err);
      setError(err.message || 'Failed to analyze sketch');
      setRetrievedImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadSketch = () => {
    const tempCanvas = createWhiteBackgroundImage();
    const link = document.createElement('a');
    link.href = tempCanvas.toDataURL('image/png');
    link.download = 'sketch.png';
    link.click();
  };

  return (
    <div className="sketch-app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="logo" onClick={() => navigate('/')}>Sketch It</h1>
          <nav className="nav-links">
            <button className="nav-btn" onClick={() => navigate('/')}>Home</button>
            <button className="nav-btn" onClick={() => navigate('/upload-img')}>Upload Image</button>
            <button className="nav-btn active">Draw Sketch</button>
            <button className="nav-btn" onClick={() => navigate('/generate_text')}>Generate Description</button>
            <button className="nav-btn" onClick={() => navigate('/edit_image')}>Edit Image</button>
          </nav>
        </div>
      </header>

      <main className="sketch-main">
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
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="brush-slider"
              />
            </div>
            <div className="tool-group">
              <label className="tool-label">Shape</label>
              <select 
                value={shape}
                onChange={(e) => setShape(e.target.value)}
                className="shape-selector"
              >
                <option value="freehand">Freehand</option>
                <option value="rectangle">Rectangle</option>
                <option value="circle">Circle</option>
                <option value="line">Line</option>
                <option value="arrow">Arrow</option>
                <option value="polygon">Polygon</option>
                <option value="star">Star</option>
              </select>
            </div>
            <div className="tool-group">
              <button 
                className={`tool-btn ${isErasing ? 'eraser-active' : ''}`}
                onClick={() => setIsErasing(!isErasing)}
              >
                {isErasing ? 'Switch to Brush' : 'Eraser'}
              </button>
            </div>
            <div className="tool-group">
              <button className="tool-btn clear-btn" onClick={clearCanvas}>Clear Canvas</button>
              <button className="tool-btn" onClick={downloadSketch}>Download Sketch</button>
            </div>
          </div>
        </div>

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
            <button 
              className="analyze-btn" 
              onClick={handleAnalyze}
              disabled={isLoading}
            >
              {isLoading ? 'Analyzing...' : 'Analyze Sketch'}
            </button>
          </div>
        </div>

        <div className="results-section">
          <h2 className="section-title">Retrieved Images</h2>
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Searching for similar images...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p className="error-message">{error}</p>
            </div>
          ) : retrievedImages.length > 0 ? (
            <div className="image-grid">
              {retrievedImages.map((image, index) => (
                <div key={index} className="image-card">
                  <img 
                    src={`data:image/png;base64,${image.image}`} 
                    alt={`Retrieved ${index}`}
                    className="retrieved-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-image.png';
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
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