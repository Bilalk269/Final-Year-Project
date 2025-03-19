import React, { useRef } from 'react';
import './index.css';

const SketchPage = () => {
  const canvasRef = useRef(null);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
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

  return (
    <div className="homepage">
      {/* Navigation Header */}
      <nav style={{
        width: '100%', backgroundColor: '#1a1a1a', color: '#ffffff', padding: '10px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'absolute', top: 0, zIndex: 10
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Sketch-Based Image Retrieval</div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <a href="#" style={{ color: '#ffffff', textDecoration: 'none' }}>Home</a>
          <a href="#" style={{ color: '#ffffff', textDecoration: 'none' }}>Upload Image</a>
          <a href="#" style={{ color: '#ffffff', textDecoration: 'none' }}>Generate Text</a>
        </div>
      </nav>

      {/* Left Section: Canvas */}
      <div className="left-section">
        <h2 style={{ marginTop: '60px' }}>Draw Your Sketch</h2>
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          style={{ border: '2px solid #000', backgroundColor: '#fff', marginTop: '20px' }}
          onMouseDown={handleMouseDown}
        />
      </div>

      {/* Right Section: Result Boxes */}
      <div className="right-section" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: '10px', justifyContent: 'flex-start', alignContent: 'flex-start' }}>
        {[...Array(10)].map((_, index) => (
          <div
            key={index}
            style={{
              width: '120px',
              height: '120px',
              backgroundColor: '#2c2c2c',
              borderRadius: '10px',
              margin: '10px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid #444'
            }}
          >
            <span>Box {index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SketchPage;
