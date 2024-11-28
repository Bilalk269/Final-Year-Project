import React from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  position: absolute;
  top: 300px;
  left: 0;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  padding: 20px;
  width: 200px;
  height: auto;
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 0 8px 8px 0;
  z-index: 10;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const ToolOption = styled.div`
  margin-top: 15px;
  width: 100%;
  text-align: center;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border: none;
  background-color: #007bff;
  color: white;
  font-size: 14px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const Sidebar = ({
  brushColor,
  setBrushColor,
  brushRadius,
  setBrushRadius,
  setTool,
  isOpen,
}) => {
  return (
    <SidebarContainer isOpen={isOpen}>
      <ToolOption>
        <label>Brush Color:</label>
        <input
          type="color"
          value={brushColor}
          onChange={(e) => setBrushColor(e.target.value)}
        />
      </ToolOption>

      <ToolOption>
        <label>Brush Size:</label>
        <input
          type="range"
          min="1"
          max="20"
          value={brushRadius}
          onChange={(e) => setBrushRadius(parseInt(e.target.value))}
        />
      </ToolOption>

      <ToolOption>
        <label>Tools:</label>
        <Button onClick={() => setTool("free")}>Free Draw</Button>
        <Button onClick={() => setTool("circle")}>Circle</Button>
        <Button onClick={() => setTool("rectangle")}>Rectangle</Button>
      </ToolOption>
    </SidebarContainer>
  );
};

export default Sidebar;
