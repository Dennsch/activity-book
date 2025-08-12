import React, { useState, useEffect } from 'react';
import './LetterGame.css';

interface LetterGameProps {
  onBack: () => void;
}

interface LetterChallenge {
  targetLetter: string;
  options: string[];
  word: string;
  emoji: string;
}

const LetterGame: React.FC<LetterGameProps> = ({ onBack }) => {
  const [currentChallenge, setCurrentChallenge] = useState<LetterChallenge | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState<'correct' | 'incorrect' | null>(null);
  const [challengesCompleted, setChallengesCompleted] = useState(0);

  const letterWords = [
    { letter: 'A', word: 'Apple', emoji: '🍎' },
    { letter: 'B', word: 'Ball', emoji: '⚽' },
    { letter: 'C', word: 'Car', emoji: '🏎️' },
    { letter: 'D', word: 'Dog', emoji: '🐕' },
    { letter: 'E', word: 'Elephant', emoji: '🐘' },
    { letter: 'F', word: 'Fish', emoji: '🐠' },
    { letter: 'G', word: 'Giraffe', emoji: '🦒' },
    { letter: 'H', word: 'House', emoji: '🏠' },
    { letter: 'I', word: 'Ice cream', emoji: '🍦' },
    { letter: 'J', word: 'Juice', emoji: '🧃' },
    { letter: 'K', word: 'Kite', emoji: '🪁' },
    { letter: 'L', word: 'Lion', emoji: '🦁' },
    { letter: 'M', word: 'Mouse', emoji: '🐭' },
    { letter: 'N', word: 'Nest', emoji: '🪺' },
    { letter: 'O', word: 'Orange', emoji: '🍊' },
    { letter: 'P', word: 'Pizza', emoji: '🍕' },
    { letter: 'Q', word: 'Queen', emoji: '👸' },
    { letter: 'R', word: 'Robot', emoji: '🤖' },
    { letter: 'S', word: 'Sun', emoji: '☀️' },
    { letter: 'T', word: 'Tree', emoji: '🌳' },
    { letter: 'U', word: 'Umbrella', emoji: '☂️' },
    { letter: 'V', word: 'Van', emoji: '🚐' },
    { letter: 'W', word: 'Whale', emoji: '🐋' },
    { letter: 'X', word: 'X-ray', emoji: '🩻' },
    { letter: 'Y', word: 'Yo-yo', emoji: '🪀' },
    { letter: 'Z', word: 'Zebra', emoji: '🦓' }
  ];

  const generateChallenge = (): LetterChallenge => {
    const randomWord = letterWords[Math.floor(Math.random() * letterWords.length)];
    const targetLetter = randomWord.letter;
    
    // Generate wrong options
    const wrongOptions: string[] = [];
    while (wrongOptions.length < 3) {
      const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      if (randomLetter !== targetLetter && !wrongOptions.includes(randomLetter)) {
        wrongOptions.push(randomLetter);
      }
    }
    
    // Shuffle options
    const options = [targetLetter, ...wrongOptions].sort(() => Math.random() - 0.5);
    
    return {
      targetLetter,
      options,
      word: randomWord.word,
      emoji: randomWord.emoji
    };
  };

  useEffect(() => {
    setCurrentChallenge(generateChallenge());
  }, []);

  const handleAnswer = (selectedLetter: string) => {
    if (!currentChallenge) return;
    
    if (selectedLetter === currentChallenge.targetLetter) {
      setShowResult('correct');
      setScore(score + 1);
    } else {
      setShowResult('incorrect');
    }
    
    setTimeout(() => {
      setShowResult(null);
      setChallengesCompleted(challengesCompleted + 1);
      setCurrentChallenge(generateChallenge());
    }, 2500);
  };

  if (!currentChallenge) return <div>Loading...</div>;

  return (
    <div className="letter-game car-theme">
      <button className="back-button" onClick={onBack}>←</button>
      
      <div className="game-container">
        <h1 className="game-title">🏎️ Letter Racing! 🏎️</h1>
        
        <div className="score-board">
          <div className="score">Score: {score}</div>
          <div className="challenges-count">Letters: {challengesCompleted}</div>
        </div>

        <div className="challenge-container">
          <div className="word-display">
            <div className="emoji-display">{currentChallenge.emoji}</div>
            <div className="word-text">{currentChallenge.word}</div>
            <div className="instruction">What letter does this word start with?</div>
          </div>
          
          <div className="racing-track">
            <div className="race-cars">
              {currentChallenge.options.map((letter, index) => (
                <div key={index} className="race-lane">
                  <button
                    className="race-car-button"
                    onClick={() => handleAnswer(letter)}
                    disabled={showResult !== null}
                  >
                    <div className="car-emoji">🏎️</div>
                    <div className="car-letter">{letter}</div>
                  </button>
                  <div className="race-line"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showResult && (
          <div className={`result-message ${showResult}`}>
            {showResult === 'correct' ? (
              <div>
                <div className="result-emoji">🏆</div>
                <div className="result-text">Fantastic! {currentChallenge.targetLetter} is correct!</div>
                <div className="winner-car">🏎️💨</div>
              </div>
            ) : (
              <div>
                <div className="result-emoji">🤔</div>
                <div className="result-text">
                  Good try! {currentChallenge.word} starts with {currentChallenge.targetLetter}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="encouragement">
          <p>🏁 Race to find the right letter! 🏁</p>
        </div>
      </div>
    </div>
  );
};

export default LetterGame;