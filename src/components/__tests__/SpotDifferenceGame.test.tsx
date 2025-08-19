import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SpotDifferenceGame from '../games/SpotDifferenceGame';

describe('SpotDifferenceGame Component', () => {
  const mockOnBack = jest.fn();

  beforeEach(() => {
    mockOnBack.mockClear();
  });

  test('renders spot difference game title', () => {
    render(<SpotDifferenceGame onBack={mockOnBack} />);
    expect(screen.getByText('🔍 Spot the Difference! 🔍')).toBeInTheDocument();
  });

  test('displays score board with initial values', () => {
    render(<SpotDifferenceGame onBack={mockOnBack} />);
    expect(screen.getByText(/Score:/)).toBeInTheDocument();
    expect(screen.getByText(/Found: 0\/5/)).toBeInTheDocument();
    expect(screen.getByText(/Scene: 1\/2/)).toBeInTheDocument();
  });

  test('displays scene title', () => {
    render(<SpotDifferenceGame onBack={mockOnBack} />);
    expect(screen.getByText('🏠 Happy House Scene')).toBeInTheDocument();
  });

  test('displays both scene containers', () => {
    render(<SpotDifferenceGame onBack={mockOnBack} />);
    expect(screen.getByText('Original Picture')).toBeInTheDocument();
    expect(screen.getByText('Find the Differences!')).toBeInTheDocument();
  });

  test('displays VS divider with magnifying glass', () => {
    render(<SpotDifferenceGame onBack={mockOnBack} />);
    expect(screen.getByText('VS')).toBeInTheDocument();
    expect(screen.getByText('🔍')).toBeInTheDocument();
  });

  test('displays encouragement text', () => {
    render(<SpotDifferenceGame onBack={mockOnBack} />);
    expect(screen.getByText('Look carefully at both pictures and click on the differences! 🔍')).toBeInTheDocument();
  });

  test('calls onBack when back button is clicked', () => {
    render(<SpotDifferenceGame onBack={mockOnBack} />);
    const backButton = screen.getByText('←');
    fireEvent.click(backButton);
    expect(mockOnBack).toHaveBeenCalled();
  });

  test('displays scene elements for house scene', () => {
    render(<SpotDifferenceGame onBack={mockOnBack} />);
    
    // Check for house scene elements (emojis should be present)
    const sunElements = screen.getAllByText('☀️');
    expect(sunElements.length).toBeGreaterThan(0);
    
    const cloudElements = screen.getAllByText('☁️');
    expect(cloudElements.length).toBeGreaterThan(0);
    
    const treeElements = screen.getAllByText('🌳');
    expect(treeElements.length).toBeGreaterThan(0);
  });

  test('has clickable scene containers', () => {
    render(<SpotDifferenceGame onBack={mockOnBack} />);
    
    const sceneContainers = document.querySelectorAll('.scene-container');
    expect(sceneContainers).toHaveLength(2);
    
    // Both containers should be present
    expect(sceneContainers[0]).toBeInTheDocument();
    expect(sceneContainers[1]).toBeInTheDocument();
  });

  test('applies correct CSS classes', () => {
    render(<SpotDifferenceGame onBack={mockOnBack} />);
    
    const gameContainer = document.querySelector('.spot-difference-game');
    expect(gameContainer).toHaveClass('detective-theme');
    
    const leftScene = document.querySelector('.left-scene');
    expect(leftScene).toBeInTheDocument();
    
    const rightScene = document.querySelector('.right-scene');
    expect(rightScene).toBeInTheDocument();
  });

  test('handles click events on scene containers', () => {
    render(<SpotDifferenceGame onBack={mockOnBack} />);
    
    const rightSceneContainer = document.querySelector('.right-scene');
    expect(rightSceneContainer).toBeInTheDocument();
    
    // Click should not throw error
    if (rightSceneContainer) {
      fireEvent.click(rightSceneContainer);
    }
  });

  test('displays initial progress correctly', () => {
    render(<SpotDifferenceGame onBack={mockOnBack} />);
    
    // Should show 0 differences found initially
    expect(screen.getByText('Found: 0/5')).toBeInTheDocument();
    
    // Should show initial score of 0
    expect(screen.getByText('Score: 0')).toBeInTheDocument();
  });
});