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

  // Simple maze patterns for 5-year-olds
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
    }
  ];

  const generateMaze = (): Maze => {
    const pattern = mazePatterns[Math.min(level - 1, mazePatterns.length - 1)];
    const cellSize = Math.min(60, Math.floor(400 / pattern.grid.length));
    
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

  const getCanvasPosition = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
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

  const checkWin = (x: number, y: number): boolean => {
    if (!currentMaze) return false;
    
    const { end, cellSize } = currentMaze;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    
    return col === end.x && row === end.y;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasPosition(e);
    if (isValidPosition(pos.x, pos.y)) {
      setIsDrawing(true);
      setPath([pos]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const pos = getCanvasPosition(e);
    if (isValidPosition(pos.x, pos.y)) {
      setPath(prev => [...prev, pos]);
      
      if (checkWin(pos.x, pos.y)) {
        setIsComplete(true);
        setIsDrawing(false);
        setScore(score + 10);
        
        setTimeout(() => {
          if (level < 3) {
            setLevel(level + 1);
          } else {
            setLevel(1);
          }
        }, 2000);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const resetMaze = () => {
    setPath([]);
    setIsComplete(false);
    setIsDrawing(false);
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
            className="maze-canvas"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
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