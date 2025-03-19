import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home Page';  
import SketchPage from './pages/SkectchPage';  
import UploadPage from './pages/Upload Page';

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




