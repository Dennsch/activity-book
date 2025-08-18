import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DotToDotGame from '../games/DotToDotGame';

describe('DotToDotGame', () => {
  const mockOnBack = jest.fn();

  beforeEach(() => {
    mockOnBack.mockClear();
  });

  test('renders the game title and initial state', () => {
    render(<DotToDotGame onBack={mockOnBack} />);
    
    expect(screen.getByText('🔗 Connect the Dots! 🔗')).toBeInTheDocument();
    expect(screen.getByText('Connected: 0/10')).toBeInTheDocument();
    expect(screen.getByText('Click on dot number')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument(); // Should start with highest number
  });

  test('has multiple levels available', () => {
    render(<DotToDotGame onBack={mockOnBack} />);
    
    // Initially should show "Happy Star"
    expect(screen.getByText('⭐ Happy Star')).toBeInTheDocument();
    
    // Click through all levels to verify they exist
    const nextButton = screen.getByText('➡️ Next Picture');
    
    // Level 2: Cute House
    fireEvent.click(nextButton);
    expect(screen.getByText('🏠 Cute House')).toBeInTheDocument();
    
    // Level 3: Friendly Fish
    fireEvent.click(nextButton);
    expect(screen.getByText('🐠 Friendly Fish')).toBeInTheDocument();
    
    // Level 4: Racing Car
    fireEvent.click(nextButton);
    expect(screen.getByText('🏎️ Racing Car')).toBeInTheDocument();
    
    // Level 5: Smiling Sun
    fireEvent.click(nextButton);
    expect(screen.getByText('☀️ Smiling Sun')).toBeInTheDocument();
    
    // Level 6: Cute Cat
    fireEvent.click(nextButton);
    expect(screen.getByText('🐱 Cute Cat')).toBeInTheDocument();
    
    // Level 7: Rocket Ship
    fireEvent.click(nextButton);
    expect(screen.getByText('🚀 Rocket Ship')).toBeInTheDocument();
    
    // Level 8: Happy Butterfly
    fireEvent.click(nextButton);
    expect(screen.getByText('🦋 Happy Butterfly')).toBeInTheDocument();
    
    // Level 9: Sweet Heart
    fireEvent.click(nextButton);
    expect(screen.getByText('💖 Sweet Heart')).toBeInTheDocument();
    
    // Level 10: Juicy Apple
    fireEvent.click(nextButton);
    expect(screen.getByText('🍎 Juicy Apple')).toBeInTheDocument();
    
    // Level 11: Flying Airplane
    fireEvent.click(nextButton);
    expect(screen.getByText('✈️ Flying Airplane')).toBeInTheDocument();
    
    // Level 12: Colorful Umbrella
    fireEvent.click(nextButton);
    expect(screen.getByText('☂️ Colorful Umbrella')).toBeInTheDocument();
    
    // Level 13: Royal Crown
    fireEvent.click(nextButton);
    expect(screen.getByText('👑 Royal Crown')).toBeInTheDocument();
    
    // Level 14: Simple Flower
    fireEvent.click(nextButton);
    expect(screen.getByText('🌻 Simple Flower')).toBeInTheDocument();
    
    // Should cycle back to first level
    fireEvent.click(nextButton);
    expect(screen.getByText('⭐ Happy Star')).toBeInTheDocument();
  });

  test('calls onBack when back button is clicked', () => {
    render(<DotToDotGame onBack={mockOnBack} />);
    
    const backButton = screen.getByText('←');
    fireEvent.click(backButton);
    
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  test('allows connecting dots in correct reverse order', () => {
    render(<DotToDotGame onBack={mockOnBack} />);
    
    // Initially should show "Click on dot number 10" (highest number)
    expect(screen.getByText('10')).toBeInTheDocument();
    
    // Find and click dot number 10
    const dots = screen.getAllByText('10');
    const dotNumber10 = dots.find(element => 
      element.tagName === 'text' || element.closest('g')
    );
    
    if (dotNumber10) {
      fireEvent.click(dotNumber10);
      
      // After clicking dot 10, should ask for dot 9
      expect(screen.getByText('Connected: 1/10')).toBeInTheDocument();
    }
  });

  test('does not allow connecting dots out of order', () => {
    render(<DotToDotGame onBack={mockOnBack} />);
    
    // Try to click dot number 9 first (should not work, need to start with 10)
    const dots = screen.getAllByText('9');
    const dotNumber9 = dots.find(element => 
      element.tagName === 'text' || element.closest('g')
    );
    
    if (dotNumber9) {
      fireEvent.click(dotNumber9);
      
      // Should still be asking for dot 10
      expect(screen.getByText('Connected: 0/10')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    }
  });

  test('resets the game when reset button is clicked', () => {
    render(<DotToDotGame onBack={mockOnBack} />);
    
    // Connect first dot (highest number)
    const dots = screen.getAllByText('10');
    const dotNumber10 = dots.find(element => 
      element.tagName === 'text' || element.closest('g')
    );
    
    if (dotNumber10) {
      fireEvent.click(dotNumber10);
      expect(screen.getByText('Connected: 1/10')).toBeInTheDocument();
    }
    
    // Click reset button
    const resetButton = screen.getByText('🔄 Start Over');
    fireEvent.click(resetButton);
    
    // Should be back to initial state
    expect(screen.getByText('Connected: 0/10')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  test('advances to next picture when next button is clicked', () => {
    render(<DotToDotGame onBack={mockOnBack} />);
    
    // Initially should show "Happy Star"
    expect(screen.getByText('⭐ Happy Star')).toBeInTheDocument();
    
    // Click next picture button
    const nextButton = screen.getByText('➡️ Next Picture');
    fireEvent.click(nextButton);
    
    // Should now show "Cute House"
    expect(screen.getByText('🏠 Cute House')).toBeInTheDocument();
  });

  test('handles overlapping dots correctly - smaller number appears on top', () => {
    render(<DotToDotGame onBack={mockOnBack} />);
    
    // Navigate to "Cute House" which has overlapping dots (1 and 6 at same position)
    const nextButton = screen.getByText('➡️ Next Picture');
    fireEvent.click(nextButton);
    
    expect(screen.getByText('🏠 Cute House')).toBeInTheDocument();
    
    // Get all SVG elements
    const svg = document.querySelector('.dot-to-dot-svg');
    expect(svg).toBeInTheDocument();
    
    if (svg) {
      // Get all circle elements (dots)
      const circles = svg.querySelectorAll('circle');
      const textElements = svg.querySelectorAll('text');
      
      // Find dots with numbers 1 and 6 (they should be at the same position in Cute House)
      let dot1Element = null;
      let dot6Element = null;
      let dot1Index = -1;
      let dot6Index = -1;
      
      textElements.forEach((textEl, index) => {
        if (textEl.textContent === '1') {
          dot1Element = textEl;
          dot1Index = index;
        }
        if (textEl.textContent === '6') {
          dot6Element = textEl;
          dot6Index = index;
        }
      });
      
      // Verify both dots exist
      expect(dot1Element).toBeTruthy();
      expect(dot6Element).toBeTruthy();
      
      if (dot1Element && dot6Element) {
        // Get their positions
        const dot1X = dot1Element.getAttribute('x');
        const dot1Y = dot1Element.getAttribute('y');
        const dot6X = dot6Element.getAttribute('x');
        const dot6Y = dot6Element.getAttribute('y');
        
        // Verify they are at the same position (200, 80 in the data)
        expect(dot1X).toBe(dot6X);
        expect(dot1Y).toBe(dot6Y);
        expect(dot1X).toBe('200');
        expect(dot1Y).toBe('80');
        
        // Verify that dot 1 (smaller number) appears later in the DOM order
        // (later elements appear on top in SVG)
        expect(dot1Index).toBeGreaterThan(dot6Index);
      }
    }
  });

  test('handles overlapping dots in Friendly Fish picture', () => {
    render(<DotToDotGame onBack={mockOnBack} />);
    
    // Navigate to "Friendly Fish" which has overlapping dots (1 and 9 at same position)
    const nextButton = screen.getByText('➡️ Next Picture');
    fireEvent.click(nextButton); // Go to Cute House
    fireEvent.click(nextButton); // Go to Friendly Fish
    
    expect(screen.getByText('🐠 Friendly Fish')).toBeInTheDocument();
    
    // Get all SVG elements
    const svg = document.querySelector('.dot-to-dot-svg');
    expect(svg).toBeInTheDocument();
    
    if (svg) {
      const textElements = svg.querySelectorAll('text');
      
      // Find dots with numbers 1 and 9 (they should be at the same position)
      let dot1Element = null;
      let dot9Element = null;
      let dot1Index = -1;
      let dot9Index = -1;
      
      textElements.forEach((textEl, index) => {
        if (textEl.textContent === '1') {
          dot1Element = textEl;
          dot1Index = index;
        }
        if (textEl.textContent === '9') {
          dot9Element = textEl;
          dot9Index = index;
        }
      });
      
      // Verify both dots exist
      expect(dot1Element).toBeTruthy();
      expect(dot9Element).toBeTruthy();
      
      if (dot1Element && dot9Element) {
        // Get their positions
        const dot1X = dot1Element.getAttribute('x');
        const dot1Y = dot1Element.getAttribute('y');
        const dot9X = dot9Element.getAttribute('x');
        const dot9Y = dot9Element.getAttribute('y');
        
        // Verify they are at the same position (80, 150 in the data)
        expect(dot1X).toBe(dot9X);
        expect(dot1Y).toBe(dot9Y);
        expect(dot1X).toBe('80');
        expect(dot1Y).toBe('150');
        
        // Verify that dot 1 (smaller number) appears later in the DOM order
        expect(dot1Index).toBeGreaterThan(dot9Index);
      }
    }
  });

  test('enhanced visibility updates as dots are connected', () => {
    render(<DotToDotGame onBack={mockOnBack} />);
    
    const svg = document.querySelector('.dot-to-dot-svg');
    expect(svg).toBeInTheDocument();
    
    if (svg) {
      // Initially, dot 10 should have enhanced visibility
      let glowElements = svg.querySelectorAll('.dot-glow');
      let pulseRingElements = svg.querySelectorAll('.dot-pulse-ring');
      expect(glowElements.length).toBe(1);
      expect(pulseRingElements.length).toBe(1);
      
      // Connect dot 10
      const dots = screen.getAllByText('10');
      const dotNumber10 = dots.find(element => 
        element.tagName === 'text' || element.closest('g')
      );
      
      if (dotNumber10) {
        fireEvent.click(dotNumber10);
        
        // Now dot 9 should have enhanced visibility
        expect(screen.getByText('Connected: 1/10')).toBeInTheDocument();
        
        // Check that visibility elements still exist (now for dot 9)
        glowElements = svg.querySelectorAll('.dot-glow');
        pulseRingElements = svg.querySelectorAll('.dot-pulse-ring');
        expect(glowElements.length).toBe(1);
        expect(pulseRingElements.length).toBe(1);
      }
    }
  });

  test('handles overlapping dots in Happy Butterfly picture', () => {
    render(<DotToDotGame onBack={mockOnBack} />);
    
    // Navigate to "Happy Butterfly" which has overlapping dots (22 and 23 at same position)
    const nextButton = screen.getByText('➡️ Next Picture');
    // Click 7 times to get to Happy Butterfly (8th level, same as before)
    for (let i = 0; i < 7; i++) {
      fireEvent.click(nextButton);
    }
    
    expect(screen.getByText('🦋 Happy Butterfly')).toBeInTheDocument();
    
    // Get all SVG elements
    const svg = document.querySelector('.dot-to-dot-svg');
    expect(svg).toBeInTheDocument();
    
    if (svg) {
      const textElements = svg.querySelectorAll('text');
      
      // Find dots with numbers 22 and 23 (they should be at the same position)
      let dot22Element = null;
      let dot23Element = null;
      let dot22Index = -1;
      let dot23Index = -1;
      
      textElements.forEach((textEl, index) => {
        if (textEl.textContent === '22') {
          dot22Element = textEl;
          dot22Index = index;
        }
        if (textEl.textContent === '23') {
          dot23Element = textEl;
          dot23Index = index;
        }
      });
      
      // Verify both dots exist
      expect(dot22Element).toBeTruthy();
      expect(dot23Element).toBeTruthy();
      
      if (dot22Element && dot23Element) {
        // Get their positions
        const dot22X = dot22Element.getAttribute('x');
        const dot22Y = dot22Element.getAttribute('y');
        const dot23X = dot23Element.getAttribute('x');
        const dot23Y = dot23Element.getAttribute('y');
        
        // Verify they are at the same position (250, 160 in the data)
        expect(dot22X).toBe(dot23X);
        expect(dot22Y).toBe(dot23Y);
        expect(dot22X).toBe('250');
        expect(dot22Y).toBe('160');
        
        // Verify that dot 22 (smaller number) appears later in the DOM order
        expect(dot22Index).toBeGreaterThan(dot23Index);
      }
    }
  });

  test('current dot has enhanced visibility classes', () => {
    render(<DotToDotGame onBack={mockOnBack} />);
    
    const svg = document.querySelector('.dot-to-dot-svg');
    expect(svg).toBeInTheDocument();
    
    if (svg) {
      // Find the current dot (should be dot 10)
      const circles = svg.querySelectorAll('circle');
      const textElements = svg.querySelectorAll('text');
      
      // Look for the current dot's circle
      let currentDotCircle = null;
      let currentDotText = null;
      
      circles.forEach(circle => {
        if (circle.classList.contains('current-target')) {
          currentDotCircle = circle;
        }
      });
      
      textElements.forEach(text => {
        if (text.classList.contains('current-number')) {
          currentDotText = text;
        }
      });
      
      // Verify enhanced visibility elements exist
      expect(currentDotCircle).toBeTruthy();
      expect(currentDotText).toBeTruthy();
      
      // Check for glow and pulse ring elements
      const glowElements = svg.querySelectorAll('.dot-glow');
      const pulseRingElements = svg.querySelectorAll('.dot-pulse-ring');
      
      expect(glowElements.length).toBeGreaterThan(0);
      expect(pulseRingElements.length).toBeGreaterThan(0);
    }
  });

  test('levels have varying complexity', () => {
    render(<DotToDotGame onBack={mockOnBack} />);
    
    const nextButton = screen.getByText('➡️ Next Picture');
    
    // Test different levels have different dot counts and start with highest number
    const levelTests = [
      { name: '⭐ Happy Star', expectedDots: 10, startingDot: '10' },
      { name: '🏠 Cute House', expectedDots: 10, startingDot: '10' },
      { name: '🐠 Friendly Fish', expectedDots: 12, startingDot: '12' },
      { name: '🏎️ Racing Car', expectedDots: 15, startingDot: '15' },
      { name: '☀️ Smiling Sun', expectedDots: 14, startingDot: '14' },
      { name: '🐱 Cute Cat', expectedDots: 17, startingDot: '17' },
      { name: '🚀 Rocket Ship', expectedDots: 22, startingDot: '22' },
      { name: '🦋 Happy Butterfly', expectedDots: 23, startingDot: '23' },
      { name: '💖 Sweet Heart', expectedDots: 13, startingDot: '13' },
      { name: '🍎 Juicy Apple', expectedDots: 15, startingDot: '15' },
      { name: '✈️ Flying Airplane', expectedDots: 19, startingDot: '19' },
      { name: '☂️ Colorful Umbrella', expectedDots: 15, startingDot: '15' },
      { name: '👑 Royal Crown', expectedDots: 15, startingDot: '15' },
      { name: '🌻 Simple Flower', expectedDots: 15, startingDot: '15' }
    ];
    
    levelTests.forEach((level, index) => {
      if (index > 0) {
        fireEvent.click(nextButton);
      }
      
      expect(screen.getByText(level.name)).toBeInTheDocument();
      expect(screen.getByText(`Connected: 0/${level.expectedDots}`)).toBeInTheDocument();
      expect(screen.getByText(level.startingDot)).toBeInTheDocument();
    });
  });

  test('non-overlapping dots maintain their original relative order', () => {
    render(<DotToDotGame onBack={mockOnBack} />);
    
    // Stay on Happy Star (first picture) which has no overlapping dots
    expect(screen.getByText('⭐ Happy Star')).toBeInTheDocument();
    
    const svg = document.querySelector('.dot-to-dot-svg');
    expect(svg).toBeInTheDocument();
    
    if (svg) {
      const textElements = svg.querySelectorAll('text');
      const dotNumbers = Array.from(textElements).map(el => parseInt(el.textContent || '0'));
      
      // For non-overlapping dots, the order should be based on the original id order
      // In Happy Star, all dots have different positions, so they should maintain
      // their relative order based on their id (which matches their number in this case)
      expect(dotNumbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    }
  });

  test('game completion works correctly', () => {
    render(<DotToDotGame onBack={mockOnBack} />);
    
    // Connect all dots in reverse order (10 down to 1)
    for (let i = 10; i >= 1; i--) {
      const dots = screen.getAllByText(i.toString());
      const dotElement = dots.find(element => 
        element.tagName === 'text' || element.closest('g')
      );
      
      if (dotElement) {
        fireEvent.click(dotElement);
      }
    }
    
    // Should show completion message
    expect(screen.getByText('Wonderful! You revealed the Happy Star!')).toBeInTheDocument();
    expect(screen.getByText('Pictures: 1')).toBeInTheDocument();
  });
});