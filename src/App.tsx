import React, { useState } from 'react';
import './App.css';
import MainMenu from './components/MainMenu';
import MathGame from './components/games/MathGame';
import LetterGame from './components/games/LetterGame';
import MazeGame from './components/games/MazeGame';
import ColoringGame from './components/games/ColoringGame';
import DotToDotGame from './components/games/DotToDotGame';
import CodewordGame from './components/games/CodewordGame';
import SpotDifferenceGame from './components/games/SpotDifferenceGame';

export type GameType = 'menu' | 'math' | 'letters' | 'maze' | 'coloring' | 'dot-to-dot' | 'codeword' | 'spot-difference';

function App() {
  const [currentGame, setCurrentGame] = useState<GameType>('menu');

  const renderGame = () => {
    switch (currentGame) {
      case 'math':
        return <MathGame onBack={() => setCurrentGame('menu')} />;
      case 'letters':
        return <LetterGame onBack={() => setCurrentGame('menu')} />;
      case 'maze':
        return <MazeGame onBack={() => setCurrentGame('menu')} />;
      case 'coloring':
        return <ColoringGame onBack={() => setCurrentGame('menu')} />;
      case 'dot-to-dot':
        return <DotToDotGame onBack={() => setCurrentGame('menu')} />;
      case 'codeword':
        return <CodewordGame onBack={() => setCurrentGame('menu')} />;
      case 'spot-difference':
        return <SpotDifferenceGame onBack={() => setCurrentGame('menu')} />;
      default:
        return <MainMenu onGameSelect={setCurrentGame} />;
    }
  };

  return (
    <div className="App">
      {renderGame()}
    </div>
  );
}

export default App;