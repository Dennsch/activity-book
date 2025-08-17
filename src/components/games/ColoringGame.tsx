import React, { useState, useRef, useEffect } from 'react';
import './ColoringGame.css';

interface ColoringGameProps {
  onBack: () => void;
}

interface ColoringArea {
  id: string;
  path: string;
  originalColor: string;
}

const ColoringGame: React.FC<ColoringGameProps> = ({ onBack }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedColor, setSelectedColor] = useState('#FF6B6B');
  const [currentPicture, setCurrentPicture] = useState(0);
  const [coloredAreas, setColoredAreas] = useState<{ [key: string]: string }>({});
  const [completedPictures, setCompletedPictures] = useState(0);

  const colors = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#96CEB4', // Green
    '#FFEAA7', // Yellow
    '#DDA0DD', // Plum
    '#FFB347', // Orange
    '#98D8C8', // Mint
    '#F7DC6F', // Light Yellow
    '#BB8FCE'  // Light Purple


  useEffect(() => {
    setColoredAreas({});
  }, [currentPicture]);

  const handleAreaClick = (areaId: string) => {
    setColoredAreas(prev => ({
      ...prev,
      [areaId]: selectedColor
    }));
  };

  const getAreaColor = (area: ColoringArea): string => {
    return coloredAreas[area.id] || area.originalColor;
  };

  const isAreaColored = (area: ColoringArea): boolean => {
    return coloredAreas[area.id] !== undefined;
  };

  const getCompletionPercentage = (): number => {
    const colorableAreas = currentPic.areas.filter(area => area.originalColor === '#E8E8E8');
    const coloredCount = colorableAreas.filter(area => isAreaColored(area)).length;
    return Math.round((coloredCount / colorableAreas.length) * 100);
  };

  const nextPicture = () => {
    if (getCompletionPercentage() > 50) {
      setCompletedPictures(prev => prev + 1);
    }
    setCurrentPicture((prev) => (prev + 1) % pictures.length);
  };

  const clearColors = () => {
    setColoredAreas({});
  };

  return (
    <div className="coloring-game dinosaur-theme">
      <button className="back-button" onClick={onBack}>←</button>
      
      <div className="game-container">
        <h1 className="game-title">🎨 Color Fun! 🎨</h1>
        
        <div className="score-board">
          <div className="completion">
            Completed: {getCompletionPercentage()}%
          </div>
          <div className="pictures-done">
            Pictures: {completedPictures}
          </div>
        </div>

        <div className="coloring-container">
          <div className="picture-info">
            <h2 className="picture-title">
              {currentPic.emoji} {currentPic.name}
            </h2>
          </div>

          <div className="coloring-area">
            <svg
              ref={svgRef}
              viewBox={currentPic.viewBox}
              className="coloring-svg"
            >
              {currentPic.areas.map((area) => (
                <path
                  key={area.id}
                  d={area.path}
                  fill={getAreaColor(area)}
                  stroke="#333"
                  strokeWidth="2"
                  className={`coloring-path ${area.originalColor === '#E8E8E8' ? 'colorable' : 'fixed'}`}
                  onClick={() => area.originalColor === '#E8E8E8' && handleAreaClick(area.id)}
                />
              ))}
            </svg>
          </div>

          <div className="color-palette">
            <h3 className="palette-title">Choose a Color:</h3>
            <div className="colors-grid">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`color-button ${selectedColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          <div className="coloring-controls">
            <button className="control-button clear-button" onClick={clearColors}>
              🗑️ Clear All
            </button>
            <button className="control-button next-button" onClick={nextPicture}>
              ➡️ Next Picture
            </button>
          </div>
        </div>

        {getCompletionPercentage() === 100 && (
          <div className="completion-message">
            <div className="completion-emoji">🌟</div>
            <div className="completion-text">
              Amazing! You colored the whole picture!
            </div>
            <div className="celebration">🎨✨🎉</div>
          </div>
        )}

        <div className="coloring-tips">
          <div className="tip">
            <span className="tip-icon">🎨</span>
            <span className="tip-text">Click on gray areas to color them!</span>
          </div>
          <div className="tip">
            <span className="tip-icon">🌈</span>
            <span className="tip-text">Try different colors to make it beautiful!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColoringGame;