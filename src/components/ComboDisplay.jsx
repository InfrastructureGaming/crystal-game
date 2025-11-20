import { useEffect, useState } from 'react';

const ComboDisplay = ({ comboCount, cascadeCount }) => {
  const [showCombo, setShowCombo] = useState(false);
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    if (cascadeCount > 1) {
      setDisplayCount(cascadeCount);
      setShowCombo(true);

      // Hide after animation completes
      const timer = setTimeout(() => {
        setShowCombo(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [cascadeCount, comboCount]);

  if (!showCombo || displayCount < 2) return null;

  // Determine color based on combo level
  const getComboColor = () => {
    if (displayCount >= 5) return 'from-red-500 to-orange-500';
    if (displayCount >= 4) return 'from-orange-500 to-yellow-500';
    if (displayCount >= 3) return 'from-yellow-500 to-amber-500';
    return 'from-green-500 to-emerald-500';
  };

  // Determine text based on combo level
  const getComboText = () => {
    if (displayCount >= 5) return 'AMAZING!';
    if (displayCount >= 4) return 'INCREDIBLE!';
    if (displayCount >= 3) return 'AWESOME!';
    return 'GREAT!';
  };

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-40">
      <div className="animate-float-up">
        <div className={`
          text-center px-8 py-4 rounded-2xl
          bg-gradient-to-r ${getComboColor()}
          shadow-2xl border-4 border-white
          transform
        `}>
          <div className="text-white font-black text-5xl md:text-7xl drop-shadow-lg animate-combo-burst">
            {displayCount}x COMBO!
          </div>
          <div className="text-white font-bold text-2xl md:text-3xl mt-2 drop-shadow-md">
            {getComboText()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComboDisplay;
