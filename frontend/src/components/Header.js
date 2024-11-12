
import React from 'react';
import './Header.css';

const Header = () => {
    return (
        <header className="header">
          
            <h1>Welcome...</h1>
            <h2>Your Imagination, Our Canvas.</h2>
            <p>Welcome to a new era of artistic transformation!
                Dive into a world where every stroke tells a story, 
               and every detail finds its place in your vision.</p>
            <div className="header-buttons">
                <button className="Sketch">Sketch</button>
                <button className="Upload Image">Upload Image</button>
            </div>
        </header>
    );
};

export default Header;





