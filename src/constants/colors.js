// Crystal color definitions matching Tailwind palette
export const COLORS = {
  red: '#EF4444',      // Tailwind red-500
  blue: '#3B82F6',     // Tailwind blue-500
  green: '#10B981',    // Tailwind green-500
  yellow: '#F59E0B',   // Tailwind yellow-500
  purple: '#A855F7',   // Tailwind purple-500
  orange: '#F97316',   // Tailwind orange-500
};

// Color names for easy iteration
export const COLOR_NAMES = Object.keys(COLORS);

// Helper function to get colors for a specific tier
export const getColorsForTier = (tier) => {
  const colorCounts = {
    1: 4, // red, blue, green, yellow
    2: 5, // + purple
    3: 6, // + orange
    4: 6, // varies, but max 6
  };

  return COLOR_NAMES.slice(0, colorCounts[tier] || 4);
};
