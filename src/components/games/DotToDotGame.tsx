import React, { useState, useRef, useEffect } from "react";
import "./DotToDotGame.css";

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
  const [nextDotToConnect, setNextDotToConnect] = useState(1); // Will be updated in useEffect
  const [isComplete, setIsComplete] = useState(false);
  const [completedPictures, setCompletedPictures] = useState(0);

  const pictures: DotToDotPicture[] = [
    {
      name: "Happy Star",
      emoji: "⭐",
      viewBox: "0 0 400 400",
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
        { id: 10, x: 180, y: 120, number: 10 },
      ],
    },
    {
      name: "Cute House",
      emoji: "🏠",
      viewBox: "0 0 400 400",
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
        { id: 10, x: 200, y: 200, number: 10 },
      ],
    },
    {
      name: "Friendly Fish",
      emoji: "🐠",
      viewBox: "0 0 400 300",
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
        { id: 12, x: 50, y: 170, number: 12 },
      ],
    },
    {
      name: "Racing Car",
      emoji: "🏎️",
      viewBox: "0 0 450 300",
      dots: [
        { id: 1, x: 100, y: 180, number: 1 },
        { id: 2, x: 120, y: 160, number: 2 },
        { id: 3, x: 180, y: 140, number: 3 },
        { id: 4, x: 250, y: 140, number: 4 },
        { id: 5, x: 320, y: 160, number: 5 },
        { id: 6, x: 340, y: 180, number: 6 },
        { id: 7, x: 340, y: 220, number: 7 },
        { id: 8, x: 300, y: 240, number: 8 },
        { id: 9, x: 280, y: 260, number: 9 },
        { id: 10, x: 160, y: 260, number: 10 },
        { id: 11, x: 140, y: 240, number: 11 },
        { id: 12, x: 100, y: 220, number: 12 },
        { id: 13, x: 100, y: 180, number: 13 },
        { id: 14, x: 130, y: 200, number: 14 },
        { id: 15, x: 310, y: 200, number: 15 },
      ],
    },
    {
      name: "Smiling Sun",
      emoji: "☀️",
      viewBox: "0 0 400 400",
      dots: [
        { id: 1, x: 200, y: 80, number: 1 },
        { id: 2, x: 280, y: 120, number: 2 },
        { id: 3, x: 320, y: 200, number: 3 },
        { id: 4, x: 280, y: 280, number: 4 },
        { id: 5, x: 200, y: 320, number: 5 },
        { id: 6, x: 120, y: 280, number: 6 },
        { id: 7, x: 80, y: 200, number: 7 },
        { id: 8, x: 120, y: 120, number: 8 },
        { id: 9, x: 200, y: 80, number: 9 },
        { id: 10, x: 170, y: 170, number: 10 },
        { id: 11, x: 230, y: 170, number: 11 },
        { id: 12, x: 170, y: 230, number: 12 },
        { id: 13, x: 200, y: 250, number: 13 },
        { id: 14, x: 230, y: 230, number: 14 },
      ],
    },
    {
      name: "Cute Cat",
      emoji: "🐱",
      viewBox: "0 0 400 400",
      dots: [
        { id: 1, x: 150, y: 100, number: 1 },
        { id: 2, x: 120, y: 80, number: 2 },
        { id: 3, x: 140, y: 60, number: 3 },
        { id: 4, x: 200, y: 50, number: 4 },
        { id: 5, x: 260, y: 60, number: 5 },
        { id: 6, x: 280, y: 80, number: 6 },
        { id: 7, x: 250, y: 100, number: 7 },
        { id: 8, x: 280, y: 140, number: 8 },
        { id: 9, x: 300, y: 200, number: 9 },
        { id: 10, x: 280, y: 260, number: 10 },
        { id: 11, x: 200, y: 280, number: 11 },
        { id: 12, x: 120, y: 260, number: 12 },
        { id: 13, x: 100, y: 200, number: 13 },
        { id: 14, x: 120, y: 140, number: 14 },
        { id: 15, x: 150, y: 100, number: 15 },
        { id: 16, x: 170, y: 120, number: 16 },
        { id: 17, x: 230, y: 120, number: 17 },
      ],
    },
    {
      name: "Rocket Ship",
      emoji: "🚀",
      viewBox: "0 0 400 500",
      dots: [
        { id: 1, x: 200, y: 50, number: 1 },
        { id: 2, x: 220, y: 80, number: 2 },
        { id: 3, x: 240, y: 120, number: 3 },
        { id: 4, x: 250, y: 180, number: 4 },
        { id: 5, x: 250, y: 250, number: 5 },
        { id: 6, x: 240, y: 320, number: 6 },
        { id: 7, x: 220, y: 360, number: 7 },
        { id: 8, x: 280, y: 380, number: 8 },
        { id: 9, x: 300, y: 420, number: 9 },
        { id: 10, x: 280, y: 450, number: 10 },
        { id: 11, x: 220, y: 430, number: 11 },
        { id: 12, x: 180, y: 430, number: 12 },
        { id: 13, x: 120, y: 450, number: 13 },
        { id: 14, x: 100, y: 420, number: 14 },
        { id: 15, x: 120, y: 380, number: 15 },
        { id: 16, x: 180, y: 360, number: 16 },
        { id: 17, x: 160, y: 320, number: 17 },
        { id: 18, x: 150, y: 250, number: 18 },
        { id: 19, x: 150, y: 180, number: 19 },
        { id: 20, x: 160, y: 120, number: 20 },
        { id: 21, x: 180, y: 80, number: 21 },
        { id: 22, x: 200, y: 50, number: 22 },
      ],
    },
    {
      name: "Happy Butterfly",
      emoji: "🦋",
      viewBox: "0 0 500 400",
      dots: [
        { id: 1, x: 250, y: 100, number: 1 },
        { id: 2, x: 230, y: 120, number: 2 },
        { id: 3, x: 180, y: 100, number: 3 },
        { id: 4, x: 120, y: 120, number: 4 },
        { id: 5, x: 80, y: 160, number: 5 },
        { id: 6, x: 100, y: 200, number: 6 },
        { id: 7, x: 150, y: 220, number: 7 },
        { id: 8, x: 200, y: 200, number: 8 },
        { id: 9, x: 220, y: 240, number: 9 },
        { id: 10, x: 240, y: 280, number: 10 },
        { id: 11, x: 250, y: 320, number: 11 },
        { id: 12, x: 260, y: 280, number: 12 },
        { id: 13, x: 280, y: 240, number: 13 },
        { id: 14, x: 300, y: 200, number: 14 },
        { id: 15, x: 350, y: 220, number: 15 },
        { id: 16, x: 400, y: 200, number: 16 },
        { id: 17, x: 420, y: 160, number: 17 },
        { id: 18, x: 380, y: 120, number: 18 },
        { id: 19, x: 320, y: 100, number: 19 },
        { id: 20, x: 270, y: 120, number: 20 },
        { id: 21, x: 250, y: 100, number: 21 },
        // Overlapping dots to test visibility
        { id: 22, x: 250, y: 160, number: 22 },
        { id: 23, x: 250, y: 160, number: 23 },
      ],
    },
    {
      name: "Sweet Heart",
      emoji: "💖",
      viewBox: "0 0 400 350",
      dots: [
        { id: 1, x: 200, y: 100, number: 1 },
        { id: 2, x: 170, y: 80, number: 2 },
        { id: 3, x: 140, y: 90, number: 3 },
        { id: 4, x: 120, y: 120, number: 4 },
        { id: 5, x: 130, y: 150, number: 5 },
        { id: 6, x: 160, y: 180, number: 6 },
        { id: 7, x: 200, y: 220, number: 7 },
        { id: 8, x: 240, y: 180, number: 8 },
        { id: 9, x: 270, y: 150, number: 9 },
        { id: 10, x: 280, y: 120, number: 10 },
        { id: 11, x: 260, y: 90, number: 11 },
        { id: 12, x: 230, y: 80, number: 12 },
        { id: 13, x: 200, y: 100, number: 13 },
      ],
    },
    {
      name: "Juicy Apple",
      emoji: "🍎",
      viewBox: "0 0 350 400",
      dots: [
        { id: 1, x: 175, y: 120, number: 1 },
        { id: 2, x: 140, y: 140, number: 2 },
        { id: 3, x: 120, y: 180, number: 3 },
        { id: 4, x: 110, y: 220, number: 4 },
        { id: 5, x: 120, y: 260, number: 5 },
        { id: 6, x: 140, y: 290, number: 6 },
        { id: 7, x: 175, y: 310, number: 7 },
        { id: 8, x: 210, y: 290, number: 8 },
        { id: 9, x: 230, y: 260, number: 9 },
        { id: 10, x: 240, y: 220, number: 10 },
        { id: 11, x: 230, y: 180, number: 11 },
        { id: 12, x: 210, y: 140, number: 12 },
        { id: 13, x: 175, y: 120, number: 13 },
        { id: 14, x: 185, y: 100, number: 14 },
        { id: 15, x: 195, y: 80, number: 15 },
      ],
    },
    {
      name: "Flying Airplane",
      emoji: "✈️",
      viewBox: "0 0 500 300",
      dots: [
        { id: 1, x: 100, y: 150, number: 1 },
        { id: 2, x: 150, y: 140, number: 2 },
        { id: 3, x: 200, y: 130, number: 3 },
        { id: 4, x: 250, y: 120, number: 4 },
        { id: 5, x: 300, y: 110, number: 5 },
        { id: 6, x: 350, y: 120, number: 6 },
        { id: 7, x: 380, y: 140, number: 7 },
        { id: 8, x: 370, y: 160, number: 8 },
        { id: 9, x: 340, y: 170, number: 9 },
        { id: 10, x: 290, y: 180, number: 10 },
        { id: 11, x: 240, y: 190, number: 11 },
        { id: 12, x: 190, y: 200, number: 12 },
        { id: 13, x: 140, y: 190, number: 13 },
        { id: 14, x: 100, y: 180, number: 14 },
        { id: 15, x: 80, y: 160, number: 15 },
        { id: 16, x: 100, y: 150, number: 16 },
        { id: 17, x: 120, y: 120, number: 17 },
        { id: 18, x: 160, y: 110, number: 18 },
        { id: 19, x: 200, y: 120, number: 19 },
      ],
    },
    {
      name: "Colorful Umbrella",
      emoji: "☂️",
      viewBox: "0 0 400 350",
      dots: [
        { id: 1, x: 200, y: 80, number: 1 },
        { id: 2, x: 150, y: 100, number: 2 },
        { id: 3, x: 120, y: 130, number: 3 },
        { id: 4, x: 110, y: 160, number: 4 },
        { id: 5, x: 130, y: 180, number: 5 },
        { id: 6, x: 170, y: 190, number: 6 },
        { id: 7, x: 200, y: 195, number: 7 },
        { id: 8, x: 230, y: 190, number: 8 },
        { id: 9, x: 270, y: 180, number: 9 },
        { id: 10, x: 290, y: 160, number: 10 },
        { id: 11, x: 280, y: 130, number: 11 },
        { id: 12, x: 250, y: 100, number: 12 },
        { id: 13, x: 200, y: 80, number: 13 },
        { id: 14, x: 200, y: 195, number: 14 },
        { id: 15, x: 200, y: 280, number: 15 },
      ],
    },
    {
      name: "Royal Crown",
      emoji: "👑",
      viewBox: "0 0 400 300",
      dots: [
        { id: 1, x: 100, y: 200, number: 1 },
        { id: 2, x: 120, y: 160, number: 2 },
        { id: 3, x: 150, y: 140, number: 3 },
        { id: 4, x: 180, y: 120, number: 4 },
        { id: 5, x: 200, y: 100, number: 5 },
        { id: 6, x: 220, y: 120, number: 6 },
        { id: 7, x: 250, y: 140, number: 7 },
        { id: 8, x: 280, y: 160, number: 8 },
        { id: 9, x: 300, y: 200, number: 9 },
        { id: 10, x: 280, y: 220, number: 10 },
        { id: 11, x: 250, y: 230, number: 11 },
        { id: 12, x: 200, y: 240, number: 12 },
        { id: 13, x: 150, y: 230, number: 13 },
        { id: 14, x: 120, y: 220, number: 14 },
        { id: 15, x: 100, y: 200, number: 15 },
      ],
    },
    {
      name: "Simple Flower",
      emoji: "🌻",
      viewBox: "0 0 350 400",
      dots: [
        { id: 1, x: 175, y: 120, number: 1 },
        { id: 2, x: 200, y: 100, number: 2 },
        { id: 3, x: 220, y: 120, number: 3 },
        { id: 4, x: 200, y: 140, number: 4 },
        { id: 5, x: 220, y: 160, number: 5 },
        { id: 6, x: 200, y: 180, number: 6 },
        { id: 7, x: 175, y: 160, number: 7 },
        { id: 8, x: 150, y: 180, number: 8 },
        { id: 9, x: 130, y: 160, number: 9 },
        { id: 10, x: 150, y: 140, number: 10 },
        { id: 11, x: 130, y: 120, number: 11 },
        { id: 12, x: 150, y: 100, number: 12 },
        { id: 13, x: 175, y: 120, number: 13 },
        { id: 14, x: 175, y: 180, number: 14 },
        { id: 15, x: 175, y: 280, number: 15 },
      ],
    },
  ];

  const currentPic = pictures[currentPicture];

  // Helper function to get the maximum dot number for the current picture
  const getMaxDotNumber = (): number => {
    return Math.max(...currentPic.dots.map((dot) => dot.number));
  };

  useEffect(() => {
    setConnectedDots([]);
    setNextDotToConnect(1);
    setIsComplete(false);
  }, [currentPicture]);


  const handleDotClick = (dotNumber: number) => {
    if (dotNumber === nextDotToConnect) {
      const newConnectedDots = [...connectedDots, dotNumber];
      setConnectedDots(newConnectedDots);

      if (dotNumber === getMaxDotNumber()) {
        // Game is complete when we connect dot 1 (the last dot in reverse order)
        setIsComplete(true);
        setCompletedPictures((prev) => prev + 1);
      } else {
        setNextDotToConnect(nextDotToConnect + 1);
      }
    }
  };

  const getDotById = (number: number): Dot | undefined => {
    return currentPic.dots.find((dot) => dot.number === number);
  };

  const getPathData = (): string => {
    if (connectedDots.length < 2) return "";

    let pathData = "";
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
    setNextDotToConnect(getMaxDotNumber());
    setIsComplete(false);
  };

  const getDotClass = (dotNumber: number): string => {
    if (connectedDots.includes(dotNumber)) {
      return "dot connected";
    } else if (dotNumber === nextDotToConnect) {
      return "dot next current-target";
    } else {
      return "dot";
    }
  };

  // Helper function to sort dots so that when dots are in the same position,
  // the smaller numbered dot appears on top (rendered last)
  const getSortedDotsForRendering = (): Dot[] => {
    const sortedDots = [...currentPic.dots];

    // Sort dots so that for dots with the same position, smaller numbers come last
    // This ensures smaller numbered dots render on top when overlapping
    sortedDots.sort((a, b) => {
      return a.id - b.id;
    });

    return sortedDots;
  };

  return (
    <div className="dot-to-dot-game car-theme">
      <button className="back-button" onClick={onBack}>
        ←
      </button>

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
            {!isComplete && (
              <p className="instruction">
                Click on dot number{" "}
                <span className="next-number">{nextDotToConnect}</span>!
              </p>
            )}
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
              {getSortedDotsForRendering().map((dot) => (
                <g key={dot.id}>
                  {/* Add a glow effect for the current dot */}
                  {dot.number === nextDotToConnect && (
                    <circle
                      cx={dot.x}
                      cy={dot.y}
                      r="25"
                      className="dot-glow"
                      fill="none"
                      stroke="#ff6b6b"
                      strokeWidth="3"
                      opacity="0.6"
                    />
                  )}
                  {/* Add a pulsing ring for the current dot */}
                  {dot.number === nextDotToConnect && (
                    <circle
                      cx={dot.x}
                      cy={dot.y}
                      r="20"
                      className="dot-pulse-ring"
                      fill="none"
                      stroke="#ff8e53"
                      strokeWidth="2"
                      opacity="0.8"
                    />
                  )}
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
                    className={`dot-number ${
                      dot.number === nextDotToConnect ? "current-number" : ""
                    }`}
                    onClick={() => handleDotClick(dot.number)}
                  >
                    {dot.number}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="dot-to-dot-controls">
            <button
              className="control-button reset-button"
              onClick={resetPicture}
            >
              🔄 Start Over
            </button>
            <button
              className="control-button next-button"
              onClick={nextPicture}
            >
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
            <span className="tip-text">
              Connect the dots in reverse order - start high, go low!
            </span>
          </div>
          <div className="tip">
            <span className="tip-icon">✨</span>
            <span className="tip-text">
              Watch the picture appear as you connect!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DotToDotGame;
