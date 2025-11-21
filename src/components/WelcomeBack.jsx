import { useState, useEffect } from 'react';

const WelcomeBack = ({ currentLevel, onContinue, onStartNew }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show welcome message after a brief delay
    const timer = setTimeout(() => {
      setShow(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`
        bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-2xl max-w-md w-full p-8
        transform transition-all duration-300
        ${show ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}
      `}>
        {/* Welcome Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-400 rounded-full mb-4 shadow-lg">
            <span className="text-5xl">👋</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">
            Welcome Back!
          </h2>
          <p className="text-purple-100 text-lg">
            Ready to continue your crystal journey?
          </p>
        </div>

        {/* Progress Info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center text-white">
            <span className="font-semibold">Your Progress:</span>
            <span className="text-2xl font-bold">Level {currentLevel}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={onContinue}
            className="w-full bg-white text-indigo-600 font-bold py-4 px-6 rounded-xl
                     hover:bg-indigo-50 active:scale-95 transition-all duration-200
                     shadow-lg hover:shadow-xl"
          >
            Continue from Level {currentLevel}
          </button>

          <button
            onClick={onStartNew}
            className="w-full bg-white/10 text-white font-semibold py-3 px-6 rounded-xl
                     hover:bg-white/20 active:scale-95 transition-all duration-200
                     backdrop-blur-sm border border-white/20"
          >
            Start from Level 1
          </button>
        </div>

        {/* Tip */}
        <p className="text-center text-purple-200 text-sm mt-4">
          💡 Your progress is automatically saved!
        </p>
      </div>
    </div>
  );
};

export default WelcomeBack;
