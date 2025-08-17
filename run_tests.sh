#!/bin/bash

# Run the dot-to-dot game tests to verify current implementation
echo "Running DotToDotGame tests..."
npm test -- --testPathPattern=DotToDotGame.test.tsx --watchAll=false --verbose

echo "Test run completed."