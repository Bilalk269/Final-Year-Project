import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';  // Import Link for navigation
import './HomePage.css';
import sketchItLogo from './Sketchit.jpg';

function HomePage() {
  // JavaScript logic to modify text content dynamically
  useEffect(() => {
    const comingSoonElement = document.querySelector('.coming-soon h2');
    if (comingSoonElement) {
      // Adding line break between "GREAT THINGS" and "ARE COMING"
      comingSoonElement.innerHTML = `
        GREAT THINGS <span>ARE COMING</span>
      `;
    }
  }, []);

  return (
    <div className="homepage">
      <div className="left-section">
        <img src={sketchItLogo} alt="Sketch It Logo" className="logo" />
        <div className="buttons">
          {/* Use Link to navigate to /sketch when Sketch button is clicked */}
          <Link to="/sketch">
            <button className="sketch-button">Sketch</button>
          </Link>
          <button onClick={() => alert('Upload functionality')} className="upload-button">Upload Image</button>
        </div>
      </div>
      <div className="right-section">
        <div className="coming-soon">
          <h2>GREAT THINGS ARE COMING</h2>
          <button className="learn-more-button">Learn More</button>
        </div>
      </div>
      <nav className="navigation">
        <button onClick={() => alert('Navigate to Home')} className="nav-button">Home</button>
      </nav>
    </div>
  );
}

export default HomePage;
