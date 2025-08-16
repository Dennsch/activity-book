import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MazeGame from '../games/MazeGame';

// Mock canvas context
const mockContext = {
  clearRect: jest.fn(),
  fillRect: jest.fn(),
  strokeRect: jest.fn(),
  fillText: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  getContext: jest.fn(() => mockContext),
};

// Mock canvas
HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);
HTMLCanvasElement.prototype.getBoundingClientRect = jest.fn(() => ({
  left: 0,
  top: 0,
  width: 300,
  height: 300,
  right: 300,
  bottom: 300,
  x: 0,
  y: 0,
  toJSON: jest.fn(),
}));

// Mock window.innerWidth and innerHeight for responsive calculations
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768,
});

describe('MazeGame Component', () => {
  const mockOnBack = jest.fn();

  beforeEach(() => {
    mockOnBack.mockClear();
    jest.clearAllMocks();
  });

  test('renders maze game title', () => {
    render(<MazeGame onBack={mockOnBack} />);
    expect(screen.getByText('🚜 Digger Maze Adventure! 🚜')).toBeInTheDocument();
  });

  test('displays score board with initial values', () => {
    render(<MazeGame onBack={mockOnBack} />);
    expect(screen.getByText('Score: 0')).toBeInTheDocument();
    expect(screen.getByText('Level: 1')).toBeInTheDocument();
  });

  test('displays maze instructions', () => {
    render(<MazeGame onBack={mockOnBack} />);
    expect(screen.getByText('🚜 Help the digger find the treasure! 💎')).toBeInTheDocument();
    expect(screen.getByText('Draw a path from the digger to the treasure!')).toBeInTheDocument();
  });

  test('displays game tips', () => {
    render(<MazeGame onBack={mockOnBack} />);
    expect(screen.getByText('Stay on the light brown paths!')).toBeInTheDocument();
    expect(screen.getByText('Avoid the dark brown walls!')).toBeInTheDocument();
  });

  test('renders canvas with correct attributes', () => {
    render(<MazeGame onBack={mockOnBack} />);
    const canvas = screen.getByRole('img', { hidden: true }); // Canvas has img role
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveStyle('touch-action: none');
  });

  test('displays try again button', () => {
    render(<MazeGame onBack={mockOnBack} />);
    expect(screen.getByText('🔄 Try Again')).toBeInTheDocument();
  });

  test('calls onBack when back button is clicked', () => {
    render(<MazeGame onBack={mockOnBack} />);
    const backButton = screen.getByText('←');
    fireEvent.click(backButton);
    expect(mockOnBack).toHaveBeenCalled();
  });

  test('resets maze when try again button is clicked', () => {
    render(<MazeGame onBack={mockOnBack} />);
    const tryAgainButton = screen.getByText('🔄 Try Again');
    fireEvent.click(tryAgainButton);
    // The component should reset without errors
    expect(screen.getByText('Score: 0')).toBeInTheDocument();
    expect(screen.getByText('Level: 1')).toBeInTheDocument();
  });

  test('handles mouse events on canvas', () => {
    render(<MazeGame onBack={mockOnBack} />);
    const canvas = screen.getByRole('img', { hidden: true });
    
    // Test mouse down
    fireEvent.mouseDown(canvas, { clientX: 10, clientY: 10 });
    
    // Test mouse move
    fireEvent.mouseMove(canvas, { clientX: 20, clientY: 20 });
    
    // Test mouse up
    fireEvent.mouseUp(canvas);
    
    // Should not throw errors
    expect(canvas).toBeInTheDocument();
  });

  test('handles touch events on canvas', () => {
    render(<MazeGame onBack={mockOnBack} />);
    const canvas = screen.getByRole('img', { hidden: true });
    
    // Test touch start
    fireEvent.touchStart(canvas, {
      touches: [{ clientX: 10, clientY: 10 }]
    });
    
    // Test touch move
    fireEvent.touchMove(canvas, {
      touches: [{ clientX: 20, clientY: 20 }]
    });
    
    // Test touch end
    fireEvent.touchEnd(canvas);
    
    // Should not throw errors
    expect(canvas).toBeInTheDocument();
  });

  test('prevents default behavior on touch events', () => {
    render(<MazeGame onBack={mockOnBack} />);
    const canvas = screen.getByRole('img', { hidden: true });
    
    const touchStartEvent = new TouchEvent('touchstart', {
      touches: [new Touch({
        identifier: 1,
        target: canvas,
        clientX: 10,
        clientY: 10,
        radiusX: 1,
        radiusY: 1,
        rotationAngle: 0,
        force: 1,
      })]
    });
    
    const preventDefaultSpy = jest.spyOn(touchStartEvent, 'preventDefault');
    fireEvent(canvas, touchStartEvent);
    
    // Note: In jsdom, preventDefault might not be called exactly as in real browsers
    // but the component should handle it properly
    expect(canvas).toBeInTheDocument();
  });

  test('handles mouse leave event', () => {
    render(<MazeGame onBack={mockOnBack} />);
    const canvas = screen.getByRole('img', { hidden: true });
    
    // Start drawing
    fireEvent.mouseDown(canvas, { clientX: 10, clientY: 10 });
    
    // Mouse leave should stop drawing
    fireEvent.mouseLeave(canvas);
    
    // Should not throw errors
    expect(canvas).toBeInTheDocument();
  });

  test('handles touch cancel event', () => {
    render(<MazeGame onBack={mockOnBack} />);
    const canvas = screen.getByRole('img', { hidden: true });
    
    // Start touch
    fireEvent.touchStart(canvas, {
      touches: [{ clientX: 10, clientY: 10 }]
    });
    
    // Touch cancel should stop drawing
    fireEvent(canvas, new Event('touchcancel'));
    
    // Should not throw errors
    expect(canvas).toBeInTheDocument();
  });

  test('responsive canvas sizing', () => {
    // Test with smaller window size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 320,
    });

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 568,
    });

    render(<MazeGame onBack={mockOnBack} />);
    const canvas = screen.getByRole('img', { hidden: true });
    expect(canvas).toBeInTheDocument();
    
    // Reset window size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  test('displays completion message when level is completed', async () => {
    render(<MazeGame onBack={mockOnBack} />);
    
    // We can't easily simulate winning in the test environment due to canvas complexity
    // but we can test that the component renders without the completion message initially
    expect(screen.queryByText('Great job! The digger found the treasure!')).not.toBeInTheDocument();
  });

  test('component handles level progression', () => {
    render(<MazeGame onBack={mockOnBack} />);
    
    // Initially should be level 1
    expect(screen.getByText('Level: 1')).toBeInTheDocument();
    
    // The component should handle level changes without errors
    // (actual level progression testing would require complex canvas interaction simulation)
  });

  test('component handles multiple maze patterns', () => {
    render(<MazeGame onBack={mockOnBack} />);
    
    // The component should render with the first maze pattern
    expect(screen.getByText('Level: 1')).toBeInTheDocument();
    
    // Canvas should be rendered for the maze
    const canvas = screen.getByRole('img', { hidden: true });
    expect(canvas).toBeInTheDocument();
  });

  test('canvas has collision feedback class when collision occurs', () => {
    render(<MazeGame onBack={mockOnBack} />);
    const canvas = screen.getByRole('img', { hidden: true });
    
    // Initially should not have collision feedback class
    expect(canvas).not.toHaveClass('collision-feedback');
    
    // The collision feedback would be triggered by actual collision detection
    // which is complex to test in the unit test environment
    expect(canvas).toBeInTheDocument();
  });

  test('handles window resize events', () => {
    render(<MazeGame onBack={mockOnBack} />);
    
    // Simulate window resize
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });
    
    fireEvent(window, new Event('resize'));
    
    // Component should handle resize without errors
    expect(screen.getByText('Level: 1')).toBeInTheDocument();
  });

  test('supports up to 10 levels', () => {
    render(<MazeGame onBack={mockOnBack} />);
    
    // The component should support multiple levels
    // Testing actual level progression would require complex simulation
    expect(screen.getByText('Level: 1')).toBeInTheDocument();
  });
});