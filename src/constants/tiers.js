// Tier configurations based on design document
export const TIERS = {
  1: {
    name: 'Beginner',
    levels: [1, 10],
    gridSize: 6,
    colorCount: 4,
    goalTypes: ['clear_color'],
    moveLimit: null, // unlimited
    targetRanges: {
      clear_color: [15, 25],
    },
  },
  2: {
    name: 'Intermediate',
    levels: [11, 25],
    gridSize: 7,
    colorCount: 5,
    goalTypes: ['clear_color', 'make_matches'],
    moveLimit: [35, 45],
    targetRanges: {
      clear_color: [30, 40],
      make_matches: [8, 12],
    },
  },
  3: {
    name: 'Advanced',
    levels: [26, 50],
    gridSize: 8,
    colorCount: 6,
    goalTypes: ['clear_color', 'make_matches', 'clear_dual'],
    moveLimit: [28, 35],
    targetRanges: {
      clear_color: [40, 60],
      make_matches: [12, 18],
      clear_dual: [25, 35], // per color
    },
  },
  4: {
    name: 'Expert',
    levels: [51, 999],
    gridSize: [7, 8], // varies
    colorCount: [5, 6], // varies
    goalTypes: ['clear_color', 'make_matches', 'clear_dual'],
    moveLimit: [22, 28],
    targetRanges: {
      clear_color: [50, 70],
      make_matches: [15, 22],
      clear_dual: [30, 40], // per color
    },
  },
};

// Helper function to get tier for a given level number
export const getTierForLevel = (levelNumber) => {
  for (const [tier, config] of Object.entries(TIERS)) {
    const [min, max] = config.levels;
    if (levelNumber >= min && levelNumber <= max) {
      return { tier: parseInt(tier), config };
    }
  }
  // Default to tier 4 for any level beyond 50
  return { tier: 4, config: TIERS[4] };
};

// Helper to get position within tier (0-1 range)
export const getProgressInTier = (levelNumber, tier, config) => {
  const [min, max] = config.levels;
  return (levelNumber - min) / (max - min);
};
