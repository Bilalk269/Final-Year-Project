import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './index.css';
import sketchItLogo from "/assets/Sketchit.jpg";

function HomePage() {
  useEffect(() => {
    const comingSoonElement = document.querySelector('.coming-soon h2');
    if (comingSoonElement) {
      comingSoonElement.innerHTML = `GREAT THINGS <span>ARE COMING</span>`;
    }
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      transition: { 
        duration: 0.3,
        yoyo: Infinity,
        ease: "easeOut"
      }
    },
    tap: { scale: 0.95 }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.03, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div 
      className="homepage"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Left Section */}
      <motion.div className="left-section" variants={itemVariants}>
        <motion.img 
          src={sketchItLogo} 
          alt="Sketch It Logo" 
          className="logo-main"
          whileHover={{ rotate: [0, -5, 5, -5, 0] }}
          transition={{ duration: 0.8 }}
        />
        <div className="button-group">
          <Link to="/sketch">
            <motion.button 
              className="sketch-button"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Sketch
            </motion.button>
          </Link>
          <Link to="/upload-img">
            <motion.button 
              className="upload-img-button"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Upload Image
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Right Section */}
      <motion.div className="right-section" variants={itemVariants}>
        <motion.div 
          className="coming-soon"
          variants={pulseVariants}
          animate="animate"
        >
          <h2>GREAT THINGS ARE COMING</h2>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default HomePage;