import { useState, useEffect } from 'react';

const Header = ({ level, moveCount }) => {
  const [prevMoveCount, setPrevMoveCount] = useState(0);
  const [animateMoves, setAnimateMoves] = useState(false);

  useEffect(() => {
    if (moveCount > prevMoveCount) {
      setAnimateMoves(true);
      setTimeout(() => setAnimateMoves(false), 300);
    }
    setPrevMoveCount(moveCount);
  }, [moveCount, prevMoveCount]);

  if (!level) return null;

  const { levelNumber, tier, moveLimit } = level;

  return (
    <header className="text-center mb-6">
      <h1 className="text-5xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">
        Crystal Aligner
      </h1>

      <div className="flex items-center justify-center gap-4 text-white/90">
        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
          <p className="text-sm font-semibold text-purple-200">Level</p>
          <p className="text-2xl font-bold">{levelNumber}</p>
        </div>

        {moveLimit !== null && (
          <div className={`bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg transition-all ${animateMoves ? 'scale-110 bg-white/20' : ''}`}>
            <p className="text-sm font-semibold text-purple-200">Moves</p>
            <p className={`text-2xl font-bold transition-all ${
              moveCount > moveLimit ? 'text-red-400 animate-pulse' : 'text-white'
            } ${animateMoves ? 'scale-125' : ''}`}>
              {moveCount} / {moveLimit}
            </p>
          </div>
        )}

        {moveLimit === null && (
          <div className={`bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg transition-all ${animateMoves ? 'scale-110 bg-white/20' : ''}`}>
            <p className="text-sm font-semibold text-purple-200">Moves</p>
            <p className={`text-2xl font-bold transition-all ${animateMoves ? 'scale-125' : ''}`}>{moveCount}</p>
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
          <p className="text-sm font-semibold text-purple-200">Tier</p>
          <p className="text-2xl font-bold">{tier}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
