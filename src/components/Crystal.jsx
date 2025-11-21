import { COLORS } from '../constants/colors';

const Crystal = ({
  color,
  isSelected,
  onClick,
  isProcessing,
  isMatching,
  isNew,
  shouldShake,
  isHint
}) => {
  const bgColor = COLORS[color] || '#666';

  return (
    <button
      onClick={onClick}
      disabled={isProcessing}
      className={`
        w-full h-full rounded-full
        transition-all duration-200 ease-out
        ${isSelected ? 'scale-110 ring-4 ring-white ring-opacity-80' : 'scale-100'}
        ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
        ${isMatching ? 'animate-pulse-match' : ''}
        ${isNew ? 'animate-pop-in' : ''}
        ${shouldShake ? 'animate-shake' : ''}
        ${isHint ? 'ring-4 ring-yellow-400 ring-opacity-100 animate-pulse' : ''}
        shadow-lg hover:shadow-xl
        active:scale-95
      `}
      style={{
        backgroundColor: bgColor,
      }}
      aria-label={`${color} crystal`}
    >
      {/* Inner highlight for depth */}
      <div
        className="w-full h-full rounded-full flex items-center justify-center"
        style={{
          background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 50%)`,
        }}
      />
    </button>
  );
};

export default Crystal;
