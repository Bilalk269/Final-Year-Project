import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Canvas from './Canvas';
import { useNavigate } from 'react-router-dom';
import './SketchPage.css'; // Import the CSS

const SketchPage = () => {
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushRadius, setBrushRadius] = useState(5);
  const [tool, setTool] = useState("free");
  const [freeDrawings, setFreeDrawings] = useState([]);
  const [shapeDrawings, setShapeDrawings] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [retrievedImages, setRetrievedImages] = useState(
    new Array(10).fill('https://via.placeholder.com/100') // Placeholder images
  );

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
    setSidebarOpen((prevState) => !prevState);
  };

  const analyzeSketch = () => {
    const canvas = document.querySelector("canvas");

    if (!canvas) return;

    // Convert canvas to Blob (image file)
    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const formData = new FormData();
      formData.append("file", blob, "sketch.png");

      try {
        // Send to backend
        const response = await fetch("http://localhost:5000/analyze", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to analyze the sketch.");
        }

        const result = await response.json();
        console.log(result);

        // Update retrievedImages with images received from the backend
        const imageUrls = result.images || []; // Ensure result.images is an array
        setRetrievedImages((prevImages) =>
          imageUrls.length
            ? imageUrls
            : prevImages.map(() => 'https://via.placeholder.com/100') // Default placeholder if no images are received
        );
      } catch (error) {
        console.error("Error analyzing sketch:", error);
        alert("Failed to analyze sketch. Please try again.");
      }
    });
  };

  const handleReturnHome = () => {
    navigate('/'); // Navigates to the HomePage
  };

  return (
    <div className="container">
      {/* Top button to open sidebar */}
      <button onClick={toggleSidebar} className="sidebar-toggle-btn">
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

        {/* Centered Canvas */}
        <div className="canvas-container">
          <Canvas
            tool={tool}
            brushColor={brushColor}
            brushRadius={brushRadius}
            freeDrawings={freeDrawings}
            setFreeDrawings={setFreeDrawings}
            shapeDrawings={shapeDrawings}
            setShapeDrawings={setShapeDrawings}
          />
        </div>

        {/* Image Retrieval Section */}
        <div className="image-container">
          {retrievedImages.map((image, index) => (
            <div key={index} className="image-box-item">
              <img src={image} alt={`retrieved-${index}`} />
            </div>
          ))}
          <button onClick={analyzeSketch} className="analyze-btn">
            Analyze Sketch
          </button>
        </div>
      </div>

      {/* Home Button in Top Right Corner */}
      <button onClick={handleReturnHome} className="home-btn">
        Home
      </button>
    </div>
  );
};

export default SketchPage;
