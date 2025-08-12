import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CodewordGame from '../games/CodewordGame';

describe('CodewordGame Component', () => {
  const mockOnBack = jest.fn();

  beforeEach(() => {
    mockOnBack.mockClear();
  });

  test('renders codeword game title', () => {
    render(<CodewordGame onBack={mockOnBack} />);
    expect(screen.getByText('🔤 Word Detective! 🔤')).toBeInTheDocument();
  });

  test('displays score board', () => {
    render(<CodewordGame onBack={mockOnBack} />);
    expect(screen.getByText(/Score:/)).toBeInTheDocument();
    expect(screen.getByText(/Solved:/)).toBeInTheDocument();
  });

  test('displays puzzle clue and emoji', () => {
    render(<CodewordGame onBack={mockOnBack} />);
    
    // Should display some clue text
    const clueElements = screen.getAllByText(/A |that |with |in /);
    expect(clueElements.length).toBeGreaterThan(0);
  });

  test('displays alphabet buttons', () => {
    render(<CodewordGame onBack={mockOnBack} />);
    
    // Should have all 26 alphabet buttons
    const alphabetButtons = screen.getAllByRole('button').filter(button => 
      button.textContent && /^[A-Z]$/.test(button.textContent)
    );
    expect(alphabetButtons).toHaveLength(26);
  });

  test('displays letter boxes for word input', () => {
    render(<CodewordGame onBack={mockOnBack} />);
    
    // Should have letter boxes (empty initially)
    const letterBoxes = screen.getAllByRole('button').filter(button => 
      button.className.includes('letter-box')
    );
    expect(letterBoxes.length).toBeGreaterThan(0);
  });

  test('displays control buttons', () => {
    render(<CodewordGame onBack={mockOnBack} />);
    
    expect(screen.getByText(/Show.*Hint|Hide.*Hint/)).toBeInTheDocument();
    expect(screen.getByText('🗑️ Clear All')).toBeInTheDocument();
    expect(screen.getByText('➡️ Next Word')).toBeInTheDocument();
  });

  test('displays game instructions', () => {
    render(<CodewordGame onBack={mockOnBack} />);
    
    expect(screen.getByText('Read the clue and guess the word!')).toBeInTheDocument();
    expect(screen.getByText('Click letters to fill in the boxes!')).toBeInTheDocument();
    expect(screen.getByText('Use hints if you need help!')).toBeInTheDocument();
  });

  test('calls onBack when back button is clicked', () => {
    render(<CodewordGame onBack={mockOnBack} />);
    const backButton = screen.getByText('←');
    fireEvent.click(backButton);
    expect(mockOnBack).toHaveBeenCalled();
  });

  test('shows hint when hint button is clicked', () => {
    render(<CodewordGame onBack={mockOnBack} />);
    const hintButton = screen.getByText(/Show.*Hint/);
    fireEvent.click(hintButton);
    
    expect(screen.getByText('💡 Hint:')).toBeInTheDocument();
    expect(screen.getByText(/The word starts with/)).toBeInTheDocument();
  });
});