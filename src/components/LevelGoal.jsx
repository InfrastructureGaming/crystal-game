import { COLORS } from '../constants/colors';

const LevelGoal = ({ level, progress }) => {
  if (!level || !level.goal) return null;

  const { goal } = level;

  const renderColorDot = (color) => (
    <div
      className="w-6 h-6 rounded-full inline-block shadow-md"
      style={{ backgroundColor: COLORS[color] }}
    />
  );

  const renderProgress = () => {
    switch (goal.type) {
      case 'clear_color': {
        const current = progress[goal.color] || 0;
        const percentage = Math.min((current / goal.amount) * 100, 100);

        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {renderColorDot(goal.color)}
                <span className="text-white font-semibold capitalize">
                  {goal.color} crystals
                </span>
              </div>
              <span className="text-white font-bold text-lg">
                {current} / {goal.amount}
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-300 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      }

      case 'make_matches': {
        const current = progress.matches || 0;
        const percentage = Math.min((current / goal.amount) * 100, 100);

        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">Make matches</span>
              <span className="text-white font-bold text-lg">
                {current} / {goal.amount}
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      }

      case 'clear_dual': {
        return (
          <div className="space-y-3">
            {goal.targets.map((target, index) => {
              const current = progress[target.color] || 0;
              const percentage = Math.min((current / target.amount) * 100, 100);

              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {renderColorDot(target.color)}
                      <span className="text-white font-semibold capitalize">
                        {target.color}
                      </span>
                    </div>
                    <span className="text-white font-bold">
                      {current} / {target.amount}
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-400 to-purple-500 transition-all duration-300 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
      <h2 className="text-lg font-bold text-white mb-3">Goal</h2>
      {renderProgress()}
    </div>
  );
};

export default LevelGoal;
