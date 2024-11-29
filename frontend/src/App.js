import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './components/Homepage';  // Import HomePage component
import SketchPage from './SketchPage/SketchPage';  // Import SketchPage component\
import UploadPage from './UploadPage/UploadPage';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sketch" element={<SketchPage />} />
        <Route path="/upload-img" element={<UploadPage />} />
      </Routes>
    </div>
  );
};

export default App;




