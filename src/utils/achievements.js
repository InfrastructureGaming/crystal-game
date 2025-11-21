// Achievement definitions
export const ACHIEVEMENTS = {
  FIRST_WIN: {
    id: 'first_win',
    title: 'First Victory!',
    description: 'Complete your first level',
    icon: '🎉',
    check: (stats) => stats.totalCompleted >= 1,
  },
  LEVEL_5: {
    id: 'level_5',
    title: 'Rising Star',
    description: 'Reach Level 5',
    icon: '⭐',
    check: (stats) => stats.currentLevel >= 5,
  },
  LEVEL_10: {
    id: 'level_10',
    title: 'Expert Aligner',
    description: 'Reach Level 10',
    icon: '🌟',
    check: (stats) => stats.currentLevel >= 10,
  },
  LEVEL_20: {
    id: 'level_20',
    title: 'Master Aligner',
    description: 'Reach Level 20',
    icon: '💫',
    check: (stats) => stats.currentLevel >= 20,
  },
  COMBO_KING: {
    id: 'combo_king',
    title: 'Combo King',
    description: 'Create a 5x cascade',
    icon: '👑',
    check: (stats) => stats.maxCascade >= 5,
  },
  PERFECTIONIST: {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Complete a level in under 10 moves',
    icon: '💎',
    check: (stats) => stats.bestMoves > 0 && stats.bestMoves <= 10,
  },
  MARATHON: {
    id: 'marathon',
    title: 'Marathon Player',
    description: 'Complete 50 levels total',
    icon: '🏃',
    check: (stats) => stats.totalCompleted >= 50,
  },
  MEGA_MATCH: {
    id: 'mega_match',
    title: 'Mega Matcher',
    description: 'Match 6 or more crystals at once',
    icon: '💥',
    check: (stats) => stats.maxMatch >= 6,
  },
  CASCADE_MASTER: {
    id: 'cascade_master',
    title: 'Cascade Master',
    description: 'Create a 7x cascade',
    icon: '🔥',
    check: (stats) => stats.maxCascade >= 7,
  },
  EFFICIENT: {
    id: 'efficient',
    title: 'Efficiency Expert',
    description: 'Complete a level in under 5 moves',
    icon: '⚡',
    check: (stats) => stats.bestMoves > 0 && stats.bestMoves <= 5,
  },
};

// Get stats from localStorage
export const getStats = () => {
  try {
    const stats = localStorage.getItem('gameStats');
    if (stats) {
      return JSON.parse(stats);
    }
  } catch (error) {
    console.error('Error loading stats:', error);
  }

  return {
    totalCompleted: 0,
    currentLevel: 1,
    maxCascade: 0,
    maxMatch: 0,
    bestMoves: 999,
  };
};

// Save stats to localStorage
export const saveStats = (stats) => {
  try {
    localStorage.setItem('gameStats', JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving stats:', error);
  }
};

// Get unlocked achievements from localStorage
export const getUnlockedAchievements = () => {
  try {
    const unlocked = localStorage.getItem('unlockedAchievements');
    if (unlocked) {
      return JSON.parse(unlocked);
    }
  } catch (error) {
    console.error('Error loading achievements:', error);
  }
  return [];
};

// Save unlocked achievements to localStorage
export const saveUnlockedAchievements = (unlocked) => {
  try {
    localStorage.setItem('unlockedAchievements', JSON.stringify(unlocked));
  } catch (error) {
    console.error('Error saving achievements:', error);
  }
};

// Check for newly unlocked achievements
export const checkAchievements = (stats) => {
  const unlocked = getUnlockedAchievements();
  const newlyUnlocked = [];

  Object.values(ACHIEVEMENTS).forEach((achievement) => {
    if (!unlocked.includes(achievement.id) && achievement.check(stats)) {
      newlyUnlocked.push(achievement);
      unlocked.push(achievement.id);
    }
  });

  if (newlyUnlocked.length > 0) {
    saveUnlockedAchievements(unlocked);
  }

  return newlyUnlocked;
};

// Update stats and check for achievements
export const updateStats = (updates) => {
  const stats = getStats();
  const newStats = { ...stats, ...updates };

  // Track maximums
  if (updates.cascade !== undefined) {
    newStats.maxCascade = Math.max(stats.maxCascade || 0, updates.cascade);
  }
  if (updates.matchSize !== undefined) {
    newStats.maxMatch = Math.max(stats.maxMatch || 0, updates.matchSize);
  }
  if (updates.moves !== undefined) {
    newStats.bestMoves = Math.min(stats.bestMoves || 999, updates.moves);
  }

  saveStats(newStats);
  return checkAchievements(newStats);
};
