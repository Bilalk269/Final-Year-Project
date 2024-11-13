import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './components/Homepage';  // Import HomePage component
import SketchPage from './SketchPage/SketchPage';  // Import SketchPage component

const App = () => {
  return (
    <div>
      <Routes>
        {/* Home route */}
        <Route path="/" element={<HomePage />} />
        
        {/* Sketch route */}
        <Route path="/sketch" element={<SketchPage />} />
      </Routes>
    </div>
  );
};

export default App;
