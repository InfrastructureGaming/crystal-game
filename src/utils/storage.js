// localStorage keys
const STORAGE_KEYS = {
  CURRENT_LEVEL: 'crystalGame_currentLevel',
  HIGH_SCORES: 'crystalGame_highScores',
  TOTAL_COMPLETED: 'crystalGame_totalCompleted',
  SETTINGS: 'crystalGame_settings',
};

/**
 * Safely get item from localStorage with fallback
 */
const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
};

/**
 * Safely set item to localStorage
 */
const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Error writing to localStorage (${key}):`, error);
    return false;
  }
};

/**
 * Remove item from localStorage
 */
const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Error removing from localStorage (${key}):`, error);
    return false;
  }
};

/**
 * Check if localStorage is available
 */
export const isStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
};

// ===== Game Progress Functions =====

/**
 * Get the current level number
 */
export const getCurrentLevel = () => {
  return getItem(STORAGE_KEYS.CURRENT_LEVEL, 1);
};

/**
 * Save the current level number
 */
export const saveCurrentLevel = (levelNumber) => {
  return setItem(STORAGE_KEYS.CURRENT_LEVEL, levelNumber);
};

/**
 * Get high score for a specific level (fewest moves)
 */
export const getLevelHighScore = (levelNumber) => {
  const highScores = getItem(STORAGE_KEYS.HIGH_SCORES, {});
  return highScores[levelNumber] || null;
};

/**
 * Save high score for a level if it's better than existing
 */
export const saveLevelHighScore = (levelNumber, moves) => {
  const highScores = getItem(STORAGE_KEYS.HIGH_SCORES, {});
  const currentBest = highScores[levelNumber];

  // Only save if it's a new record (fewer moves) or first time
  if (!currentBest || moves < currentBest) {
    highScores[levelNumber] = moves;
    setItem(STORAGE_KEYS.HIGH_SCORES, highScores);
    return true; // New record!
  }

  return false; // Not a record
};

/**
 * Get total levels completed
 */
export const getTotalCompleted = () => {
  return getItem(STORAGE_KEYS.TOTAL_COMPLETED, 0);
};

/**
 * Increment total levels completed
 */
export const incrementTotalCompleted = () => {
  const current = getTotalCompleted();
  setItem(STORAGE_KEYS.TOTAL_COMPLETED, current + 1);
};

/**
 * Get game statistics
 */
export const getGameStats = () => {
  const currentLevel = getCurrentLevel();
  const totalCompleted = getTotalCompleted();
  const highScores = getItem(STORAGE_KEYS.HIGH_SCORES, {});
  const highScoreCount = Object.keys(highScores).length;

  return {
    currentLevel,
    totalCompleted,
    highScoreCount,
    hasProgress: currentLevel > 1,
  };
};

/**
 * Clear all game data (for reset/new game)
 */
export const clearGameData = () => {
  removeItem(STORAGE_KEYS.CURRENT_LEVEL);
  removeItem(STORAGE_KEYS.HIGH_SCORES);
  removeItem(STORAGE_KEYS.TOTAL_COMPLETED);
  return true;
};

/**
 * Get settings
 */
export const getSettings = () => {
  return getItem(STORAGE_KEYS.SETTINGS, {
    soundEnabled: true,
    musicEnabled: true,
  });
};

/**
 * Save settings
 */
export const saveSettings = (settings) => {
  return setItem(STORAGE_KEYS.SETTINGS, settings);
};

// Export all storage functions
export default {
  isStorageAvailable,
  getCurrentLevel,
  saveCurrentLevel,
  getLevelHighScore,
  saveLevelHighScore,
  getTotalCompleted,
  incrementTotalCompleted,
  getGameStats,
  clearGameData,
  getSettings,
  saveSettings,
};
