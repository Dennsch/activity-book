import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MainMenu from '../MainMenu';

describe('MainMenu Component', () => {
  const mockOnGameSelect = jest.fn();

  beforeEach(() => {
    mockOnGameSelect.mockClear();
  });

  test('renders main menu title and subtitle', () => {
    render(<MainMenu onGameSelect={mockOnGameSelect} />);
    expect(screen.getByText('🌟 Activity Book 🌟')).toBeInTheDocument();
    expect(screen.getByText('Choose a fun game to play!')).toBeInTheDocument();
  });

  test('renders all game cards', () => {
    render(<MainMenu onGameSelect={mockOnGameSelect} />);
    
    expect(screen.getByText('🦕 Math with Dinos')).toBeInTheDocument();
    expect(screen.getByText('🏎️ Letter Racing')).toBeInTheDocument();
    expect(screen.getByText('🚜 Digger Maze')).toBeInTheDocument();
    expect(screen.getByText('🎨 Color Fun')).toBeInTheDocument();
    expect(screen.getByText('🔗 Connect the Dots')).toBeInTheDocument();
    expect(screen.getByText('🔤 Word Detective')).toBeInTheDocument();
  });

  test('calls onGameSelect when math game is clicked', () => {
    render(<MainMenu onGameSelect={mockOnGameSelect} />);
    const mathCard = screen.getByText('🦕 Math with Dinos');
    fireEvent.click(mathCard);
    expect(mockOnGameSelect).toHaveBeenCalledWith('math');
  });

  test('calls onGameSelect when letter game is clicked', () => {
    render(<MainMenu onGameSelect={mockOnGameSelect} />);
    const letterCard = screen.getByText('🏎️ Letter Racing');
    fireEvent.click(letterCard);
    expect(mockOnGameSelect).toHaveBeenCalledWith('letters');
  });

  test('displays game descriptions', () => {
    render(<MainMenu onGameSelect={mockOnGameSelect} />);
    
    expect(screen.getByText('Count and add with friendly dinosaurs!')).toBeInTheDocument();
    expect(screen.getByText('Learn letters with speedy race cars!')).toBeInTheDocument();
    expect(screen.getByText('Help the digger find its way!')).toBeInTheDocument();
  });

  test('displays encouragement message', () => {
    render(<MainMenu onGameSelect={mockOnGameSelect} />);
    expect(screen.getByText('🎉 Have fun learning and playing! 🎉')).toBeInTheDocument();
  });
});