import { useEffect, useState } from 'react';

const AchievementNotification = ({ achievement }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (achievement) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [achievement]);

  if (!show || !achievement) return null;

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-3xl blur-2xl opacity-60 animate-pulse-glow" />

        {/* Main card */}
        <div className="relative bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 border-4 border-yellow-400 rounded-3xl p-8 shadow-2xl animate-achievement-popup min-w-[400px]">
          {/* Achievement unlocked label */}
          <div className="text-center mb-4">
            <p className="text-yellow-300 font-bold text-sm tracking-widest uppercase">
              Achievement Unlocked!
            </p>
          </div>

          {/* Icon */}
          <div className="text-center mb-4">
            <div className="text-8xl animate-bounce-in inline-block">
              {achievement.icon}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-white text-center mb-2 drop-shadow-lg">
            {achievement.title}
          </h2>

          {/* Description */}
          <p className="text-purple-200 text-center text-lg">
            {achievement.description}
          </p>

          {/* Decorative stars */}
          <div className="absolute -top-4 -left-4 text-4xl animate-spin-slow">✨</div>
          <div className="absolute -top-4 -right-4 text-4xl animate-spin-slow-reverse">✨</div>
          <div className="absolute -bottom-4 -left-4 text-4xl animate-spin-slow-reverse">⭐</div>
          <div className="absolute -bottom-4 -right-4 text-4xl animate-spin-slow">⭐</div>
        </div>
      </div>
    </div>
  );
};

export default AchievementNotification;
