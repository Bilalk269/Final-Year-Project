// src/App.js
import React from 'react';
import Navbar from './components/Navbar';
import Header from './components/Header';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="blur-overlay"></div> {/* Blur overlay */}
      <Navbar />
      <Header />
    </div>
  );
}

export default App;
