import React, { useRef, useState, useEffect } from 'react';
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
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [hasDrawn, setHasDrawn] = useState(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const startX = e.nativeEvent.offsetX;
    const startY = e.nativeEvent.offsetY;

    setStartPos({ x: startX, y: startY });
    setIsDrawing(true);

    ctx.strokeStyle = isErasing ? '#FFFFFF' : color;
    ctx.fillStyle = isErasing ? '#FFFFFF' : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (shape === 'freehand') {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const currentX = e.nativeEvent.offsetX;
    const currentY = e.nativeEvent.offsetY;

    if (shape === 'freehand') {
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
    } else {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.drawImage(canvas, 0, 0);
      
      tempCtx.strokeStyle = isErasing ? '#FFFFFF' : color;
      tempCtx.fillStyle = isErasing ? '#FFFFFF' : color;
      tempCtx.lineWidth = brushSize;
      tempCtx.lineCap = 'round';
      tempCtx.lineJoin = 'round';

      drawShape(tempCtx, startPos.x, startPos.y, currentX, currentY);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(tempCanvas, 0, 0);
    }
  };

  const handleMouseUp = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const endX = e.nativeEvent.offsetX;
    const endY = e.nativeEvent.offsetY;

    if (shape !== 'freehand') {
      drawShape(ctx, startPos.x, startPos.y, endX, endY);
    }

    setHasDrawn(true);
    setIsDrawing(false);
  };

  const drawShape = (ctx, startX, startY, endX, endY) => {
    ctx.beginPath();
    
    switch (shape) {
      case 'rectangle':
        ctx.strokeRect(startX, startY, endX - startX, endY - startY);
        break;
      case 'circle': {
        const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      }
      case 'line':
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        break;
      case 'arrow': {
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        const angle = Math.atan2(endY - startY, endX - startX);
        const headLength = 15;
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - headLength * Math.cos(angle - Math.PI / 6),
          endY - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          endX - headLength * Math.cos(angle + Math.PI / 6),
          endY - headLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
        break;
      }
      case 'polygon': {
        const sides = 5;
        const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        const centerX = startX;
        const centerY = startY;
        ctx.moveTo(centerX + radius * Math.cos(0), centerY + radius * Math.sin(0));
        for (let i = 1; i <= sides; i++) {
          const theta = (i * 2 * Math.PI) / sides - Math.PI / 2;
          ctx.lineTo(
            centerX + radius * Math.cos(theta),
            centerY + radius * Math.sin(theta)
          );
        }
        ctx.closePath();
        ctx.stroke();
        break;
      }
      case 'star': {
        const points = 5;
        const outerRadius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        const innerRadius = outerRadius / 2;
        const centerX = startX;
        const centerY = startY;
        ctx.moveTo(
          centerX + outerRadius * Math.cos(0 - Math.PI / 2),
          centerY + outerRadius * Math.sin(0 - Math.PI / 2)
        );
        for (let i = 0; i <= 2 * points; i++) {
          const angle = (i * Math.PI) / points - Math.PI / 2;
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          ctx.lineTo(
            centerX + radius * Math.cos(angle),
            centerY + radius * Math.sin(angle)
          );
        }
        ctx.closePath();
        ctx.stroke();
        break;
      }
      default:
        break;
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setError(null);
    setHasDrawn(false);
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
    if (!hasDrawn) {
      setError('Please draw something on the canvas before analyzing');
      setRetrievedImages([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const tempCanvas = createWhiteBackgroundImage();
      const imageData = tempCanvas.toDataURL('image/png');
      const blob = await (await fetch(imageData)).blob();
      const formData = new FormData();
      formData.append('image', blob, 'sketch.png');
      formData.append('threshold', 0.29);

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
        setError('No similar images found. Try drawing something different.');
      }
    } catch (err) {
      console.error('Error fetching similar images:', err);
      setError('Failed to analyze sketch. Please try again.');
      setRetrievedImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadSketch = () => {
    if (!hasDrawn) {
      setError('Please draw something on the canvas before downloading');
      return;
    }
    
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
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
            <div className="canvas-actions">
              <button 
                className={`analyze-btn ${!hasDrawn ? 'disabled-btn' : ''}`} 
                onClick={handleAnalyze}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span> Analyzing...
                  </>
                ) : (
                  'Analyze Sketch'
                )}
              </button>
              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span> {error}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="results-section">
          <h2 className="section-title">Retrieved Images</h2>
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Searching for similar images...</p>
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
              {error ? (
                <p className="error-text">{error}</p>
              ) : (
                <>
                  <h3>No results yet</h3>
                  <p>Draw a sketch and click "Analyze" to find similar images</p>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SketchPage;