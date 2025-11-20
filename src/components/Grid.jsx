import Crystal from './Crystal';

const Grid = ({
  grid,
  selectedCell,
  onCellClick,
  isProcessing,
  invalidSwap,
  matchingCells,
  newCells
}) => {
  if (!grid || grid.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  const gridSize = grid.length;

  // Calculate cell size based on grid size for responsive design
  // Smaller grids = bigger cells, larger grids = smaller cells
  const getCellSize = () => {
    if (gridSize <= 6) return 'w-16 h-16 md:w-20 md:h-20';
    if (gridSize === 7) return 'w-14 h-14 md:w-16 md:h-16';
    return 'w-12 h-12 md:w-14 md:h-14';
  };

  const cellSize = getCellSize();

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-4">
      <div
        className="inline-grid gap-2 bg-white/5 p-4 rounded-2xl backdrop-blur-sm"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((color, colIndex) => {
            const isSelected =
              selectedCell?.row === rowIndex && selectedCell?.col === colIndex;

            // Check if this cell is matching
            const isMatching = matchingCells?.some(
              cell => cell.row === rowIndex && cell.col === colIndex
            );

            // Check if this cell is new
            const isNew = newCells?.some(
              cell => cell.row === rowIndex && cell.col === colIndex
            );

            // Check if this cell should shake
            const shouldShake = invalidSwap && (
              (invalidSwap.pos1.row === rowIndex && invalidSwap.pos1.col === colIndex) ||
              (invalidSwap.pos2.row === rowIndex && invalidSwap.pos2.col === colIndex)
            );

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={cellSize}
              >
                <Crystal
                  color={color}
                  isSelected={isSelected}
                  onClick={() => onCellClick(rowIndex, colIndex)}
                  isProcessing={isProcessing}
                  isMatching={isMatching}
                  isNew={isNew}
                  shouldShake={shouldShake}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Grid;
