import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MathGame from '../games/MathGame';

describe('MathGame Component', () => {
  const mockOnBack = jest.fn();

  beforeEach(() => {
    mockOnBack.mockClear();
  });

  test('renders math game title', () => {
    render(<MathGame onBack={mockOnBack} />);
    expect(screen.getByText('🦕 Math with Dinosaurs! 🦕')).toBeInTheDocument();
  });

  test('displays score board', () => {
    render(<MathGame onBack={mockOnBack} />);
    expect(screen.getByText(/Score:/)).toBeInTheDocument();
    expect(screen.getByText(/Problems:/)).toBeInTheDocument();
  });

  test('displays math problem with numbers', () => {
    render(<MathGame onBack={mockOnBack} />);
    
    // Should display numbers and operators
    expect(screen.getByText('+')).toBeInTheDocument();
    expect(screen.getByText('=')).toBeInTheDocument();
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  test('displays answer options', () => {
    render(<MathGame onBack={mockOnBack} />);
    
    // Should have 3 answer buttons
    const answerButtons = screen.getAllByRole('button').filter(button => 
      button.textContent && /^\d+$/.test(button.textContent)
    );
    expect(answerButtons).toHaveLength(3);
  });

  test('displays encouragement text', () => {
    render(<MathGame onBack={mockOnBack} />);
    expect(screen.getByText('Count the dinosaurs to find the answer! 🦕')).toBeInTheDocument();
  });

  test('calls onBack when back button is clicked', () => {
    render(<MathGame onBack={mockOnBack} />);
    const backButton = screen.getByText('←');
    fireEvent.click(backButton);
    expect(mockOnBack).toHaveBeenCalled();
  });

  test('displays dinosaur emojis for visual counting', () => {
    render(<MathGame onBack={mockOnBack} />);
    
    // Should have dinosaur emojis for visual representation
    const dinosaurEmojis = screen.getAllByText('🦕');
    expect(dinosaurEmojis.length).toBeGreaterThan(0);
  });
});