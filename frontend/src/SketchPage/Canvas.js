import React, { useState, useRef, useEffect, useCallback } from "react";

// Global history for undo/redo functionality
const globalHistory = [];
let redoStack = [];

const Canvas = ({
  tool,
  brushColor,
  brushRadius,
  freeDrawings,
  setFreeDrawings,
  shapeDrawings,
  setShapeDrawings,
  setCanvasBase64, // Function to send Base64 string to parent
}) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [currentPoints, setCurrentPoints] = useState([]);

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    setStartX(e.nativeEvent.offsetX);
    setStartY(e.nativeEvent.offsetY);

    if (tool === "free") {
      const ctx = canvasRef.current.getContext("2d");
      ctx.beginPath();
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const ctx = canvasRef.current.getContext("2d");
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    if (tool === "free") {
      ctx.lineWidth = brushRadius;
      ctx.lineCap = "round";
      ctx.strokeStyle = brushColor;
      ctx.lineTo(x, y);
      ctx.stroke();

      setCurrentPoints((prevPoints) => [...prevPoints, { x, y }]);
    } else if (tool === "circle" || tool === "rectangle") {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      redrawCanvas(ctx);

      const width = x - startX;
      const height = y - startY;

      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushRadius;

      if (tool === "circle") {
        const radius = Math.sqrt(width ** 2 + height ** 2);
        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, Math.PI * 2);
        ctx.stroke();
      } else if (tool === "rectangle") {
        ctx.beginPath();
        ctx.rect(startX, startY, width, height);
        ctx.stroke();
      }
    }
  };

  const handleMouseUp = (e) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const endX = e.nativeEvent.offsetX;
    const endY = e.nativeEvent.offsetY;

    let newDrawing;
    if (tool === "free") {
      newDrawing = {
        tool: "free",
        points: currentPoints,
        color: brushColor,
        radius: brushRadius,
      };
      setFreeDrawings([...freeDrawings, newDrawing]);
    } else {
      newDrawing = {
        tool,
        startX,
        startY,
        endX,
        endY,
        color: brushColor,
        radius: brushRadius,
      };
      setShapeDrawings([...shapeDrawings, newDrawing]);
    }

    // Add new drawing to global history
    globalHistory.push(newDrawing);
    redoStack = []; // Clear redo stack on new action

    setCurrentPoints([]);
    analyzeSketch();
  };

  const redrawCanvas = useCallback(
    (ctx) => {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Redraw freehand drawings
      freeDrawings.forEach((drawing) => {
        ctx.strokeStyle = drawing.color;
        ctx.lineWidth = drawing.radius;
        ctx.beginPath();
        const points = drawing.points;
        if (points.length > 0) {
          ctx.moveTo(points[0].x, points[0].y);
          points.forEach((point) => ctx.lineTo(point.x, point.y));
        }
        ctx.stroke();
      });

      // Redraw shapes
      shapeDrawings.forEach((drawing) => {
        ctx.strokeStyle = drawing.color;
        ctx.lineWidth = drawing.radius;
        if (drawing.tool === "circle") {
          const radius = Math.sqrt(
            (drawing.endX - drawing.startX) ** 2 +
            (drawing.endY - drawing.startY) ** 2
          );
          ctx.beginPath();
          ctx.arc(drawing.startX, drawing.startY, radius, 0, Math.PI * 2);
          ctx.stroke();
        } else if (drawing.tool === "rectangle") {
          ctx.beginPath();
          ctx.rect(
            drawing.startX,
            drawing.startY,
            drawing.endX - drawing.startX,
            drawing.endY - drawing.startY
          );
          ctx.stroke();
        }
      });
    },
    [freeDrawings, shapeDrawings]
  );

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    redrawCanvas(ctx);
  }, [freeDrawings, shapeDrawings, redrawCanvas]);

  const analyzeSketch = () => {
    // Placeholder function for sketch analysis logic
    console.log("Sketch analysis placeholder.");
  };

  // Function to output canvas as Base64
  const getCanvasBase64 = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const base64Image = canvas.toDataURL("image/png");
      setCanvasBase64(base64Image.split(",")[1]); // Send the Base64 image to the parent component
    }
  };

  // Undo functionality
  const handleUndo = () => {
    if (globalHistory.length > 0) {
      const lastAction = globalHistory.pop();
      redoStack.push(lastAction);
      if (lastAction.tool === "free") {
        setFreeDrawings(freeDrawings.slice(0, -1));
      } else {
        setShapeDrawings(shapeDrawings.slice(0, -1));
      }
    }
  };

  // Redo functionality
  const handleRedo = () => {
    if (redoStack.length > 0) {
      const recoveredAction = redoStack.pop();
      globalHistory.push(recoveredAction);
      if (recoveredAction.tool === "free") {
        setFreeDrawings([...freeDrawings, recoveredAction]);
      } else {
        setShapeDrawings([...shapeDrawings, recoveredAction]);
      }
    }
  };

  // Clear functionality
  const handleClear = () => {
    globalHistory.length = 0;
    redoStack.length = 0;
    setFreeDrawings([]);
    setShapeDrawings([]);
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={handleUndo} disabled={globalHistory.length === 0}>
          Undo
        </button>
        <button onClick={handleRedo} disabled={redoStack.length === 0}>
          Redo
        </button>
        <button onClick={handleClear}>Clear</button>
        <button onClick={getCanvasBase64}>Get Canvas Base64</button> {/* Button to trigger Base64 conversion */}
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{
          border: "1px solid black",
          backgroundColor: "#fff",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setIsDrawing(false)}
      />
    </div>
  );
};

export default Canvas;
