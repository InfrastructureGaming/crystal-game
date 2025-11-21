import { getRandomColor } from './gridHelpers';
import { findMatches, removeMatches, getMatchedColors } from './matchDetector';

/**
 * Applies gravity to make crystals fall down to fill empty spaces
 * Returns new grid with crystals fallen
 */
export const applyGravity = (grid, availableColors) => {
  const size = grid.length;
  const newGrid = grid.map(row => [...row]);

  // Process each column from bottom to top
  for (let col = 0; col < size; col++) {
    // Collect all non-null crystals in this column
    const crystals = [];

    for (let row = 0; row < size; row++) {
      if (newGrid[row][col] !== null) {
        crystals.push(newGrid[row][col]);
      }
    }

    // Clear the column
    for (let row = 0; row < size; row++) {
      newGrid[row][col] = null;
    }

    // Fill from bottom with existing crystals
    let crystalIndex = 0;
    for (let row = size - 1; row >= 0; row--) {
      if (crystalIndex < crystals.length) {
        newGrid[row][col] = crystals[crystalIndex];
        crystalIndex++;
      } else {
        // Fill remaining with new random crystals
        newGrid[row][col] = getRandomColor(availableColors);
      }
    }
  }

  return newGrid;
};

/**
 * Processes all cascades (chain reactions) after a match
 * Returns the final grid and stats about what happened
 */
export const processCascades = (grid, availableColors) => {
  let currentGrid = grid;
  let totalMatches = 0;
  let totalCleared = {};
  let cascadeCount = 0;

  while (true) {
    // Find matches in current grid
    const matches = findMatches(currentGrid);

    if (matches.length === 0) {
      // No more matches, we're done
      break;
    }

    // Track cleared colors
    const clearedColors = getMatchedColors(currentGrid, matches);
    Object.keys(clearedColors).forEach(color => {
      totalCleared[color] = (totalCleared[color] || 0) + clearedColors[color];
    });

    // Remove matches
    currentGrid = removeMatches(currentGrid, matches);

    // Apply gravity to fill gaps
    currentGrid = applyGravity(currentGrid, availableColors);

    totalMatches++;
    cascadeCount++;
  }

  return {
    grid: currentGrid,
    cascadeCount,
    totalCleared,
  };
};

/**
 * Checks if there are any valid moves available on the grid
 * A valid move is a swap that would create at least one match
 */
export const hasValidMoves = (grid) => {
  const size = grid.length;

  // Try every possible swap
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      // Try swapping with the cell to the right
      if (col < size - 1) {
        const testGrid = grid.map(r => [...r]);
        // Swap
        const temp = testGrid[row][col];
        testGrid[row][col] = testGrid[row][col + 1];
        testGrid[row][col + 1] = temp;

        // Check if this creates a match
        if (findMatches(testGrid).length > 0) {
          return true;
        }
      }

      // Try swapping with the cell below
      if (row < size - 1) {
        const testGrid = grid.map(r => [...r]);
        // Swap
        const temp = testGrid[row][col];
        testGrid[row][col] = testGrid[row + 1][col];
        testGrid[row + 1][col] = temp;

        // Check if this creates a match
        if (findMatches(testGrid).length > 0) {
          return true;
        }
      }
    }
  }

  return false;
};

/**
 * Regenerates the grid if no valid moves are available
 * This ensures the game is always playable
 */
export const ensureValidGrid = (grid, availableColors, maxAttempts = 10) => {
  let currentGrid = grid;
  let attempts = 0;

  while (!hasValidMoves(currentGrid) && attempts < maxAttempts) {
    // Shuffle some cells to create new possibilities
    const size = currentGrid.length;
    const newGrid = currentGrid.map(row => [...row]);

    // Randomly swap 20% of the grid
    const swapCount = Math.floor(size * size * 0.2);

    for (let i = 0; i < swapCount; i++) {
      const row1 = Math.floor(Math.random() * size);
      const col1 = Math.floor(Math.random() * size);
      const row2 = Math.floor(Math.random() * size);
      const col2 = Math.floor(Math.random() * size);

      const temp = newGrid[row1][col1];
      newGrid[row1][col1] = newGrid[row2][col2];
      newGrid[row2][col2] = temp;
    }

    currentGrid = newGrid;
    attempts++;
  }

  return currentGrid;
};

/**
 * Finds a hint - returns a valid move that would create a match
 * Returns { pos1: {row, col}, pos2: {row, col} } or null if no moves
 */
export const findHint = (grid) => {
  const size = grid.length;

  // Try every possible swap
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      // Try swapping with the cell to the right
      if (col < size - 1) {
        const testGrid = grid.map(r => [...r]);
        // Swap
        const temp = testGrid[row][col];
        testGrid[row][col] = testGrid[row][col + 1];
        testGrid[row][col + 1] = temp;

        // Check if this creates a match
        if (findMatches(testGrid).length > 0) {
          return {
            pos1: { row, col },
            pos2: { row, col: col + 1 },
          };
        }
      }

      // Try swapping with the cell below
      if (row < size - 1) {
        const testGrid = grid.map(r => [...r]);
        // Swap
        const temp = testGrid[row][col];
        testGrid[row][col] = testGrid[row + 1][col];
        testGrid[row + 1][col] = temp;

        // Check if this creates a match
        if (findMatches(testGrid).length > 0) {
          return {
            pos1: { row, col },
            pos2: { row: row + 1, col },
          };
        }
      }
    }
  }

  return null; // No valid moves found
};
