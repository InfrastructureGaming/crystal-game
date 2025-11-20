import { getTierForLevel, getProgressInTier } from '../constants/tiers';
import { getColorsForTier } from '../constants/colors';
import {
  createEmptyGrid,
  getRandomColor,
  wouldCreateMatch,
  countColors,
} from './gridHelpers';

/**
 * Generates a valid grid with no instant matches
 */
export const generateGrid = (size, availableColors, maxAttempts = 100) => {
  let attempts = 0;

  while (attempts < maxAttempts) {
    const grid = createEmptyGrid(size);

    // Fill each cell with a random color that doesn't create a match
    let success = true;

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        // Try to find a valid color for this position
        const shuffledColors = [...availableColors].sort(() => Math.random() - 0.5);
        let foundValid = false;

        for (const color of shuffledColors) {
          if (!wouldCreateMatch(grid, row, col, color)) {
            grid[row][col] = color;
            foundValid = true;
            break;
          }
        }

        if (!foundValid) {
          // Couldn't find a valid color - restart
          success = false;
          break;
        }
      }

      if (!success) break;
    }

    if (success) {
      return grid;
    }

    attempts++;
  }

  // Fallback: just create a random grid (shouldn't happen often)
  console.warn('Failed to generate grid without matches, using fallback');
  const grid = createEmptyGrid(size);
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      grid[row][col] = getRandomColor(availableColors);
    }
  }
  return grid;
};

/**
 * Generates a goal for the level based on tier configuration
 */
const generateGoal = (tier, config, levelNumber, availableColors) => {
  const progress = getProgressInTier(levelNumber, tier, config);
  const goalTypes = config.goalTypes;

  // Rotate through goal types to add variety
  const goalTypeIndex = (levelNumber - config.levels[0]) % goalTypes.length;
  const goalType = goalTypes[goalTypeIndex];

  switch (goalType) {
    case 'clear_color': {
      const [min, max] = config.targetRanges.clear_color;
      const amount = Math.floor(min + (max - min) * progress);
      const color = availableColors[Math.floor(Math.random() * availableColors.length)];

      return {
        type: 'clear_color',
        color,
        amount,
        description: `Clear ${amount} ${color} crystals`,
      };
    }

    case 'make_matches': {
      const [min, max] = config.targetRanges.make_matches;
      const amount = Math.floor(min + (max - min) * progress);

      return {
        type: 'make_matches',
        amount,
        description: `Make ${amount} matches`,
      };
    }

    case 'clear_dual': {
      const [min, max] = config.targetRanges.clear_dual;
      const amount = Math.floor(min + (max - min) * progress);

      // Pick two random colors
      const shuffled = [...availableColors].sort(() => Math.random() - 0.5);
      const color1 = shuffled[0];
      const color2 = shuffled[1];

      return {
        type: 'clear_dual',
        targets: [
          { color: color1, amount },
          { color: color2, amount },
        ],
        description: `Clear ${amount} ${color1} and ${amount} ${color2} crystals`,
      };
    }

    default:
      throw new Error(`Unknown goal type: ${goalType}`);
  }
};

/**
 * Calculates move limit for the level
 */
const calculateMoveLimit = (tier, config, levelNumber) => {
  if (!config.moveLimit) return null;

  const progress = getProgressInTier(levelNumber, tier, config);
  const [max, min] = config.moveLimit; // Note: reversed for difficulty

  // As progress increases, moves decrease (harder)
  return Math.floor(max - (max - min) * progress);
};

/**
 * Validates that grid has enough crystals for the goal
 */
const validateGridForGoal = (grid, goal, availableColors) => {
  const colorCounts = countColors(grid);

  switch (goal.type) {
    case 'clear_color': {
      const count = colorCounts[goal.color] || 0;
      // Ensure at least goal amount + 10 for solvability
      return count >= goal.amount + 10;
    }

    case 'clear_dual': {
      return goal.targets.every(target => {
        const count = colorCounts[target.color] || 0;
        return count >= target.amount + 10;
      });
    }

    case 'make_matches': {
      // For match goals, just ensure we have a decent distribution
      const totalCells = grid.length * grid.length;
      const uniqueColors = Object.keys(colorCounts).length;
      return uniqueColors >= availableColors.length;
    }

    default:
      return true;
  }
};

/**
 * Main function to generate a complete level
 */
export const generateLevel = (levelNumber) => {
  const { tier, config } = getTierForLevel(levelNumber);
  const availableColors = getColorsForTier(tier);

  // Handle variable grid size for tier 4
  let gridSize = config.gridSize;
  if (Array.isArray(gridSize)) {
    gridSize = gridSize[Math.floor(Math.random() * gridSize.length)];
  }

  // Generate goal
  const goal = generateGoal(tier, config, levelNumber, availableColors);

  // Generate grid with validation
  let grid;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    grid = generateGrid(gridSize, availableColors);
    attempts++;
  } while (!validateGridForGoal(grid, goal, availableColors) && attempts < maxAttempts);

  // Calculate move limit
  const moveLimit = calculateMoveLimit(tier, config, levelNumber);

  return {
    levelNumber,
    tier,
    grid,
    goal,
    moveLimit,
    availableColors,
  };
};
