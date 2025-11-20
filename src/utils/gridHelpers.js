import { getColorsForTier } from '../constants/colors';

/**
 * Creates an empty grid of specified size
 */
export const createEmptyGrid = (size) => {
  return Array(size).fill(null).map(() => Array(size).fill(null));
};

/**
 * Gets a random color from the available colors for a tier
 */
export const getRandomColor = (availableColors) => {
  return availableColors[Math.floor(Math.random() * availableColors.length)];
};

/**
 * Checks if a position is valid within the grid
 */
export const isValidPosition = (row, col, size) => {
  return row >= 0 && row < size && col >= 0 && col < size;
};

/**
 * Gets the value at a grid position
 */
export const getCell = (grid, row, col) => {
  if (!isValidPosition(row, col, grid.length)) return null;
  return grid[row][col];
};

/**
 * Creates a deep copy of a grid
 */
export const cloneGrid = (grid) => {
  return grid.map(row => [...row]);
};

/**
 * Checks if placing a color at position would create an instant match
 */
export const wouldCreateMatch = (grid, row, col, color) => {
  // Check horizontal matches (look left and right)
  let horizontalCount = 1;

  // Count left
  let checkCol = col - 1;
  while (checkCol >= 0 && grid[row][checkCol] === color) {
    horizontalCount++;
    checkCol--;
  }

  // Count right
  checkCol = col + 1;
  while (checkCol < grid.length && grid[row][checkCol] === color) {
    horizontalCount++;
    checkCol++;
  }

  if (horizontalCount >= 3) return true;

  // Check vertical matches (look up and down)
  let verticalCount = 1;

  // Count up
  let checkRow = row - 1;
  while (checkRow >= 0 && grid[checkRow][col] === color) {
    verticalCount++;
    checkRow--;
  }

  // Count down
  checkRow = row + 1;
  while (checkRow < grid.length && grid[checkRow][col] === color) {
    verticalCount++;
    checkRow++;
  }

  if (verticalCount >= 3) return true;

  return false;
};

/**
 * Counts occurrences of each color in the grid
 */
export const countColors = (grid) => {
  const counts = {};

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const color = grid[row][col];
      if (color) {
        counts[color] = (counts[color] || 0) + 1;
      }
    }
  }

  return counts;
};

/**
 * Swaps two cells in the grid (returns new grid)
 */
export const swapCells = (grid, pos1, pos2) => {
  const newGrid = cloneGrid(grid);
  const temp = newGrid[pos1.row][pos1.col];
  newGrid[pos1.row][pos1.col] = newGrid[pos2.row][pos2.col];
  newGrid[pos2.row][pos2.col] = temp;
  return newGrid;
};

/**
 * Checks if two positions are adjacent (horizontally or vertically)
 */
export const areAdjacent = (pos1, pos2) => {
  const rowDiff = Math.abs(pos1.row - pos2.row);
  const colDiff = Math.abs(pos1.col - pos2.col);

  // Adjacent means one position differs by 1, the other by 0
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
};
