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
  ];

  const pictures = [
    {
      name: 'Happy Dinosaur',
      emoji: '🦕',
      viewBox: '0 0 400 400',
      areas: [
        { id: 'body', path: 'M100 200 Q100 150 150 150 Q200 150 250 150 Q300 150 300 200 Q300 250 250 250 Q200 250 150 250 Q100 250 100 200', originalColor: '#E8E8E8' },
        { id: 'head', path: 'M150 150 Q150 100 200 100 Q250 100 250 150 Q250 200 200 200 Q150 200 150 150', originalColor: '#E8E8E8' },
        { id: 'neck', path: 'M200 150 Q200 175 200 200', originalColor: '#E8E8E8' },
        { id: 'leg1', path: 'M150 250 L150 300 L170 300 L170 250', originalColor: '#E8E8E8' },
        { id: 'leg2', path: 'M180 250 L180 300 L200 300 L200 250', originalColor: '#E8E8E8' },
        { id: 'leg3', path: 'M210 250 L210 300 L230 300 L230 250', originalColor: '#E8E8E8' },
        { id: 'leg4', path: 'M240 250 L240 300 L260 300 L260 250', originalColor: '#E8E8E8' },
        { id: 'eye', path: 'M180 130 Q180 120 190 120 Q200 120 200 130 Q200 140 190 140 Q180 140 180 130', originalColor: '#000000' },
        { id: 'smile', path: 'M170 170 Q200 190 230 170', originalColor: '#000000' }
      ]
    },
    {
      name: 'Race Car',
      emoji: '🏎️',
      viewBox: '0 0 400 300',
      areas: [
        { id: 'body', path: 'M80 150 Q80 120 120 120 L280 120 Q320 120 320 150 L320 180 Q320 210 280 210 L120 210 Q80 210 80 180 Z', originalColor: '#E8E8E8' },
        { id: 'windshield', path: 'M140 120 Q140 100 160 100 L240 100 Q260 100 260 120 L260 140 L140 140 Z', originalColor: '#E8E8E8' },
        { id: 'wheel1', path: 'M120 210 Q120 190 140 190 Q160 190 160 210 Q160 230 140 230 Q120 230 120 210', originalColor: '#E8E8E8' },
        { id: 'wheel2', path: 'M240 210 Q240 190 260 190 Q280 190 280 210 Q280 230 260 230 Q240 230 240 210', originalColor: '#E8E8E8' },
        { id: 'stripe', path: 'M100 165 L300 165 L300 175 L100 175 Z', originalColor: '#E8E8E8' }
      ]
    },
    {
      name: 'Friendly Robot',
      emoji: '🤖',
      viewBox: '0 0 300 400',
      areas: [
        { id: 'head', path: 'M100 50 Q100 25 125 25 L175 25 Q200 25 200 50 L200 100 Q200 125 175 125 L125 125 Q100 125 100 100 Z', originalColor: '#E8E8E8' },
        { id: 'body', path: 'M75 125 Q75 100 100 100 L200 100 Q225 100 225 125 L225 250 Q225 275 200 275 L100 275 Q75 275 75 250 Z', originalColor: '#E8E8E8' },
        { id: 'arm1', path: 'M75 150 Q50 150 50 175 L50 200 Q50 225 75 225 L75 200 L75 175 Z', originalColor: '#E8E8E8' },
        { id: 'arm2', path: 'M225 150 Q250 150 250 175 L250 200 Q250 225 225 225 L225 200 L225 175 Z', originalColor: '#E8E8E8' },
        { id: 'leg1', path: 'M125 275 L125 350 Q125 375 150 375 L150 350 L150 275 Z', originalColor: '#E8E8E8' },
        { id: 'leg2', path: 'M175 275 L175 350 Q175 375 150 375 L150 350 L150 275 Z', originalColor: '#E8E8E8' },
        { id: 'eye1', path: 'M125 60 Q125 50 135 50 Q145 50 145 60 Q145 70 135 70 Q125 70 125 60', originalColor: '#000000' },
        { id: 'eye2', path: 'M155 60 Q155 50 165 50 Q175 50 175 60 Q175 70 165 70 Q155 70 155 60', originalColor: '#000000' },
        { id: 'mouth', path: 'M135 85 Q150 95 165 85', originalColor: '#000000' }
      ]
    }
  ];

  const currentPic = pictures[currentPicture];

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