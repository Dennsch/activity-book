import React, { useState, useEffect } from 'react';
import './SpotDifferenceGame.css';

interface SpotDifferenceGameProps {
  onBack: () => void;
}

interface Difference {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  description: string;
}

interface GameScene {
  id: number;
  title: string;
  leftScene: React.ReactNode;
  rightScene: React.ReactNode;
  differences: Difference[];
}

const SpotDifferenceGame: React.FC<SpotDifferenceGameProps> = ({ onBack }) => {
  const [currentScene, setCurrentScene] = useState(0);
  const [foundDifferences, setFoundDifferences] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState<'correct' | 'incorrect' | 'complete' | null>(null);
  const [clickedWrong, setClickedWrong] = useState<{x: number, y: number} | null>(null);

  const scenes: GameScene[] = [
    {
      id: 1,
      title: "🏠 Happy House Scene",
      leftScene: (
        <div className="scene house-scene">
          <div className="sky">
            <div className="sun">☀️</div>
            <div className="cloud cloud-1">☁️</div>
            <div className="cloud cloud-2">☁️</div>
          </div>
          <div className="house">
            <div className="roof">🔺</div>
            <div className="house-body">
              <div className="door">🚪</div>
              <div className="window window-1">🪟</div>
              <div className="window window-2">🪟</div>
            </div>
          </div>
          <div className="ground">
            <div className="tree">🌳</div>
            <div className="flower flower-1">🌸</div>
            <div className="flower flower-2">🌺</div>
            <div className="cat">🐱</div>
          </div>
        </div>
      ),
      rightScene: (
        <div className="scene house-scene">
          <div className="sky">
            <div className="sun">☀️</div>
            <div className="cloud cloud-1">☁️</div>
            <div className="cloud cloud-2 missing">☁️</div>
          </div>
          <div className="house">
            <div className="roof different-roof">🔺</div>
            <div className="house-body">
              <div className="door">🚪</div>
              <div className="window window-1">🪟</div>
              <div className="window window-2">🪟</div>
            </div>
          </div>
          <div className="ground">
            <div className="tree">🌳</div>
            <div className="flower flower-1 different-flower">🌸</div>
            <div className="flower flower-2">🌺</div>
            <div className="cat different-cat">🐱</div>
          </div>
        </div>
      ),
      differences: [
        { id: 1, x: 70, y: 15, width: 15, height: 15, description: "Missing cloud" },
        { id: 2, x: 45, y: 35, width: 20, height: 15, description: "Different roof color" },
        { id: 3, x: 15, y: 75, width: 10, height: 10, description: "Different flower" },
        { id: 4, x: 75, y: 80, width: 10, height: 10, description: "Cat color changed" },
        { id: 5, x: 25, y: 65, width: 8, height: 8, description: "Extra leaf on tree" }
      ]
    },
    {
      id: 2,
      title: "🌊 Beach Fun Scene",
      leftScene: (
        <div className="scene beach-scene">
          <div className="sky-beach">
            <div className="sun-beach">☀️</div>
            <div className="bird bird-1">🐦</div>
            <div className="bird bird-2">🐦</div>
          </div>
          <div className="ocean">
            <div className="wave">🌊</div>
            <div className="boat">⛵</div>
          </div>
          <div className="beach">
            <div className="palm-tree">🌴</div>
            <div className="crab">🦀</div>
            <div className="shell shell-1">🐚</div>
            <div className="shell shell-2">🐚</div>
            <div className="beach-ball">🏐</div>
          </div>
        </div>
      ),
      rightScene: (
        <div className="scene beach-scene">
          <div className="sky-beach">
            <div className="sun-beach different-sun">☀️</div>
            <div className="bird bird-1">🐦</div>
            <div className="bird bird-2 missing">🐦</div>
          </div>
          <div className="ocean">
            <div className="wave">🌊</div>
            <div className="boat different-boat">⛵</div>
          </div>
          <div className="beach">
            <div className="palm-tree">🌴</div>
            <div className="crab different-crab">🦀</div>
            <div className="shell shell-1">🐚</div>
            <div className="shell shell-2 missing">🐚</div>
            <div className="beach-ball">🏐</div>
          </div>
        </div>
      ),
      differences: [
        { id: 1, x: 20, y: 20, width: 12, height: 12, description: "Sun size changed" },
        { id: 2, x: 75, y: 25, width: 8, height: 8, description: "Missing bird" },
        { id: 3, x: 60, y: 45, width: 15, height: 10, description: "Boat color changed" },
        { id: 4, x: 25, y: 75, width: 10, height: 8, description: "Crab color changed" },
        { id: 5, x: 70, y: 80, width: 8, height: 8, description: "Missing shell" }
      ]
    }
  ];

  const currentGameScene = scenes[currentScene];

  useEffect(() => {
    if (foundDifferences.length === 5) {
      setShowResult('complete');
      setScore(score + 10);
      setTimeout(() => {
        if (currentScene < scenes.length - 1) {
          setCurrentScene(currentScene + 1);
          setFoundDifferences([]);
          setShowResult(null);
        } else {
          // Game completed, could reset or show final score
          setCurrentScene(0);
          setFoundDifferences([]);
          setShowResult(null);
        }
      }, 3000);
    }
  }, [foundDifferences, currentScene, scenes.length, score]);

  const handleSceneClick = (event: React.MouseEvent<HTMLDivElement>, isRightScene: boolean) => {
    if (showResult === 'complete') return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    // Only check differences on the right scene (where differences are visible)
    if (!isRightScene) return;

    const clickedDifference = currentGameScene.differences.find(diff => 
      x >= diff.x && x <= diff.x + diff.width &&
      y >= diff.y && y <= diff.y + diff.height &&
      !foundDifferences.includes(diff.id)
    );

    if (clickedDifference) {
      setFoundDifferences([...foundDifferences, clickedDifference.id]);
      setShowResult('correct');
      setScore(score + 2);
      setTimeout(() => setShowResult(null), 1500);
    } else {
      setShowResult('incorrect');
      setClickedWrong({ x, y });
      setTimeout(() => {
        setShowResult(null);
        setClickedWrong(null);
      }, 1000);
    }
  };

  const renderDifferenceMarkers = (isRightScene: boolean) => {
    if (!isRightScene) return null;
    
    return foundDifferences.map(diffId => {
      const diff = currentGameScene.differences.find(d => d.id === diffId);
      if (!diff) return null;
      
      return (
        <div
          key={diffId}
          className="difference-marker found"
          style={{
            left: `${diff.x}%`,
            top: `${diff.y}%`,
            width: `${diff.width}%`,
            height: `${diff.height}%`
          }}
        >
          ✓
        </div>
      );
    });
  };

  const renderWrongClickMarker = () => {
    if (!clickedWrong) return null;
    
    return (
      <div
        className="difference-marker wrong"
        style={{
          left: `${clickedWrong.x}%`,
          top: `${clickedWrong.y}%`
        }}
      >
        ✗
      </div>
    );
  };

  return (
    <div className="spot-difference-game detective-theme">
      <button className="back-button" onClick={onBack}>←</button>
      
      <div className="game-container">
        <h1 className="game-title">🔍 Spot the Difference! 🔍</h1>
        
        <div className="score-board">
          <div className="score">Score: {score}</div>
          <div className="progress">Found: {foundDifferences.length}/5</div>
          <div className="scene-info">Scene: {currentScene + 1}/{scenes.length}</div>
        </div>

        <div className="scene-title">
          <h2>{currentGameScene.title}</h2>
        </div>

        <div className="scenes-container">
          <div className="scene-wrapper">
            <h3>Original Picture</h3>
            <div 
              className="scene-container left-scene"
              onClick={(e) => handleSceneClick(e, false)}
            >
              {currentGameScene.leftScene}
            </div>
          </div>
          
          <div className="vs-divider">
            <div className="vs-text">VS</div>
            <div className="magnifying-glass">🔍</div>
          </div>
          
          <div className="scene-wrapper">
            <h3>Find the Differences!</h3>
            <div 
              className="scene-container right-scene"
              onClick={(e) => handleSceneClick(e, true)}
            >
              {currentGameScene.rightScene}
              {renderDifferenceMarkers(true)}
              {renderWrongClickMarker()}
            </div>
          </div>
        </div>

        {showResult && (
          <div className={`result-message ${showResult}`}>
            {showResult === 'correct' && (
              <div>
                <div className="result-emoji">🎉</div>
                <div className="result-text">Great job! You found a difference!</div>
              </div>
            )}
            {showResult === 'incorrect' && (
              <div>
                <div className="result-emoji">🤔</div>
                <div className="result-text">Keep looking! Try clicking on something different.</div>
              </div>
            )}
            {showResult === 'complete' && (
              <div>
                <div className="result-emoji">🏆</div>
                <div className="result-text">Amazing! You found all 5 differences!</div>
                <div className="next-level">Moving to next scene...</div>
              </div>
            )}
          </div>
        )}

        <div className="encouragement">
          <p>Look carefully at both pictures and click on the differences! 🔍</p>
        </div>
      </div>
    </div>
  );
};

export default SpotDifferenceGame;