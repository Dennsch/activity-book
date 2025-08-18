// Simple test to verify the new pictures are properly added
const fs = require('fs');
const path = require('path');

console.log('Testing new pictures implementation...\n');

// Test ColoringGame
const coloringGamePath = path.join(__dirname, 'src/components/games/ColoringGame.tsx');
const coloringGameContent = fs.readFileSync(coloringGamePath, 'utf8');

console.log('ColoringGame Analysis:');
const coloringPictureMatches = coloringGameContent.match(/name: '[^']+'/g);
if (coloringPictureMatches) {
  console.log(`- Found ${coloringPictureMatches.length} pictures:`);
  coloringPictureMatches.forEach((match, index) => {
    console.log(`  ${index + 1}. ${match.replace("name: '", "").replace("'", "")}`);
  });
} else {
  console.log('- No pictures found');
}

// Test DotToDotGame
const dotToDotGamePath = path.join(__dirname, 'src/components/games/DotToDotGame.tsx');
const dotToDotGameContent = fs.readFileSync(dotToDotGamePath, 'utf8');

console.log('\nDotToDotGame Analysis:');
const dotToDotPictureMatches = dotToDotGameContent.match(/name: '[^']+'/g);
if (dotToDotPictureMatches) {
  console.log(`- Found ${dotToDotPictureMatches.length} pictures:`);
  dotToDotPictureMatches.forEach((match, index) => {
    console.log(`  ${index + 1}. ${match.replace("name: '", "").replace("'", "")}`);
  });
} else {
  console.log('- No pictures found');
}

// Test that test files exist
const coloringTestPath = path.join(__dirname, 'src/components/__tests__/ColoringGame.test.tsx');
const dotToDotTestPath = path.join(__dirname, 'src/components/__tests__/DotToDotGame.test.tsx');

console.log('\nTest Files:');
console.log(`- ColoringGame test: ${fs.existsSync(coloringTestPath) ? 'EXISTS' : 'MISSING'}`);
console.log(`- DotToDotGame test: ${fs.existsSync(dotToDotTestPath) ? 'EXISTS' : 'MISSING'}`);

console.log('\n✅ Picture implementation analysis complete!');