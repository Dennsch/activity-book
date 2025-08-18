import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ColoringGame from '../games/ColoringGame';

describe('ColoringGame', () => {
  const mockOnBack = jest.fn();

  beforeEach(() => {
    mockOnBack.mockClear();
  });

  test('renders the game title and initial state', () => {
    render(<ColoringGame onBack={mockOnBack} />);
    
    expect(screen.getByText('🎨 Color Fun! 🎨')).toBeInTheDocument();
    expect(screen.getByText('Completed: 0%')).toBeInTheDocument();
    expect(screen.getByText('Pictures: 0')).toBeInTheDocument();
  });

  test('has multiple pictures available', () => {
    render(<ColoringGame onBack={mockOnBack} />);
    
    // Initially should show "Happy Dinosaur"
    expect(screen.getByText('🦕 Happy Dinosaur')).toBeInTheDocument();
    
    // Click through all pictures to verify they exist
    const nextButton = screen.getByText('➡️ Next Picture');
    
    // Picture 2: Race Car
    fireEvent.click(nextButton);
    expect(screen.getByText('🏎️ Race Car')).toBeInTheDocument();
    
    // Picture 3: Friendly Robot
    fireEvent.click(nextButton);
    expect(screen.getByText('🤖 Friendly Robot')).toBeInTheDocument();
    
    // Picture 4: Beautiful Butterfly
    fireEvent.click(nextButton);
    expect(screen.getByText('🦋 Beautiful Butterfly')).toBeInTheDocument();
    
    // Picture 5: Pretty Flower
    fireEvent.click(nextButton);
    expect(screen.getByText('🌸 Pretty Flower')).toBeInTheDocument();
    
    // Picture 6: Sailing Boat
    fireEvent.click(nextButton);
    expect(screen.getByText('⛵ Sailing Boat')).toBeInTheDocument();
    
    // Picture 7: Happy Elephant
    fireEvent.click(nextButton);
    expect(screen.getByText('🐘 Happy Elephant')).toBeInTheDocument();
    
    // Should cycle back to first picture
    fireEvent.click(nextButton);
    expect(screen.getByText('🦕 Happy Dinosaur')).toBeInTheDocument();
  });

  test('calls onBack when back button is clicked', () => {
    render(<ColoringGame onBack={mockOnBack} />);
    
    const backButton = screen.getByText('←');
    fireEvent.click(backButton);
    
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  test('displays color palette', () => {
    render(<ColoringGame onBack={mockOnBack} />);
    
    expect(screen.getByText('Choose a Color:')).toBeInTheDocument();
    
    // Check that color buttons are present
    const colorButtons = document.querySelectorAll('.color-button');
    expect(colorButtons.length).toBe(10); // Should have 10 colors
  });

  test('displays control buttons', () => {
    render(<ColoringGame onBack={mockOnBack} />);
    
    expect(screen.getByText('🗑️ Clear All')).toBeInTheDocument();
    expect(screen.getByText('➡️ Next Picture')).toBeInTheDocument();
  });

  test('displays coloring tips', () => {
    render(<ColoringGame onBack={mockOnBack} />);
    
    expect(screen.getByText('Click on gray areas to color them!')).toBeInTheDocument();
    expect(screen.getByText('Try different colors to make it beautiful!')).toBeInTheDocument();
  });

  test('clears colors when clear button is clicked', () => {
    render(<ColoringGame onBack={mockOnBack} />);
    
    const clearButton = screen.getByText('🗑️ Clear All');
    fireEvent.click(clearButton);
    
    // Should reset to 0% completion
    expect(screen.getByText('Completed: 0%')).toBeInTheDocument();
  });

  test('advances to next picture when next button is clicked', () => {
    render(<ColoringGame onBack={mockOnBack} />);
    
    // Initially should show "Happy Dinosaur"
    expect(screen.getByText('🦕 Happy Dinosaur')).toBeInTheDocument();
    
    // Click next picture button
    const nextButton = screen.getByText('➡️ Next Picture');
    fireEvent.click(nextButton);
    
    // Should now show "Race Car"
    expect(screen.getByText('🏎️ Race Car')).toBeInTheDocument();
  });

  test('renders SVG coloring areas', () => {
    render(<ColoringGame onBack={mockOnBack} />);
    
    // Check that SVG is present
    const svg = document.querySelector('.coloring-svg');
    expect(svg).toBeInTheDocument();
    
    // Check that coloring paths are present
    const coloringPaths = document.querySelectorAll('.coloring-path');
    expect(coloringPaths.length).toBeGreaterThan(0);
  });

  test('has colorable and fixed areas', () => {
    render(<ColoringGame onBack={mockOnBack} />);
    
    // Check that both colorable and fixed areas exist
    const colorableAreas = document.querySelectorAll('.colorable');
    const fixedAreas = document.querySelectorAll('.fixed');
    
    expect(colorableAreas.length).toBeGreaterThan(0);
    expect(fixedAreas.length).toBeGreaterThan(0);
  });
});