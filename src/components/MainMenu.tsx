import React from 'react';
import { GameType } from '../App';
import './MainMenu.css';

interface MainMenuProps {
  onGameSelect: (game: GameType) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onGameSelect }) => {
  const games = [
    {
      id: 'math' as GameType,
      title: '🦕 Math with Dinos',
      description: 'Count and add with friendly dinosaurs!',
      theme: 'dinosaur-theme',
      emoji: '🦕'
    },
    {
      id: 'letters' as GameType,
      title: '🏎️ Letter Racing',
      description: 'Learn letters with speedy race cars!',
      theme: 'car-theme',
      emoji: '🏎️'
    },
    {
      id: 'maze' as GameType,
      title: '🚜 Digger Maze',
      description: 'Help the digger find its way!',
      theme: 'digger-theme',
      emoji: '🚜'
    },
    {
      id: 'coloring' as GameType,
      title: '🎨 Color Fun',
      description: 'Color beautiful pictures!',
      theme: 'dinosaur-theme',
      emoji: '🎨'
    },
    {
      id: 'dot-to-dot' as GameType,
      title: '🔗 Connect the Dots',
      description: 'Draw lines to make pictures!',
      theme: 'car-theme',
      emoji: '🔗'
    },
    {
      id: 'codeword' as GameType,
      title: '🔤 Word Detective',
      description: 'Crack the secret code words!',
      theme: 'digger-theme',
      emoji: '🔤'
    },
    {
      id: 'spot-difference' as GameType,
      title: '🔍 Spot the Difference',
      description: 'Find 5 differences between pictures!',
      theme: 'detective-theme',
      emoji: '🔍'
    }
  ];

  return (
    <div className="main-menu">
      <div className="menu-header">
        <h1 className="app-title">🌟 Activity Book 🌟</h1>
        <p className="app-subtitle">Choose a fun game to play!</p>
      </div>
      
      <div className="games-grid">
        {games.map((game) => (
          <button
            key={game.id}
            className={`game-card ${game.theme}`}
            onClick={() => onGameSelect(game.id)}
          >
            <div className="game-emoji">{game.emoji}</div>
            <h3 className="game-card-title">{game.title}</h3>
            <p className="game-card-description">{game.description}</p>
          </button>
        ))}
      </div>
      
      <div className="menu-footer">
        <p className="encouragement">🎉 Have fun learning and playing! 🎉</p>
      </div>
    </div>
  );
};

export default MainMenu;