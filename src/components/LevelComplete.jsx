const LevelComplete = ({ level, moveCount, onNextLevel, onRestart }) => {
  if (!level) return null;

  const { levelNumber, moveLimit } = level;

  // Check if player beat the move limit (if there is one)
  const beatMoveLimit = moveLimit ? moveCount <= moveLimit : true;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-2xl max-w-md w-full p-8 transform animate-scale-in">
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-400 rounded-full mb-4 shadow-lg">
            <span className="text-4xl">⭐</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">
            Level Complete!
          </h2>
          <p className="text-purple-100 text-lg">
            You cleared Level {levelNumber}
          </p>
        </div>

        {/* Stats */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 space-y-2">
          <div className="flex justify-between items-center text-white">
            <span className="font-semibold">Moves Used:</span>
            <span className="text-xl font-bold">{moveCount}</span>
          </div>

          {moveLimit !== null && (
            <div className="flex justify-between items-center text-white">
              <span className="font-semibold">Move Limit:</span>
              <span className={`text-xl font-bold ${
                beatMoveLimit ? 'text-green-300' : 'text-yellow-300'
              }`}>
                {moveLimit}
              </span>
            </div>
          )}

          {moveLimit !== null && (
            <div className="pt-2 border-t border-white/20">
              <p className={`text-center font-semibold ${
                beatMoveLimit ? 'text-green-300' : 'text-yellow-300'
              }`}>
                {beatMoveLimit ? '🎉 Beat the move limit!' : '✓ Goal completed!'}
              </p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={onNextLevel}
            className="w-full bg-white text-purple-600 font-bold py-4 px-6 rounded-xl
                     hover:bg-purple-50 active:scale-95 transition-all duration-200
                     shadow-lg hover:shadow-xl"
          >
            Next Level →
          </button>

          <button
            onClick={onRestart}
            className="w-full bg-white/10 text-white font-semibold py-3 px-6 rounded-xl
                     hover:bg-white/20 active:scale-95 transition-all duration-200
                     backdrop-blur-sm border border-white/20"
          >
            Replay Level
          </button>
        </div>
      </div>
    </div>
  );
};

export default LevelComplete;
