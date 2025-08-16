import React, { useState, useRef, useEffect } from 'react';
import './MazeGame.css';

interface MazeGameProps {
  onBack: () => void;
}

interface Point {
  x: number;
  y: number;
}

interface Maze {
  grid: number[][];
  start: Point;
  end: Point;
  cellSize: number;
}

const MazeGame: React.FC<MazeGameProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentMaze, setCurrentMaze] = useState<Maze | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [path, setPath] = useState<Point[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [collisionFeedback, setCollisionFeedback] = useState(false);

  // Expanded maze patterns for progressive difficulty
  const mazePatterns = [
    // Level 1 - Very simple
    {
      grid: [
        [0, 0, 0, 0, 0],
        [1, 1, 1, 1, 0],
        [0, 0, 0, 1, 0],
        [0, 1, 0, 1, 0],
        [0, 0, 0, 0, 0]
      ],
      start: { x: 0, y: 0 },
      end: { x: 4, y: 4 }
    },
    // Level 2 - Slightly more complex
    {
      grid: [
        [0, 1, 0, 0, 0, 0],
        [0, 1, 0, 1, 1, 0],
        [0, 0, 0, 1, 0, 0],
        [1, 1, 0, 1, 0, 1],
        [0, 0, 0, 0, 0, 1],
        [0, 1, 1, 1, 0, 0]
      ],
      start: { x: 0, y: 0 },
      end: { x: 5, y: 5 }
    },
    // Level 3 - A bit more challenging
    {
      grid: [
        [0, 0, 1, 0, 0, 0, 0],
        [1, 0, 1, 0, 1, 1, 0],
        [0, 0, 0, 0, 1, 0, 0],
        [0, 1, 1, 0, 1, 0, 1],
        [0, 0, 1, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
      ],
      start: { x: 0, y: 0 },
      end: { x: 6, y: 6 }
    },
    // Level 4 - Spiral pattern
    {
      grid: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 0, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 0, 0, 1, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0]
      ],
      start: { x: 0, y: 0 },
      end: { x: 3, y: 3 }
    },
    // Level 5 - Multiple paths
    {
      grid: [
        [0, 1, 0, 1, 0, 1, 0, 0],
        [0, 1, 0, 1, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 1, 0],
        [1, 1, 1, 0, 1, 0, 1, 0],
        [0, 0, 0, 0, 1, 0, 0, 0],
        [0, 1, 1, 0, 1, 1, 1, 1],
        [0, 0, 1, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 1, 1, 1, 0]
      ],
      start: { x: 0, y: 0 },
      end: { x: 7, y: 7 }
    },
    // Level 6 - Zigzag challenge
    {
      grid: [
        [0, 0, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
      ],
      start: { x: 0, y: 0 },
      end: { x: 7, y: 7 }
    },
    // Level 7 - Cross pattern
    {
      grid: [
        [0, 0, 0, 1, 0, 0, 0],
        [1, 1, 0, 1, 0, 1, 1],
        [0, 0, 0, 1, 0, 0, 0],
        [1, 1, 1, 0, 1, 1, 1],
        [0, 0, 0, 1, 0, 0, 0],
        [1, 1, 0, 1, 0, 1, 1],
        [0, 0, 0, 1, 0, 0, 0]
      ],
      start: { x: 0, y: 0 },
      end: { x: 6, y: 6 }
    },
    // Level 8 - Complex branching
    {
      grid: [
        [0, 1, 0, 0, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 1, 0, 0, 0, 0, 0],
        [1, 1, 0, 1, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
      ],
      start: { x: 0, y: 0 },
      end: { x: 8, y: 8 }
    },
    // Level 9 - Maze with dead ends
    {
      grid: [
        [0, 0, 1, 0, 0, 0, 1, 0, 0],
        [1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 1, 1, 0, 1, 1, 1, 0, 1],
        [0, 0, 0, 0, 0, 0, 1, 0, 1],
        [0, 1, 1, 1, 1, 0, 1, 0, 0],
        [0, 0, 0, 0, 1, 0, 1, 1, 0],
        [1, 1, 1, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 0]
      ],
      start: { x: 0, y: 0 },
      end: { x: 8, y: 8 }
    },
    // Level 10 - Ultimate challenge
    {
      grid: [
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
        [0, 1, 0, 1, 0, 1, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [1, 1, 1, 0, 1, 1, 1, 0, 1, 0],
        [0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 1, 0, 1, 1, 1, 1],
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 0, 0]
      ],
      start: { x: 0, y: 0 },
      end: { x: 9, y: 9 }
    }
  ];

  const generateMaze = (): Maze => {
    const pattern = mazePatterns[Math.min(level - 1, mazePatterns.length - 1)];
    
    // Calculate cell size based on screen size and maze dimensions
    const maxCanvasSize = Math.min(
      window.innerWidth * 0.9, // 90% of screen width
      window.innerHeight * 0.5, // 50% of screen height
      500 // Maximum size for desktop
    );
    
    const cellSize = Math.max(
      25, // Minimum cell size for touch interaction
      Math.floor(maxCanvasSize / Math.max(pattern.grid.length, pattern.grid[0].length))
    );
    
    return {
      ...pattern,
      cellSize
    };
  };

  useEffect(() => {
    setCurrentMaze(generateMaze());
    setPath([]);
    setIsComplete(false);
  }, [level]);

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      if (currentMaze) {
        setCurrentMaze(generateMaze());
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [level]);

  useEffect(() => {
    if (currentMaze) {
      drawMaze();
    }
  }, [currentMaze, path]);

  const drawMaze = () => {
    const canvas = canvasRef.current;
    if (!canvas || !currentMaze) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { grid, start, end, cellSize } = currentMaze;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw maze grid
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const x = col * cellSize;
        const y = row * cellSize;
        
        if (grid[row][col] === 1) {
          // Wall
          ctx.fillStyle = '#8B4513';
          ctx.fillRect(x, y, cellSize, cellSize);
          
          // Add texture to walls
          ctx.fillStyle = '#A0522D';
          ctx.fillRect(x + 2, y + 2, cellSize - 4, cellSize - 4);
        } else {
          // Path
          ctx.fillStyle = '#F5DEB3';
          ctx.fillRect(x, y, cellSize, cellSize);
          
          // Grid lines
          ctx.strokeStyle = '#DDD';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, cellSize, cellSize);
        }
      }
    }
    
    // Draw start position (digger)
    const startX = start.x * cellSize + cellSize / 2;
    const startY = start.y * cellSize + cellSize / 2;
    ctx.font = `${cellSize * 0.8}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🚜', startX, startY);
    
    // Draw end position (treasure)
    const endX = end.x * cellSize + cellSize / 2;
    const endY = end.y * cellSize + cellSize / 2;
    ctx.fillText('💎', endX, endY);
    
    // Draw path
    if (path.length > 1) {
      ctx.strokeStyle = '#FF6B6B';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.stroke();
    }
  };

  const getCanvasPosition = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    
    // Handle touch events
    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    }
    
    // Handle mouse events
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const isValidPosition = (x: number, y: number): boolean => {
    if (!currentMaze) return false;
    
    const { grid, cellSize } = currentMaze;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    
    return (
      row >= 0 && row < grid.length &&
      col >= 0 && col < grid[0].length &&
      grid[row][col] === 0
    );
  };

  // Enhanced collision detection - checks if a line segment intersects with any walls
  const checkLineCollision = (x1: number, y1: number, x2: number, y2: number): boolean => {
    if (!currentMaze) return false;
    
    const { grid, cellSize } = currentMaze;
    
    // Sample points along the line to check for wall collisions
    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const steps = Math.ceil(distance / (cellSize / 4)); // Check every quarter cell
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = x1 + t * (x2 - x1);
      const y = y1 + t * (y2 - y1);
      
      const col = Math.floor(x / cellSize);
      const row = Math.floor(y / cellSize);
      
      // Check if point is outside bounds or hits a wall
      if (
        row < 0 || row >= grid.length ||
        col < 0 || col >= grid[0].length ||
        grid[row][col] === 1
      ) {
        return true; // Collision detected
      }
    }
    
    return false; // No collision
  };

  // Check if path from start to current position is valid
  const isValidPath = (newPoint: Point): boolean => {
    if (path.length === 0) return isValidPosition(newPoint.x, newPoint.y);
    
    const lastPoint = path[path.length - 1];
    return !checkLineCollision(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
  };

  const checkWin = (x: number, y: number): boolean => {
    if (!currentMaze) return false;
    
    const { end, cellSize } = currentMaze;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    
    return col === end.x && row === end.y;
  };

  const handleStart = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent scrolling on touch devices
    const pos = getCanvasPosition(e);
    if (isValidPosition(pos.x, pos.y)) {
      setIsDrawing(true);
      setPath([pos]);
    }
  };

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault(); // Prevent scrolling on touch devices
    
    const pos = getCanvasPosition(e);
    
    // Use enhanced collision detection
    if (isValidPath(pos)) {
      setPath(prev => [...prev, pos]);
      
      if (checkWin(pos.x, pos.y)) {
        setIsComplete(true);
        setIsDrawing(false);
        setScore(score + 10);
        
        setTimeout(() => {
          if (level < mazePatterns.length) {
            setLevel(level + 1);
          } else {
            // Completed all levels - show completion message and restart
            alert('🎉 Congratulations! You completed all levels! Starting over with bonus points!');
            setLevel(1);
            setScore(score + 50); // Bonus for completing all levels
          }
        }, 2000);
      }
    } else {
      // Collision detected - stop drawing and provide feedback
      setIsDrawing(false);
      setCollisionFeedback(true);
      
      // Clear feedback after a short time
      setTimeout(() => {
        setCollisionFeedback(false);
      }, 300);
    }
  };

  const handleEnd = () => {
    setIsDrawing(false);
  };

  // Legacy mouse event handlers for backward compatibility
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => handleStart(e);
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => handleMove(e);
  const handleMouseUp = () => handleEnd();

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => handleStart(e);
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => handleMove(e);
  const handleTouchEnd = () => handleEnd();

  const resetMaze = () => {
    setPath([]);
    setIsComplete(false);
    setIsDrawing(false);
    setCollisionFeedback(false);
  };

  if (!currentMaze) return <div>Loading...</div>;

  return (
    <div className="maze-game digger-theme">
      <button className="back-button" onClick={onBack}>←</button>
      
      <div className="game-container">
        <h1 className="game-title">🚜 Digger Maze Adventure! 🚜</h1>
        
        <div className="score-board">
          <div className="score">Score: {score}</div>
          <div className="level">Level: {level}</div>
        </div>

        <div className="maze-container">
          <div className="maze-instructions">
            <p>🚜 Help the digger find the treasure! 💎</p>
            <p>Draw a path from the digger to the treasure!</p>
          </div>
          
          <canvas
            ref={canvasRef}
            width={currentMaze.grid[0].length * currentMaze.cellSize}
            height={currentMaze.grid.length * currentMaze.cellSize}
            className={`maze-canvas ${collisionFeedback ? 'collision-feedback' : ''}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            style={{ touchAction: 'none' }} // Prevent default touch behaviors
          />
          
          <div className="maze-controls">
            <button className="control-button" onClick={resetMaze}>
              🔄 Try Again
            </button>
          </div>
        </div>

        {isComplete && (
          <div className="completion-message">
            <div className="completion-emoji">🎉</div>
            <div className="completion-text">
              Great job! The digger found the treasure!
            </div>
            <div className="celebration">🚜💎✨</div>
          </div>
        )}

        <div className="game-tips">
          <div className="tip">
            <span className="tip-icon">💡</span>
            <span className="tip-text">Stay on the light brown paths!</span>
          </div>
          <div className="tip">
            <span className="tip-icon">🚫</span>
            <span className="tip-text">Avoid the dark brown walls!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MazeGame;