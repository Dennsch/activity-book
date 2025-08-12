import React, { useState, useRef, useEffect } from 'react';
import './DotToDotGame.css';

interface DotToDotGameProps {
  onBack: () => void;
}

interface Dot {
  id: number;
  x: number;
  y: number;
  number: number;
}

interface DotToDotPicture {
  name: string;
  emoji: string;
  dots: Dot[];
  viewBox: string;
}

const DotToDotGame: React.FC<DotToDotGameProps> = ({ onBack }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [currentPicture, setCurrentPicture] = useState(0);
  const [connectedDots, setConnectedDots] = useState<number[]>([]);
  const [nextDotToConnect, setNextDotToConnect] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [completedPictures, setCompletedPictures] = useState(0);

  const pictures: DotToDotPicture[] = [
    {
      name: 'Happy Star',
      emoji: '⭐',
      viewBox: '0 0 400 400',
      dots: [
        { id: 1, x: 200, y: 50, number: 1 },
        { id: 2, x: 220, y: 120, number: 2 },
        { id: 3, x: 290, y: 120, number: 3 },
        { id: 4, x: 240, y: 170, number: 4 },
        { id: 5, x: 260, y: 240, number: 5 },
        { id: 6, x: 200, y: 200, number: 6 },
        { id: 7, x: 140, y: 240, number: 7 },
        { id: 8, x: 160, y: 170, number: 8 },
        { id: 9, x: 110, y: 120, number: 9 },
        { id: 10, x: 180, y: 120, number: 10 }
      ]
    },
    {
      name: 'Cute House',
      emoji: '🏠',
      viewBox: '0 0 400 400',
      dots: [
        { id: 1, x: 200, y: 80, number: 1 },
        { id: 2, x: 120, y: 160, number: 2 },
        { id: 3, x: 120, y: 320, number: 3 },
        { id: 4, x: 280, y: 320, number: 4 },
        { id: 5, x: 280, y: 160, number: 5 },
        { id: 6, x: 200, y: 80, number: 6 },
        { id: 7, x: 160, y: 200, number: 7 },
        { id: 8, x: 160, y: 260, number: 8 },
        { id: 9, x: 200, y: 260, number: 9 },
        { id: 10, x: 200, y: 200, number: 10 }
      ]
    },
    {
      name: 'Friendly Fish',
      emoji: '🐠',
      viewBox: '0 0 400 300',
      dots: [
        { id: 1, x: 80, y: 150, number: 1 },
        { id: 2, x: 120, y: 120, number: 2 },
        { id: 3, x: 200, y: 100, number: 3 },
        { id: 4, x: 280, y: 120, number: 4 },
        { id: 5, x: 320, y: 150, number: 5 },
        { id: 6, x: 280, y: 180, number: 6 },
        { id: 7, x: 200, y: 200, number: 7 },
        { id: 8, x: 120, y: 180, number: 8 },
        { id: 9, x: 80, y: 150, number: 9 },
        { id: 10, x: 50, y: 130, number: 10 },
        { id: 11, x: 30, y: 150, number: 11 },
        { id: 12, x: 50, y: 170, number: 12 }
      ]
    }
  ];

  const currentPic = pictures[currentPicture];

  useEffect(() => {
    setConnectedDots([]);
    setNextDotToConnect(1);
    setIsComplete(false);
  }, [currentPicture]);

  const handleDotClick = (dotNumber: number) => {
    if (dotNumber === nextDotToConnect) {
      const newConnectedDots = [...connectedDots, dotNumber];
      setConnectedDots(newConnectedDots);
      setNextDotToConnect(nextDotToConnect + 1);
      
      if (newConnectedDots.length === currentPic.dots.length) {
        setIsComplete(true);
        setCompletedPictures(prev => prev + 1);
      }
    }
  };

  const getDotById = (number: number): Dot | undefined => {
    return currentPic.dots.find(dot => dot.number === number);
  };

  const getPathData = (): string => {
    if (connectedDots.length < 2) return '';
    
    let pathData = '';
    for (let i = 0; i < connectedDots.length; i++) {
      const dot = getDotById(connectedDots[i]);
      if (dot) {
        if (i === 0) {
          pathData += `M ${dot.x} ${dot.y}`;
        } else {
          pathData += ` L ${dot.x} ${dot.y}`;
        }
      }
    }
    
    // Close the path if complete
    if (isComplete && connectedDots.length > 2) {
      const firstDot = getDotById(connectedDots[0]);
      if (firstDot) {
        pathData += ` L ${firstDot.x} ${firstDot.y}`;
      }
    }
    
    return pathData;
  };

  const nextPicture = () => {
    setCurrentPicture((prev) => (prev + 1) % pictures.length);
  };

  const resetPicture = () => {
    setConnectedDots([]);
    setNextDotToConnect(1);
    setIsComplete(false);
  };

  const getDotClass = (dotNumber: number): string => {
    if (connectedDots.includes(dotNumber)) {
      return 'dot connected';
    } else if (dotNumber === nextDotToConnect) {
      return 'dot next';
    } else {
      return 'dot';
    }
  };

  return (
    <div className="dot-to-dot-game car-theme">
      <button className="back-button" onClick={onBack}>←</button>
      
      <div className="game-container">
        <h1 className="game-title">🔗 Connect the Dots! 🔗</h1>
        
        <div className="score-board">
          <div className="progress">
            Connected: {connectedDots.length}/{currentPic.dots.length}
          </div>
          <div className="pictures-completed">
            Pictures: {completedPictures}
          </div>
        </div>

        <div className="dot-to-dot-container">
          <div className="picture-info">
            <h2 className="picture-title">
              {currentPic.emoji} {currentPic.name}
            </h2>
            <p className="instruction">
              Click on dot number <span className="next-number">{nextDotToConnect}</span>!
            </p>
          </div>

          <div className="drawing-area">
            <svg
              ref={svgRef}
              viewBox={currentPic.viewBox}
              className="dot-to-dot-svg"
            >
              {/* Draw the connected path */}
              {connectedDots.length > 1 && (
                <path
                  d={getPathData()}
                  stroke="#FF6B6B"
                  strokeWidth="4"
                  fill={isComplete ? "rgba(255, 107, 107, 0.2)" : "none"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="connection-path"
                />
              )}
              
              {/* Draw the dots */}
              {currentPic.dots.map((dot) => (
                <g key={dot.id}>
                  <circle
                    cx={dot.x}
                    cy={dot.y}
                    r="15"
                    className={getDotClass(dot.number)}
                    onClick={() => handleDotClick(dot.number)}
                  />
                  <text
                    x={dot.x}
                    y={dot.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="dot-number"
                    onClick={() => handleDotClick(dot.number)}
                  >
                    {dot.number}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="dot-to-dot-controls">
            <button className="control-button reset-button" onClick={resetPicture}>
              🔄 Start Over
            </button>
            <button className="control-button next-button" onClick={nextPicture}>
              ➡️ Next Picture
            </button>
          </div>
        </div>

        {isComplete && (
          <div className="completion-message">
            <div className="completion-emoji">🎉</div>
            <div className="completion-text">
              Wonderful! You revealed the {currentPic.name}!
            </div>
            <div className="celebration">{currentPic.emoji}✨🎊</div>
          </div>
        )}

        <div className="game-tips">
          <div className="tip">
            <span className="tip-icon">🔢</span>
            <span className="tip-text">Connect the dots in number order!</span>
          </div>
          <div className="tip">
            <span className="tip-icon">✨</span>
            <span className="tip-text">Watch the picture appear as you connect!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DotToDotGame;