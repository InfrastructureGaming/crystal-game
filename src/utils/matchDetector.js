/**
 * Finds all matches in the grid (3+ crystals in a row/column)
 * Returns an array of positions that are part of matches
 */
export const findMatches = (grid) => {
  const matches = new Set();
  const size = grid.length;

  // Check horizontal matches
  for (let row = 0; row < size; row++) {
    let matchStart = 0;

    for (let col = 1; col <= size; col++) {
      const currentColor = col < size ? grid[row][col] : null;
      const prevColor = grid[row][col - 1];

      // If color changes or we're at the end
      if (currentColor !== prevColor || col === size) {
        const matchLength = col - matchStart;

        // If we have 3+ in a row, mark them as matches
        if (matchLength >= 3 && prevColor !== null) {
          for (let i = matchStart; i < col; i++) {
            matches.add(`${row},${i}`);
          }
        }

        matchStart = col;
      }
    }
  }

  // Check vertical matches
  for (let col = 0; col < size; col++) {
    let matchStart = 0;

    for (let row = 1; row <= size; row++) {
      const currentColor = row < size ? grid[row][col] : null;
      const prevColor = grid[row - 1][col];

      // If color changes or we're at the end
      if (currentColor !== prevColor || row === size) {
        const matchLength = row - matchStart;

        // If we have 3+ in a column, mark them as matches
        if (matchLength >= 3 && prevColor !== null) {
          for (let i = matchStart; i < row; i++) {
            matches.add(`${i},${col}`);
          }
        }

        matchStart = row;
      }
    }
  }

  // Convert set back to array of position objects
  return Array.from(matches).map(pos => {
    const [row, col] = pos.split(',').map(Number);
    return { row, col };
  });
};

/**
 * Removes matched crystals from the grid (sets them to null)
 */
export const removeMatches = (grid, matches) => {
  const newGrid = grid.map(row => [...row]);

  matches.forEach(({ row, col }) => {
    newGrid[row][col] = null;
  });

  return newGrid;
};

/**
 * Counts the number of matches in a grid
 */
export const countMatches = (grid) => {
  const matches = findMatches(grid);

  // Group matches by connected regions
  // For now, we'll use a simple approach: count horizontal and vertical match groups
  const size = grid.length;
  let matchCount = 0;

  // Count horizontal match groups
  for (let row = 0; row < size; row++) {
    let inMatch = false;
    let matchLength = 0;

    for (let col = 0; col < size; col++) {
      const isMatched = matches.some(m => m.row === row && m.col === col);

      if (isMatched) {
        if (!inMatch) {
          inMatch = true;
          matchLength = 1;
        } else {
          matchLength++;
        }
      } else {
        if (inMatch && matchLength >= 3) {
          matchCount++;
        }
        inMatch = false;
        matchLength = 0;
      }
    }

    if (inMatch && matchLength >= 3) {
      matchCount++;
    }
  }

  // Count vertical match groups (only those not already counted)
  for (let col = 0; col < size; col++) {
    let inMatch = false;
    let matchLength = 0;

    for (let row = 0; row < size; row++) {
      const isMatched = matches.some(m => m.row === row && m.col === col);

      if (isMatched) {
        if (!inMatch) {
          inMatch = true;
          matchLength = 1;
        } else {
          matchLength++;
        }
      } else {
        if (inMatch && matchLength >= 3) {
          // Check if this vertical match intersects with horizontal matches
          // If it does, don't double count
          let hasHorizontalMatch = false;
          for (let r = row - matchLength; r < row; r++) {
            // Check if this cell is part of a horizontal match
            let horizontalCount = 0;
            for (let c = 0; c < size; c++) {
              if (matches.some(m => m.row === r && m.col === c)) {
                horizontalCount++;
              } else {
                horizontalCount = 0;
              }
              if (horizontalCount >= 3) {
                hasHorizontalMatch = true;
                break;
              }
            }
            if (hasHorizontalMatch) break;
          }

          if (!hasHorizontalMatch) {
            matchCount++;
          }
        }
        inMatch = false;
        matchLength = 0;
      }
    }

    if (inMatch && matchLength >= 3) {
      let hasHorizontalMatch = false;
      for (let r = size - matchLength; r < size; r++) {
        let horizontalCount = 0;
        for (let c = 0; c < size; c++) {
          if (matches.some(m => m.row === r && m.col === c)) {
            horizontalCount++;
          } else {
            horizontalCount = 0;
          }
          if (horizontalCount >= 3) {
            hasHorizontalMatch = true;
            break;
          }
        }
        if (hasHorizontalMatch) break;
      }

      if (!hasHorizontalMatch) {
        matchCount++;
      }
    }
  }

  return matchCount;
};

/**
 * Gets the color of matched crystals (for tracking goals)
 * Returns an object with color counts from the matches
 */
export const getMatchedColors = (grid, matches) => {
  const colorCounts = {};

  matches.forEach(({ row, col }) => {
    const color = grid[row][col];
    if (color) {
      colorCounts[color] = (colorCounts[color] || 0) + 1;
    }
  });

  return colorCounts;
};
