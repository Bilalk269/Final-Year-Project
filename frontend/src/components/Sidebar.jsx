
// Sidebar.js
import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import sketchItLogo from "/assets/pic.jpg";

function Sidebar() {
  const menuItems = [
    { path: "/", label: "Home" },
    { path: "/upload-img", label: "Upload Image" },
    { path: "/sketch", label: "Sketch" },
  ];

  return (
    <div className="sidebar">
      <img src={sketchItLogo} alt="Sketch It Logo" className="logo" />
      <ul className="sidebar-menu">
        {menuItems.map((item, index) => (
          <li key={index} className="sidebar-item">
            <NavLink
              to={item.path}
              className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}
              aria-label={item.label}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
