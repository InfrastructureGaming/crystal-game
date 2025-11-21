import { useState, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import Header from './components/Header';
import LevelGoal from './components/LevelGoal';
import Grid from './components/Grid';
import LevelComplete from './components/LevelComplete';
import ComboDisplay from './components/ComboDisplay';
import WelcomeBack from './components/WelcomeBack';
import Particles from './components/Particles';
import Confetti from './components/Confetti';
import { getCurrentLevel, isStorageAvailable, clearGameData } from './utils/storage';

function App() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [savedLevel, setSavedLevel] = useState(null);
  const [startLevel, setStartLevel] = useState(null);

  // Check for saved progress on mount
  useEffect(() => {
    if (isStorageAvailable()) {
      const saved = getCurrentLevel();
      if (saved > 1) {
        setSavedLevel(saved);
        setShowWelcome(true);
      } else {
        setStartLevel(1);
      }
    } else {
      setStartLevel(1);
    }
  }, []);

  const handleContinue = () => {
    setStartLevel(savedLevel);
    setShowWelcome(false);
  };

  const handleStartNew = () => {
    if (isStorageAvailable()) {
      clearGameData();
    }
    setStartLevel(1);
    setShowWelcome(false);
  };

  const {
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
    invalidSwap,
    matchingCells,
    newCells,
    currentCombo,
    lastCascadeCount,
    hintCells,
    hintsRemaining,
    showHint,
  } = useGameState(startLevel);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <Header level={level} moveCount={moveCount} />

        {/* Main Game Area */}
        <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
          {/* Goal Display */}
          <div className="w-full lg:w-80">
            <LevelGoal level={level} progress={progress} />
          </div>

          {/* Grid */}
          <div className="flex-1 flex justify-center">
            <Grid
              grid={grid}
              selectedCell={selectedCell}
              onCellClick={handleCellClick}
              isProcessing={isProcessing}
              invalidSwap={invalidSwap}
              matchingCells={matchingCells}
              newCells={newCells}
              hintCells={hintCells}
            />
          </div>
        </div>

        {/* Hint Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={showHint}
            disabled={hintsRemaining === 0 || isProcessing}
            className={`
              px-6 py-3 rounded-xl font-semibold text-white
              bg-gradient-to-r from-yellow-500 to-amber-500
              hover:from-yellow-400 hover:to-amber-400
              active:scale-95 transition-all duration-200
              shadow-lg hover:shadow-xl
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center gap-2
            `}
          >
            <span>💡</span>
            <span>Hint ({hintsRemaining} left)</span>
          </button>
        </div>

        {/* Footer */}
        <footer className="text-center mt-6 text-purple-200 text-sm">
          Click adjacent crystals to swap them and make matches of 3 or more!
        </footer>
      </div>

      {/* Particles */}
      <Particles matches={matchingCells} colors={grid} />

      {/* Combo Display */}
      <ComboDisplay
        comboCount={currentCombo}
        cascadeCount={lastCascadeCount}
      />

      {/* Confetti */}
      <Confetti trigger={isLevelComplete} />

      {/* Welcome Back Modal */}
      {showWelcome && savedLevel && (
        <WelcomeBack
          currentLevel={savedLevel}
          onContinue={handleContinue}
          onStartNew={handleStartNew}
        />
      )}

      {/* Level Complete Modal */}
      {isLevelComplete && (
        <LevelComplete
          level={level}
          moveCount={moveCount}
          onNextLevel={nextLevel}
          onRestart={restartLevel}
        />
      )}
    </div>
  );
}

export default App;
