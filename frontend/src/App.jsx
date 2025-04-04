import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home Page';  
import SketchPage from './pages/SketchPage';  
import UploadPage from './pages/UploadPage';
import GenerateTextPage from './pages/GenerateTextPage';
import EditImage from './pages/EditImage';

const App = () => {
  return (
    <div>
      
      <Routes>
        
        <Route path="/" element={<HomePage />} />
        <Route path="/sketch" element={<SketchPage />} />
        <Route path="/upload-img" element={<UploadPage />} />
        <Route path="/generate_text" element={<GenerateTextPage />} />
        <Route path="/edit_image" element={<EditImage />} />
      </Routes>
    </div>
  );
};

export default App;




