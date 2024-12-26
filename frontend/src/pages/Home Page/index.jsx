import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import sketchItLogo from "/assets/Sketchit.jpg";

function HomePage() {
  useEffect(() => {
    const comingSoonElement = document.querySelector('.coming-soon h2');
    if (comingSoonElement) {
      comingSoonElement.innerHTML = `GREAT THINGS <span>ARE COMING</span>`;
    }
  }, []);

  return (
    <div className="homepage">
      {/* Left Section */}
      <div className="left-section">
        <img src={sketchItLogo} alt="Sketch It Logo" className="logo-main" />
        <div className="button-group">
          <Link to="/sketch">
            <button className="sketch-button">Sketch</button>
          </Link>
          <Link to="/upload-img">
            <button className="upload-img-button">Upload Image</button>
          </Link>
        </div>
      </div>

      {/* Right Section */}
      <div className="right-section">
        <div className="coming-soon">
          <h2>GREAT THINGS ARE COMING</h2>
          {/*<button className="learn-more-button">Learn More</button>*/}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
