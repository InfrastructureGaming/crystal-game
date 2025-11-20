import { useGameState } from './hooks/useGameState';
import Header from './components/Header';
import LevelGoal from './components/LevelGoal';
import Grid from './components/Grid';
import LevelComplete from './components/LevelComplete';
import ComboDisplay from './components/ComboDisplay';

function App() {
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
  } = useGameState(1);

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
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 text-purple-200 text-sm">
          Click adjacent crystals to swap them and make matches of 3 or more!
        </footer>
      </div>

      {/* Combo Display */}
      <ComboDisplay
        comboCount={currentCombo}
        cascadeCount={lastCascadeCount}
      />

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
