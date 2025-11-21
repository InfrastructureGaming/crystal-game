import { useState, useCallback, useEffect } from 'react';
import { generateLevel } from '../utils/levelGenerator';
import { findMatches, getMatchedColors, removeMatches } from '../utils/matchDetector';
import { processCascades, findHint } from '../utils/gravity';
import { swapCells, areAdjacent } from '../utils/gridHelpers';
import {
  getCurrentLevel,
  saveCurrentLevel,
  saveLevelHighScore,
  incrementTotalCompleted,
  isStorageAvailable,
} from '../utils/storage';

export const useGameState = (initialLevel = null) => {
  const [level, setLevel] = useState(null);
  const [grid, setGrid] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [progress, setProgress] = useState({});
  const [isLevelComplete, setIsLevelComplete] = useState(false);

  // Animation states
  const [invalidSwap, setInvalidSwap] = useState(null);
  const [matchingCells, setMatchingCells] = useState([]);
  const [newCells, setNewCells] = useState([]);

  // Combo tracking
  const [currentCombo, setCurrentCombo] = useState(0);
  const [lastCascadeCount, setLastCascadeCount] = useState(0);

  // Hint system
  const [hintCells, setHintCells] = useState(null);
  const [hintsRemaining, setHintsRemaining] = useState(3);

  // Initialize or load a level
  const loadLevel = useCallback((levelNumber) => {
    const newLevel = generateLevel(levelNumber);
    setLevel(newLevel);
    setGrid(newLevel.grid);
    setMoveCount(0);
    setSelectedCell(null);
    setIsLevelComplete(false);

    // Initialize progress tracking based on goal type
    if (newLevel.goal.type === 'clear_color') {
      setProgress({ [newLevel.goal.color]: 0 });
    } else if (newLevel.goal.type === 'clear_dual') {
      const prog = {};
      newLevel.goal.targets.forEach(target => {
        prog[target.color] = 0;
      });
      setProgress(prog);
    } else if (newLevel.goal.type === 'make_matches') {
      setProgress({ matches: 0 });
    }
  }, []);

  // Load initial level on mount (from storage or initialLevel)
  useEffect(() => {
    const levelToLoad = initialLevel !== null
      ? initialLevel
      : (isStorageAvailable() ? getCurrentLevel() : 1);

    loadLevel(levelToLoad);
  }, [initialLevel, loadLevel]);

  // Check if goal is complete
  const checkGoalCompletion = useCallback((currentProgress) => {
    if (!level) return false;

    const { goal } = level;

    switch (goal.type) {
      case 'clear_color':
        return currentProgress[goal.color] >= goal.amount;

      case 'clear_dual':
        return goal.targets.every(
          target => currentProgress[target.color] >= target.amount
        );

      case 'make_matches':
        return currentProgress.matches >= goal.amount;

      default:
        return false;
    }
  }, [level]);

  // Update progress based on cleared crystals
  const updateProgress = useCallback((clearedColors, cascadeCount) => {
    if (!level) return;

    setProgress(prev => {
      const newProgress = { ...prev };

      if (level.goal.type === 'clear_color') {
        const color = level.goal.color;
        newProgress[color] = (newProgress[color] || 0) + (clearedColors[color] || 0);
      } else if (level.goal.type === 'clear_dual') {
        level.goal.targets.forEach(target => {
          newProgress[target.color] =
            (newProgress[target.color] || 0) + (clearedColors[target.color] || 0);
        });
      } else if (level.goal.type === 'make_matches') {
        newProgress.matches = (newProgress.matches || 0) + cascadeCount;
      }

      // Check if goal is complete
      if (checkGoalCompletion(newProgress)) {
        setIsLevelComplete(true);
      }

      return newProgress;
    });
  }, [level, checkGoalCompletion]);

  // Handle cell selection and swapping
  const handleCellClick = useCallback((row, col) => {
    if (isProcessing || isLevelComplete) return;

    // If no cell is selected, select this one
    if (!selectedCell) {
      setSelectedCell({ row, col });
      return;
    }

    // If clicking the same cell, deselect
    if (selectedCell.row === row && selectedCell.col === col) {
      setSelectedCell(null);
      return;
    }

    // If cells are adjacent, attempt swap
    if (areAdjacent(selectedCell, { row, col })) {
      attemptSwap(selectedCell, { row, col });
      setSelectedCell(null);
    } else {
      // Select the new cell
      setSelectedCell({ row, col });
    }
  }, [selectedCell, isProcessing, isLevelComplete]);

  // Attempt to swap two cells
  const attemptSwap = useCallback((pos1, pos2) => {
    if (!level) return;

    setIsProcessing(true);

    // Perform the swap
    const swappedGrid = swapCells(grid, pos1, pos2);

    // Check if the swap creates any matches
    const matches = findMatches(swappedGrid);

    if (matches.length === 0) {
      // Invalid swap - trigger shake animation
      setInvalidSwap({ pos1, pos2 });
      setTimeout(() => {
        setInvalidSwap(null);
        setIsProcessing(false);
      }, 500);
      return;
    }

    // Valid swap - update grid and increment move count
    setGrid(swappedGrid);
    setMoveCount(prev => prev + 1);

    // Show pulse animation on matched crystals
    setMatchingCells(matches);

    // Wait for pulse animation, then remove matches
    setTimeout(() => {
      setMatchingCells([]);

      // Process matches and cascades
      const { grid: finalGrid, cascadeCount, totalCleared } =
        processCascades(swappedGrid, level.availableColors);

      // Update combo tracking
      setLastCascadeCount(cascadeCount);
      setCurrentCombo(prev => prev + 1);

      // Track which cells are new for pop-in animation
      const newCellsPositions = [];
      for (let row = 0; row < finalGrid.length; row++) {
        for (let col = 0; col < finalGrid[row].length; col++) {
          if (swappedGrid[row][col] !== finalGrid[row][col]) {
            newCellsPositions.push({ row, col });
          }
        }
      }
      setNewCells(newCellsPositions);

      setGrid(finalGrid);
      updateProgress(totalCleared, cascadeCount);

      // Clear new cells animation state and reset combo after delay
      setTimeout(() => {
        setNewCells([]);
        setIsProcessing(false);

        // Reset combo after a delay
        setTimeout(() => {
          setLastCascadeCount(0);
        }, 1500);
      }, 400);
    }, 800); // Wait for pulse animation to complete
  }, [grid, level, updateProgress]);

  // Advance to next level
  const nextLevel = useCallback(() => {
    if (!level) return;

    const nextLevelNumber = level.levelNumber + 1;

    // Save progress
    if (isStorageAvailable()) {
      saveCurrentLevel(nextLevelNumber);
      saveLevelHighScore(level.levelNumber, moveCount);
      incrementTotalCompleted();
    }

    loadLevel(nextLevelNumber);
  }, [level, loadLevel, moveCount]);

  // Restart current level
  const restartLevel = useCallback(() => {
    if (!level) return;
    setHintsRemaining(3); // Reset hints
    loadLevel(level.levelNumber);
  }, [level, loadLevel]);

  // Show hint
  const showHint = useCallback(() => {
    if (hintsRemaining <= 0 || isProcessing) return;

    const hint = findHint(grid);
    if (hint) {
      setHintCells(hint);
      setHintsRemaining(prev => prev - 1);

      // Clear hint after 3 seconds
      setTimeout(() => {
        setHintCells(null);
      }, 3000);
    }
  }, [grid, hintsRemaining, isProcessing]);

  return {
    level,
    grid,
    selectedCell,
    isProcessing,
    moveCount,
    progress,
    isLevelComplete,
    handleCellClick,
    nextLevel,
    restartLevel,
    // Animation states
    invalidSwap,
    matchingCells,
    newCells,
    // Combo states
    currentCombo,
    lastCascadeCount,
    // Hint states
    hintCells,
    hintsRemaining,
    showHint,
  };
};
