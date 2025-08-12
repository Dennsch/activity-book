import React, { useState, useEffect } from 'react';
import './CodewordGame.css';

interface CodewordGameProps {
  onBack: () => void;
}

interface CodewordPuzzle {
  word: string;
  clue: string;
  emoji: string;
  difficulty: 'easy' | 'medium';
}

const CodewordGame: React.FC<CodewordGameProps> = ({ onBack }) => {
  const [currentPuzzle, setCurrentPuzzle] = useState<CodewordPuzzle | null>(null);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [puzzlesSolved, setPuzzlesSolved] = useState(0);

  const puzzles: CodewordPuzzle[] = [
    // Easy 3-letter words
    { word: 'CAT', clue: 'A furry pet that says meow', emoji: '🐱', difficulty: 'easy' },
    { word: 'DOG', clue: 'A loyal pet that barks', emoji: '🐕', difficulty: 'easy' },
    { word: 'SUN', clue: 'Bright yellow thing in the sky', emoji: '☀️', difficulty: 'easy' },
    { word: 'CAR', clue: 'Vehicle with four wheels', emoji: '🚗', difficulty: 'easy' },
    { word: 'BUS', clue: 'Big yellow vehicle for school', emoji: '🚌', difficulty: 'easy' },
    { word: 'BAT', clue: 'Flying animal that sleeps upside down', emoji: '🦇', difficulty: 'easy' },
    { word: 'BEE', clue: 'Buzzing insect that makes honey', emoji: '🐝', difficulty: 'easy' },
    { word: 'EGG', clue: 'White oval thing that chickens lay', emoji: '🥚', difficulty: 'easy' },
    
    // Medium 4-letter words
    { word: 'FISH', clue: 'Swimming animal with fins', emoji: '🐠', difficulty: 'medium' },
    { word: 'BIRD', clue: 'Flying animal with feathers', emoji: '🐦', difficulty: 'medium' },
    { word: 'TREE', clue: 'Tall plant with leaves and branches', emoji: '🌳', difficulty: 'medium' },
    { word: 'BOOK', clue: 'You read this to learn stories', emoji: '📚', difficulty: 'medium' },
    { word: 'BALL', clue: 'Round toy you can throw and catch', emoji: '⚽', difficulty: 'medium' },
    { word: 'CAKE', clue: 'Sweet treat for birthdays', emoji: '🎂', difficulty: 'medium' },
    { word: 'STAR', clue: 'Twinkly light in the night sky', emoji: '⭐', difficulty: 'medium' },
    { word: 'MOON', clue: 'Round light in the night sky', emoji: '🌙', difficulty: 'medium' }
  ];

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const generatePuzzle = (): CodewordPuzzle => {
    return puzzles[Math.floor(Math.random() * puzzles.length)];
  };

  useEffect(() => {
    const puzzle = generatePuzzle();
    setCurrentPuzzle(puzzle);
    setUserInput(new Array(puzzle.word.length).fill(''));
    setIsComplete(false);
    setShowHint(false);
  }, []);

  useEffect(() => {
    if (currentPuzzle && userInput.every(letter => letter !== '')) {
      const userWord = userInput.join('');
      if (userWord === currentPuzzle.word) {
        setIsComplete(true);
        setScore(score + (currentPuzzle.difficulty === 'easy' ? 10 : 20));
        setPuzzlesSolved(puzzlesSolved + 1);
      }
    }
  }, [userInput, currentPuzzle]);

  const handleLetterClick = (letter: string) => {
    if (isComplete) return;
    
    const emptyIndex = userInput.findIndex(input => input === '');
    if (emptyIndex !== -1) {
      const newInput = [...userInput];
      newInput[emptyIndex] = letter;
      setUserInput(newInput);
    }
  };

  const handleBoxClick = (index: number) => {
    if (isComplete) return;
    
    const newInput = [...userInput];
    newInput[index] = '';
    setUserInput(newInput);
  };

  const clearAll = () => {
    if (currentPuzzle) {
      setUserInput(new Array(currentPuzzle.word.length).fill(''));
    }
  };

  const nextPuzzle = () => {
    const puzzle = generatePuzzle();
    setCurrentPuzzle(puzzle);
    setUserInput(new Array(puzzle.word.length).fill(''));
    setIsComplete(false);
    setShowHint(false);
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  if (!currentPuzzle) return <div>Loading...</div>;

  return (
    <div className="codeword-game digger-theme">
      <button className="back-button" onClick={onBack}>←</button>
      
      <div className="game-container">
        <h1 className="game-title">🔤 Word Detective! 🔤</h1>
        
        <div className="score-board">
          <div className="score">Score: {score}</div>
          <div className="puzzles-solved">Solved: {puzzlesSolved}</div>
        </div>

        <div className="codeword-container">
          <div className="puzzle-info">
            <div className="puzzle-emoji">{currentPuzzle.emoji}</div>
            <div className="puzzle-clue">{currentPuzzle.clue}</div>
            <div className="difficulty-badge">
              {currentPuzzle.difficulty === 'easy' ? '⭐ Easy' : '⭐⭐ Medium'}
            </div>
          </div>

          <div className="word-boxes">
            {userInput.map((letter, index) => (
              <button
                key={index}
                className={`letter-box ${letter ? 'filled' : 'empty'}`}
                onClick={() => handleBoxClick(index)}
              >
                {letter}
              </button>
            ))}
          </div>

          {showHint && (
            <div className="hint-section">
              <div className="hint-title">💡 Hint:</div>
              <div className="hint-text">
                The word starts with "{currentPuzzle.word[0]}"
              </div>
            </div>
          )}

          <div className="alphabet-grid">
            {alphabet.map((letter) => (
              <button
                key={letter}
                className="alphabet-button"
                onClick={() => handleLetterClick(letter)}
                disabled={isComplete}
              >
                {letter}
              </button>
            ))}
          </div>

          <div className="codeword-controls">
            <button className="control-button hint-button" onClick={toggleHint}>
              💡 {showHint ? 'Hide' : 'Show'} Hint
            </button>
            <button className="control-button clear-button" onClick={clearAll}>
              🗑️ Clear All
            </button>
            <button className="control-button next-button" onClick={nextPuzzle}>
              ➡️ Next Word
            </button>
          </div>
        </div>

        {isComplete && (
          <div className="completion-message">
            <div className="completion-emoji">🎉</div>
            <div className="completion-text">
              Excellent detective work! You cracked the code!
            </div>
            <div className="solved-word">
              {currentPuzzle.emoji} {currentPuzzle.word} {currentPuzzle.emoji}
            </div>
          </div>
        )}

        <div className="game-instructions">
          <div className="instruction">
            <span className="instruction-icon">🔍</span>
            <span className="instruction-text">Read the clue and guess the word!</span>
          </div>
          <div className="instruction">
            <span className="instruction-icon">🔤</span>
            <span className="instruction-text">Click letters to fill in the boxes!</span>
          </div>
          <div className="instruction">
            <span className="instruction-icon">💡</span>
            <span className="instruction-text">Use hints if you need help!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodewordGame;