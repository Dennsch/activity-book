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
  leftImage: string;
  rightImage: string;
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
      title: "🔍 Find the Differences - Scene 1",
      leftImage: require('./pics/11thmarch2019-1.png'),
      rightImage: require('./pics/11thmarch2019-1.png'), // Using same image for now - you'll need the modified version
      differences: [
        { id: 1, x: 20, y: 30, width: 8, height: 8, description: "Difference 1" },
        { id: 2, x: 45, y: 25, width: 10, height: 10, description: "Difference 2" },
        { id: 3, x: 70, y: 40, width: 8, height: 8, description: "Difference 3" },
        { id: 4, x: 30, y: 60, width: 12, height: 8, description: "Difference 4" },
        { id: 5, x: 60, y: 70, width: 8, height: 8, description: "Difference 5" }
      ]
    },
    {
      id: 2,
      title: "🔍 Find the Differences - Scene 2",
      leftImage: require('./pics/29thmarch2019.png'),
      rightImage: require('./pics/29thmarch2019.png'), // Using same image for now - you'll need the modified version
      differences: [
        { id: 1, x: 25, y: 20, width: 10, height: 10, description: "Difference 1" },
        { id: 2, x: 50, y: 35, width: 8, height: 8, description: "Difference 2" },
        { id: 3, x: 75, y: 25, width: 8, height: 8, description: "Difference 3" },
        { id: 4, x: 35, y: 65, width: 10, height: 8, description: "Difference 4" },
        { id: 5, x: 65, y: 75, width: 8, height: 8, description: "Difference 5" }
      ]
    },
    {
      id: 3,
      title: "🔍 Find the Differences - Scene 3",
      leftImage: require('./pics/8thapril20191.png'),
      rightImage: require('./pics/8thapril20191.png'), // Using same image for now - you'll need the modified version
      differences: [
        { id: 1, x: 15, y: 25, width: 8, height: 8, description: "Difference 1" },
        { id: 2, x: 40, y: 30, width: 10, height: 10, description: "Difference 2" },
        { id: 3, x: 65, y: 20, width: 8, height: 8, description: "Difference 3" },
        { id: 4, x: 25, y: 70, width: 12, height: 8, description: "Difference 4" },
        { id: 5, x: 70, y: 65, width: 8, height: 8, description: "Difference 5" }
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
              <img 
                src={currentGameScene.leftImage} 
                alt="Original scene" 
                className="scene-image"
                draggable={false}
              />
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
              <img 
                src={currentGameScene.rightImage} 
                alt="Scene with differences" 
                className="scene-image"
                draggable={false}
              />
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