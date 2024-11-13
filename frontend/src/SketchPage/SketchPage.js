import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Canvas from './Canvas';
import { useNavigate } from 'react-router-dom';
import './SketchPage.css';  // Import the CSS

const SketchPage = () => {
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushRadius, setBrushRadius] = useState(5);
  const [tool, setTool] = useState("free");
  const [freeDrawings, setFreeDrawings] = useState([]);
  const [shapeDrawings, setShapeDrawings] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [retrievedImages, setRetrievedImages] = useState([null, null, null, null, null]);

  const navigate = useNavigate(); // Used for navigation

  const handleUndo = () => {
    if (freeDrawings.length === 0 && shapeDrawings.length === 0) return;
    const newFreeDrawings = [...freeDrawings];
    const newShapeDrawings = [...shapeDrawings];
    const lastDrawing = newFreeDrawings.pop() || newShapeDrawings.pop();
    setUndoStack([...undoStack, lastDrawing]);

    setFreeDrawings(newFreeDrawings);
    setShapeDrawings(newShapeDrawings);
  };

  const handleRedo = () => {
    if (undoStack.length === 0) return;
    const newUndoStack = [...undoStack];
    const drawingToRestore = newUndoStack.pop();

    if (drawingToRestore.tool === "free") {
      setFreeDrawings([...freeDrawings, drawingToRestore]);
    } else {
      setShapeDrawings([...shapeDrawings, drawingToRestore]);
    }

    setUndoStack(newUndoStack);
  };

  const handleClear = () => {
    setFreeDrawings([]);
    setShapeDrawings([]);
    setUndoStack([]);
  };

  const toggleSidebar = () => {
    setSidebarOpen(prevState => !prevState);
  };

  const analyzeSketch = () => {
    const retrieved = [
      'https://via.placeholder.com/100',
      'https://via.placeholder.com/100',
      'https://via.placeholder.com/100',
      'https://via.placeholder.com/100',
      'https://via.placeholder.com/100',
    ];
    setRetrievedImages(retrieved);
  };

  const handleReturnHome = () => {
    navigate('/'); // Navigates to the HomePage
  };

  return (
    <div className="container">
      {/* Top button to open sidebar */}
      <button
        onClick={toggleSidebar}
        className="sidebar-toggle-btn"
      >
        {isSidebarOpen ? 'Close Tools' : 'Open Tools'}
      </button>

      {/* Main content */}
      <div className="main-content">
        <Sidebar
          brushColor={brushColor}
          setBrushColor={setBrushColor}
          brushRadius={brushRadius}
          setBrushRadius={setBrushRadius}
          setTool={setTool}
          handleUndo={handleUndo}
          handleRedo={handleRedo}
          handleClear={handleClear}
          isOpen={isSidebarOpen}
          className={isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}
        />

        <Canvas
          tool={tool}
          brushColor={brushColor}
          brushRadius={brushRadius}
          freeDrawings={freeDrawings}
          setFreeDrawings={setFreeDrawings}
          shapeDrawings={shapeDrawings}
          setShapeDrawings={setShapeDrawings}
        />

        <div className="image-container">
          <div className="image-box">
            {retrievedImages.map((image, index) => (
              <div key={index} className="image-box-item">
                {image ? (
                  <img src={image} alt={`retrieved-${index}`} />
                ) : (
                  <div>No Image</div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={analyzeSketch}
            className="analyze-btn"
          >
            Analyze Sketch
          </button>
        </div>
      </div>

      {/* Home Button in Top Right Corner */}
      <button
        onClick={handleReturnHome}
        className="home-btn"
      >
        Home
      </button>
    </div>
  );
};

export default SketchPage;
