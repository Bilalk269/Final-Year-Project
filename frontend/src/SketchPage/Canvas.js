import React, { useState, useRef, useEffect, useCallback } from 'react';

const Canvas = ({ tool, brushColor, brushRadius, freeDrawings, setFreeDrawings, shapeDrawings, setShapeDrawings }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  const drawFree = (e) => {
    const ctx = canvasRef.current.getContext("2d");
    if (!isDrawing) return;

    ctx.lineWidth = brushRadius;
    ctx.lineCap = "round";
    ctx.strokeStyle = brushColor;

    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const drawShapePreview = (e) => {
    const ctx = canvasRef.current.getContext("2d");
    const width = e.nativeEvent.offsetX - startX;
    const height = e.nativeEvent.offsetY - startY;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    redrawCanvas(ctx);

    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushRadius;

    if (tool === "circle") {
      const radius = Math.sqrt(width * width + height * height);
      ctx.beginPath();
      ctx.arc(startX, startY, radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (tool === "rectangle") {
      ctx.beginPath();
      ctx.rect(startX, startY, width, height);
      ctx.stroke();
    }
  };

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

  const handleMouseUp = (e) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const endX = e.nativeEvent.offsetX;
    const endY = e.nativeEvent.offsetY;

    if (tool === "free") {
      const newFreehand = {
        tool: "free",
        startX,
        startY,
        points: [{ x: startX, y: startY }, { x: endX, y: endY }],
        color: brushColor,
        radius: brushRadius,
      };
      setFreeDrawings([...freeDrawings, newFreehand]);
    } else {
      const newShape = {
        tool,
        startX,
        startY,
        endX,
        endY,
        color: brushColor,
        radius: brushRadius,
      };
      setShapeDrawings([...shapeDrawings, newShape]);
    }

    // Automatically analyze the sketch after drawing is complete
    analyzeSketch();
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    if (tool === "free") {
      drawFree(e);
    } else {
      drawShapePreview(e);
    }
  };

  const redrawCanvas = useCallback((ctx) => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    freeDrawings.forEach((drawing) => {
      ctx.strokeStyle = drawing.color;
      ctx.lineWidth = drawing.radius;
      ctx.beginPath();
      ctx.moveTo(drawing.startX, drawing.startY);
      drawing.points.forEach((point) => ctx.lineTo(point.x, point.y));
      ctx.stroke();
    });

    shapeDrawings.forEach((drawing) => {
      ctx.strokeStyle = drawing.color;
      ctx.lineWidth = drawing.radius;
      if (drawing.tool === "circle") {
        const radius = Math.sqrt(Math.pow(drawing.endX - drawing.startX, 2) + Math.pow(drawing.endY - drawing.startY, 2));
        ctx.beginPath();
        ctx.arc(drawing.startX, drawing.startY, radius, 0, Math.PI * 2);
        ctx.stroke();
      } else if (drawing.tool === "rectangle") {
        ctx.beginPath();
        ctx.rect(drawing.startX, drawing.startY, drawing.endX - drawing.startX, drawing.endY - drawing.startY);
        ctx.stroke();
      }
    });
  }, [freeDrawings, shapeDrawings]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    redrawCanvas(ctx);
  }, [freeDrawings, shapeDrawings, redrawCanvas]);

  // Automatically retrieve images after sketch is completed
  const analyzeSketch = () => {
    // Placeholder for analyzing the sketch and retrieving images.
    // const retrieved = [
    //   'https://via.placeholder.com/100',
    //   'https://via.placeholder.com/100',
    //   'https://via.placeholder.com/100',
    //   'https://via.placeholder.com/100',
    //   'https://via.placeholder.com/100',
    // ]; // Placeholder image URLs for now
    // No need to use `retrievedImages` state here
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
      {/* Canvas Area */}
      <div style={{ flex: 1, position: 'relative' }}>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          style={{ backgroundColor: '#f0f0f0', border: '1px solid #ddd', display: 'block' }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        />
      </div>
    </div>
  );
};

export default Canvas;
