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
    },
    {
      name: 'Beautiful Butterfly',
      emoji: '🦋',
      viewBox: '0 0 400 300',
      areas: [
        { id: 'body', path: 'M200 50 L200 250 L210 250 L210 50 Z', originalColor: '#E8E8E8' },
        { id: 'left_upper_wing', path: 'M200 80 Q150 60 120 80 Q100 100 120 140 Q150 160 200 140 Z', originalColor: '#E8E8E8' },
        { id: 'left_lower_wing', path: 'M200 140 Q150 160 130 180 Q120 200 140 220 Q170 230 200 210 Z', originalColor: '#E8E8E8' },
        { id: 'right_upper_wing', path: 'M210 80 Q260 60 290 80 Q310 100 290 140 Q260 160 210 140 Z', originalColor: '#E8E8E8' },
        { id: 'right_lower_wing', path: 'M210 140 Q260 160 280 180 Q290 200 270 220 Q240 230 210 210 Z', originalColor: '#E8E8E8' },
        { id: 'antenna1', path: 'M195 50 Q190 40 185 35', originalColor: '#000000' },
        { id: 'antenna2', path: 'M215 50 Q220 40 225 35', originalColor: '#000000' },
        { id: 'wing_spots1', path: 'M160 100 Q160 90 170 90 Q180 90 180 100 Q180 110 170 110 Q160 110 160 100', originalColor: '#000000' },
        { id: 'wing_spots2', path: 'M240 100 Q240 90 250 90 Q260 90 260 100 Q260 110 250 110 Q240 110 240 100', originalColor: '#000000' }
      ]
    },
    {
      name: 'Pretty Flower',
      emoji: '🌸',
      viewBox: '0 0 300 400',
      areas: [
        { id: 'stem', path: 'M150 200 L150 350 L160 350 L160 200 Z', originalColor: '#E8E8E8' },
        { id: 'center', path: 'M150 120 Q150 100 170 100 Q190 100 190 120 Q190 140 170 140 Q150 140 150 120', originalColor: '#E8E8E8' },
        { id: 'petal1', path: 'M170 100 Q190 80 210 100 Q190 120 170 100', originalColor: '#E8E8E8' },
        { id: 'petal2', path: 'M190 120 Q210 140 190 160 Q170 140 190 120', originalColor: '#E8E8E8' },
        { id: 'petal3', path: 'M170 140 Q150 160 130 140 Q150 120 170 140', originalColor: '#E8E8E8' },
        { id: 'petal4', path: 'M150 120 Q130 100 150 80 Q170 100 150 120', originalColor: '#E8E8E8' },
        { id: 'petal5', path: 'M190 100 Q200 70 220 90 Q200 110 190 100', originalColor: '#E8E8E8' },
        { id: 'leaf1', path: 'M160 250 Q180 240 190 260 Q180 280 160 270 Q150 260 160 250', originalColor: '#E8E8E8' },
        { id: 'leaf2', path: 'M150 280 Q130 270 120 290 Q130 310 150 300 Q160 290 150 280', originalColor: '#E8E8E8' }
      ]
    },
    {
      name: 'Sailing Boat',
      emoji: '⛵',
      viewBox: '0 0 400 350',
      areas: [
        { id: 'hull', path: 'M100 250 Q100 230 120 230 L280 230 Q300 230 300 250 L320 280 Q320 300 300 300 L100 300 Q80 300 80 280 Z', originalColor: '#E8E8E8' },
        { id: 'mast', path: 'M200 80 L200 250 L210 250 L210 80 Z', originalColor: '#E8E8E8' },
        { id: 'main_sail', path: 'M210 80 L210 200 L300 180 L280 100 Z', originalColor: '#E8E8E8' },
        { id: 'front_sail', path: 'M200 80 L200 160 L130 140 L150 100 Z', originalColor: '#E8E8E8' },
        { id: 'flag', path: 'M210 80 L210 100 L240 90 L230 80 Z', originalColor: '#E8E8E8' },
        { id: 'water_line1', path: 'M50 320 Q100 310 150 320 Q200 330 250 320 Q300 310 350 320', originalColor: '#000000' },
        { id: 'water_line2', path: 'M60 330 Q110 320 160 330 Q210 340 260 330 Q310 320 360 330', originalColor: '#000000' }
      ]
    },
    {
      name: 'Happy Elephant',
      emoji: '🐘',
      viewBox: '0 0 450 350',
      areas: [
        { id: 'body', path: 'M150 150 Q150 120 180 120 L320 120 Q350 120 350 150 L350 220 Q350 250 320 250 L180 250 Q150 250 150 220 Z', originalColor: '#E8E8E8' },
        { id: 'head', path: 'M80 140 Q80 110 110 110 L180 110 Q210 110 210 140 L210 200 Q210 230 180 230 L110 230 Q80 230 80 200 Z', originalColor: '#E8E8E8' },
        { id: 'trunk', path: 'M80 180 Q60 180 50 200 Q40 220 50 240 Q60 260 80 260 Q90 250 90 240 Q90 220 90 200 Q90 180 80 180', originalColor: '#E8E8E8' },
        { id: 'ear', path: 'M110 110 Q90 90 70 110 Q60 130 80 150 Q100 160 120 140 Q130 120 110 110', originalColor: '#E8E8E8' },
        { id: 'leg1', path: 'M170 250 L170 300 L190 300 L190 250', originalColor: '#E8E8E8' },
        { id: 'leg2', path: 'M210 250 L210 300 L230 300 L230 250', originalColor: '#E8E8E8' },
        { id: 'leg3', path: 'M280 250 L280 300 L300 300 L300 250', originalColor: '#E8E8E8' },
        { id: 'leg4', path: 'M320 250 L320 300 L340 300 L340 250', originalColor: '#E8E8E8' },
        { id: 'eye', path: 'M130 150 Q130 140 140 140 Q150 140 150 150 Q150 160 140 160 Q130 160 130 150', originalColor: '#000000' },
        { id: 'tail', path: 'M350 180 Q370 180 380 190 Q380 200 370 210 Q360 210 350 200', originalColor: '#E8E8E8' }
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