import { useEffect, useState } from 'react';

const Confetti = ({ trigger }) => {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (trigger) {
      // Create 50 confetti pieces
      const pieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 200,
        duration: 2000 + Math.random() * 1000,
        color: [
          '#EF4444', // red
          '#3B82F6', // blue
          '#10B981', // green
          '#F59E0B', // yellow
          '#A855F7', // purple
          '#F97316', // orange
        ][Math.floor(Math.random() * 6)],
      }));

      setConfetti(pieces);

      // Clean up after animation
      const timer = setTimeout(() => {
        setConfetti([]);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [trigger]);

  if (confetti.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            backgroundColor: piece.color,
            left: `${piece.left}%`,
            top: '-10px',
            animation: `confetti-fall ${piece.duration}ms ease-in forwards`,
            animationDelay: `${piece.delay}ms`,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
