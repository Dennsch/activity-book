import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders main menu by default', () => {
    render(<App />);
    expect(screen.getByText('🌟 Activity Book 🌟')).toBeInTheDocument();
    expect(screen.getByText('Choose a fun game to play!')).toBeInTheDocument();
  });

  test('displays all game options', () => {
    render(<App />);
    expect(screen.getByText('🦕 Math with Dinos')).toBeInTheDocument();
    expect(screen.getByText('🏎️ Letter Racing')).toBeInTheDocument();
    expect(screen.getByText('🚜 Digger Maze')).toBeInTheDocument();
    expect(screen.getByText('🎨 Color Fun')).toBeInTheDocument();
    expect(screen.getByText('🔗 Connect the Dots')).toBeInTheDocument();
    expect(screen.getByText('🔤 Word Detective')).toBeInTheDocument();
    expect(screen.getByText('🔍 Spot the Difference')).toBeInTheDocument();
  });

  test('navigates to math game when clicked', () => {
    render(<App />);
    const mathButton = screen.getByText('🦕 Math with Dinos');
    fireEvent.click(mathButton);
    expect(screen.getByText('🦕 Math with Dinosaurs! 🦕')).toBeInTheDocument();
  });

  test('navigates to letter game when clicked', () => {
    render(<App />);
    const letterButton = screen.getByText('🏎️ Letter Racing');
    fireEvent.click(letterButton);
    expect(screen.getByText('🏎️ Letter Racing! 🏎️')).toBeInTheDocument();
  });

  test('navigates to spot difference game when clicked', () => {
    render(<App />);
    const spotDifferenceButton = screen.getByText('🔍 Spot the Difference');
    fireEvent.click(spotDifferenceButton);
    expect(screen.getByText('🔍 Spot the Difference! 🔍')).toBeInTheDocument();
  });

  test('back button returns to main menu', () => {
    render(<App />);
    const mathButton = screen.getByText('🦕 Math with Dinos');
    fireEvent.click(mathButton);
    
    const backButton = screen.getByText('←');
    fireEvent.click(backButton);
    
    expect(screen.getByText('🌟 Activity Book 🌟')).toBeInTheDocument();
  });
});