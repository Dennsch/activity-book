import React, { useState, useEffect } from 'react';
import './MathGame.css';

interface MathGameProps {
  onBack: () => void;
}

interface MathProblem {
  num1: number;
  num2: number;
  answer: number;
  options: number[];
}

const MathGame: React.FC<MathGameProps> = ({ onBack }) => {
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState<'correct' | 'incorrect' | null>(null);
  const [problemsCompleted, setProblemsCompleted] = useState(0);

  const generateProblem = (): MathProblem => {
    // Simple addition problems for 5-year-olds (0-10)
    const num1 = Math.floor(Math.random() * 6); // 0-5
    const num2 = Math.floor(Math.random() * 6); // 0-5
    const answer = num1 + num2;
    
    // Generate wrong options
    const wrongOptions = [];
    while (wrongOptions.length < 2) {
      const wrong = Math.floor(Math.random() * 11);
      if (wrong !== answer && !wrongOptions.includes(wrong)) {
        wrongOptions.push(wrong);
      }
    }
    
    // Shuffle options
    const options = [answer, ...wrongOptions].sort(() => Math.random() - 0.5);
    
    return { num1, num2, answer, options };
  };

  useEffect(() => {
    setCurrentProblem(generateProblem());
  }, []);

  const handleAnswer = (selectedAnswer: number) => {
    if (!currentProblem) return;
    
    if (selectedAnswer === currentProblem.answer) {
      setShowResult('correct');
      setScore(score + 1);
    } else {
      setShowResult('incorrect');
    }
    
    setTimeout(() => {
      setShowResult(null);
      setProblemsCompleted(problemsCompleted + 1);
      setCurrentProblem(generateProblem());
    }, 2000);
  };

  const renderDinosaurs = (count: number) => {
    return Array.from({ length: count }, (_, i) => (
      <span key={i} className="dinosaur-emoji">🦕</span>
    ));
  };

  if (!currentProblem) return <div>Loading...</div>;

  return (
    <div className="math-game dinosaur-theme">
      <button className="back-button" onClick={onBack}>←</button>
      
      <div className="game-container">
        <h1 className="game-title">🦕 Math with Dinosaurs! 🦕</h1>
        
        <div className="score-board">
          <div className="score">Score: {score}</div>
          <div className="problems-count">Problems: {problemsCompleted}</div>
        </div>

        <div className="problem-container">
          <div className="visual-problem">
            <div className="dinosaur-group">
              <div className="dinosaur-count">{renderDinosaurs(currentProblem.num1)}</div>
              <div className="plus-sign">+</div>
              <div className="dinosaur-count">{renderDinosaurs(currentProblem.num2)}</div>
              <div className="equals-sign">=</div>
              <div className="question-mark">?</div>
            </div>
          </div>
          
          <div className="number-problem">
            <span className="number">{currentProblem.num1}</span>
            <span className="operator">+</span>
            <span className="number">{currentProblem.num2}</span>
            <span className="equals">=</span>
            <span className="question">?</span>
          </div>
        </div>

        <div className="answer-options">
          {currentProblem.options.map((option, index) => (
            <button
              key={index}
              className="answer-button"
              onClick={() => handleAnswer(option)}
              disabled={showResult !== null}
            >
              {option}
            </button>
          ))}
        </div>

        {showResult && (
          <div className={`result-message ${showResult}`}>
            {showResult === 'correct' ? (
              <div>
                <div className="result-emoji">🎉</div>
                <div className="result-text">Great job! That's correct!</div>
              </div>
            ) : (
              <div>
                <div className="result-emoji">🤔</div>
                <div className="result-text">Try again! The answer is {currentProblem.answer}</div>
              </div>
            )}
          </div>
        )}

        <div className="encouragement">
          <p>Count the dinosaurs to find the answer! 🦕</p>
        </div>
      </div>
    </div>
  );
};

export default MathGame;