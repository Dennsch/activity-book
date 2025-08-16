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
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('calls onBack when back button is clicked', () => {
    render(<DotToDotGame onBack={mockOnBack} />);
    
    const backButton = screen.getByText('←');
    fireEvent.click(backButton);
    
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  test('allows connecting dots in correct order', () => {
    render(<DotToDotGame onBack={mockOnBack} />);
    
    // Initially should show "Click on dot number 1"
    expect(screen.getByText('1')).toBeInTheDocument();
    
    // Find and click dot number 1
    const dots = screen.getAllByText('1');
    const dotNumber1 = dots.find(element => 
      element.tagName === 'text' || element.closest('g')
    );
    
    if (dotNumber1) {
      fireEvent.click(dotNumber1);
      
      // After clicking dot 1, should ask for dot 2
      expect(screen.getByText('Connected: 1/10')).toBeInTheDocument();
    }
  });

  test('does not allow connecting dots out of order', () => {
    render(<DotToDotGame onBack={mockOnBack} />);
    
    // Try to click dot number 2 first (should not work)
    const dots = screen.getAllByText('2');
    const dotNumber2 = dots.find(element => 
      element.tagName === 'text' || element.closest('g')
    );
    
    if (dotNumber2) {
      fireEvent.click(dotNumber2);
      
      // Should still be asking for dot 1
      expect(screen.getByText('Connected: 0/10')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    }
  });

  test('resets the game when reset button is clicked', () => {
    render(<DotToDotGame onBack={mockOnBack} />);
    
    // Connect first dot
    const dots = screen.getAllByText('1');
    const dotNumber1 = dots.find(element => 
      element.tagName === 'text' || element.closest('g')
    );
    
    if (dotNumber1) {
      fireEvent.click(dotNumber1);
      expect(screen.getByText('Connected: 1/10')).toBeInTheDocument();
    }
    
    // Click reset button
    const resetButton = screen.getByText('🔄 Start Over');
    fireEvent.click(resetButton);
    
    // Should be back to initial state
    expect(screen.getByText('Connected: 0/10')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
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
    
    // Connect all dots in order
    for (let i = 1; i <= 10; i++) {
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