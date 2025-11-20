const Header = ({ level, moveCount }) => {
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
          <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
            <p className="text-sm font-semibold text-purple-200">Moves</p>
            <p className={`text-2xl font-bold ${
              moveCount > moveLimit ? 'text-red-400' : 'text-white'
            }`}>
              {moveCount} / {moveLimit}
            </p>
          </div>
        )}

        {moveLimit === null && (
          <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
            <p className="text-sm font-semibold text-purple-200">Moves</p>
            <p className="text-2xl font-bold">{moveCount}</p>
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
