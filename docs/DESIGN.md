# Crystal Aligner - Design Document

## Project Overview

A web-based puzzle game featuring match-3 mechanics with procedurally generated levels. Players swap adjacent crystals to create matches and complete objectives. Built for mobile-first experience with progressive difficulty scaling.

## Tech Stack

- **Framework:** React with Vite
- **Styling:** Tailwind CSS
- **State Management:** React hooks (useState/useReducer)
- **Deployment Target:** Static hosting (Netlify/Vercel/GitHub Pages)

## Core Gameplay

### Grid & Crystals
- Default grid size: 6x6 (scales with difficulty tiers)
- Crystals represented as simple geometric shapes (circles recommended)
- Starting color palette: 4 colors (red, blue, green, yellow)
- Additional colors introduced in higher tiers

### Match Mechanics
- Player taps/clicks two adjacent crystals to swap them (horizontal or vertical only)
- Matches occur when 3+ crystals of same color align in row or column
- Matched crystals disappear with simple animation
- Remaining crystals fall down to fill gaps
- New crystals generate from top to fill empty spaces
- Cascade matches (matches created by falling crystals) should be detected and processed

### Win Conditions
- Each level has a specific goal to complete
- Level completes when goal is achieved
- "Level Complete" modal appears with "Next Level" button
- No failure state in MVP (unlimited moves initially, added in later tiers)

## Procedural Level Generation

### Tier System

**Tier 1: Beginner (Levels 1-10)**
- Grid: 6x6
- Colors: 4 (red, blue, green, yellow)
- Goal type: "Clear X crystals of [color]"
- Target range: 15-25 crystals
- Move limit: None (unlimited)

**Tier 2: Intermediate (Levels 11-25)**
- Grid: 7x7
- Colors: 5 (add purple)
- Goal types: 
  - "Clear X crystals of [color]" (30-40 crystals)
  - "Make X matches" (8-12 matches)
- Move limit: 35-45 moves

**Tier 3: Advanced (Levels 26-50)**
- Grid: 8x8
- Colors: 6 (add orange)
- Goal types:
  - Previous goal types with higher targets
  - "Clear X of [color A] AND Y of [color B]" (dual objectives)
- Target ranges: 40-60 crystals OR 12-18 matches
- Move limit: 28-35 moves

**Tier 4: Expert (Levels 51+)**
- Grid: 7x7 or 8x8 (varies)
- Colors: 5-6 (can restrict colors for extra difficulty)
- All previous goal types with maximum difficulty
- Move limit: 22-28 moves
- Can introduce special pattern goals (future enhancement)

### Level Generation Algorithm

**Requirements:**
1. **No instant matches** - Generated grid must not contain any existing matches of 3+
2. **Color distribution** - Each color should appear roughly equally in starting grid
3. **Solvability guarantee** - If goal requires X crystals of a color, ensure at least X+10 of that color exist in starting grid
4. **Goal variety** - Rotate through available goal types within each tier to prevent repetition
5. **Smooth scaling** - Within each tier, difficulty should gradually increase from first to last level

**Generation Steps:**
```
1. Determine tier based on level number
2. Select goal type from available types for that tier
3. Calculate target values based on position within tier
4. Generate grid with appropriate size and color count
5. Validate grid has no instant matches
6. Verify grid contains sufficient crystals for goal completion
7. Assign move limit if applicable
```

### Goal Type Definitions

```javascript
{
  type: "clear_color",
  color: "blue",
  amount: 20
}

{
  type: "make_matches",
  amount: 10
}

{
  type: "clear_dual",
  targets: [
    { color: "red", amount: 15 },
    { color: "green", amount: 15 }
  ]
}
```

## User Interface

### Main Game Screen
- **Header**: Current level number, goal description, move counter (if applicable)
- **Game Grid**: Centered, responsive, touch-friendly
- **Goal Display**: Clear visual indicator of progress toward goal
- **Color Legend**: (Optional) Shows available colors for current level

### Level Complete Modal
- Victory message
- Stats display (moves used, etc.)
- "Next Level" button (primary action)
- "Replay Level" button (secondary, optional)

### Mobile Considerations
- Minimum tap target size: 44x44px for crystals
- Portrait orientation primary, landscape acceptable
- Responsive grid scaling
- Touch gestures feel natural (no accidental swaps)
- No hover states required

## Visual Design

### Color Palette
Keep it vibrant and accessible:
- Red: `#EF4444` (Tailwind red-500)
- Blue: `#3B82F6` (Tailwind blue-500)
- Green: `#10B981` (Tailwind green-500)
- Yellow: `#F59E0B` (Tailwind yellow-500)
- Purple: `#A855F7` (Tailwind purple-500)
- Orange: `#F97316` (Tailwind orange-500)

### Animations (Keep Simple for MVP)
- Crystal swap: 200ms ease transition
- Match clear: 300ms fade out
- Crystal fall: 150ms per row
- New crystal appearance: 200ms fade in

### Typography
- Headers: Bold, sans-serif
- Body text: Regular weight
- Goal text: Slightly larger, emphasized

## Development Phases

### Phase 1: MVP (Current Target)
- ✅ Core match-3 mechanics
- ✅ Procedural level generation
- ✅ Basic goal types (clear color, make matches)
- ✅ Tier 1-2 difficulty
- ✅ Level progression
- ✅ Mobile-responsive design

### Phase 2: Polish & Extend (IN PROGRESS)
- ✅ Move counter display
- ✅ Tier 1-2 implementation
- 🎯 Enhanced animations and visual effects
- 🎯 Combo/cascade counter system
- 🎯 LocalStorage for progress saving
- Sound effects (optional, future)

### Phase 3: Advanced Features (PLANNED)
- Pattern-based goals (L-shapes, squares, etc.)
- Special crystals (bombs, wildcards)
- Level select screen
- Statistics tracking
- Hint system
- Achievement notifications

### Phase 4: Deployment
- Build optimization
- Deploy to hosting platform
- Custom domain setup
- Basic analytics

## File Structure Recommendation

```
crystal-aligner/
├── src/
│   ├── components/
│   │   ├── Grid.jsx
│   │   ├── Crystal.jsx
│   │   ├── LevelGoal.jsx
│   │   ├── LevelComplete.jsx
│   │   └── Header.jsx
│   ├── utils/
│   │   ├── levelGenerator.js
│   │   ├── matchDetector.js
│   │   └── gridHelpers.js
│   ├── constants/
│   │   ├── tiers.js
│   │   └── colors.js
│   ├── hooks/
│   │   └── useGameState.js (optional)
│   ├── App.jsx
│   └── main.jsx
├── public/
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Testing Considerations

- Test grid generation doesn't create instant matches
- Verify goal completion detection works correctly
- Test cascade matching (matches after crystals fall)
- Ensure mobile touch targets are appropriately sized
- Test across different screen sizes
- Validate level difficulty progression feels fair

## Delight Features (Post-MVP Enhancements)

### Section 1: Better Animations ✨
**High Impact - Quick Wins**
- Smooth crystal disappear effects with scale/fade
- Staggered falling animations for natural physics
- Invalid swap "shake" animation with bounce-back
- Pulse effect on matched crystals before removal
- Smooth swap transitions with arc motion
- Crystal appearance with pop-in effect

**Technical Approach:**
- CSS transitions and keyframe animations
- React spring physics (optional)
- Staggered delays for cascade timing
- Transform-based animations for performance

### Section 2: Combo/Cascade Counter 🎯
**High Impact - Engagement**
- Display "2x COMBO!" "3x COMBO!" text on cascades
- Floating text animations that fade up and out
- Progressive color intensity (yellow → orange → red for high combos)
- Celebration effects for 5+ combos
- Combo multiplier display during active cascades
- Reset with smooth fade when combo ends

**Technical Approach:**
- Track cascade count during processCascades
- Animated div components for floating text
- CSS animations for movement and fade
- Conditional rendering based on combo level

### Section 3: Particle Effects 💫
**Medium Impact - Visual Polish**
- Sparkle particles when crystals match
- Color-matched particles (same as crystal color)
- Confetti burst on level complete
- Subtle glow/shimmer on selected crystals
- Trail effects during swaps
- Star burst for perfect matches

**Technical Approach:**
- Simple div-based particles with absolute positioning
- CSS animations for movement patterns
- Random generation for natural feel
- Auto-cleanup after animation completes

### Section 4: Progress Saving 💾
**High Impact - Retention**
- Save current level to localStorage
- Save best scores per level
- Auto-save after each level completion
- "Welcome back! Resume Level X?" on load
- Clear save data option in settings
- Track total levels completed

**Technical Approach:**
- localStorage API for persistence
- JSON serialization of game state
- Load on mount, save on level changes
- Graceful fallback if localStorage unavailable

### Section 5: Hint System 💡
**Medium Impact - Accessibility**
- "Hint" button to highlight valid move
- Gentle pulse animation on hinted crystals
- Limited hints per level (3-5)
- Hint counter display
- Disable during processing
- Smart hint selection (prioritize high-value moves)

**Technical Approach:**
- Use hasValidMoves logic to find moves
- Add hint state to game state
- Visual indicator on suggested crystals
- Timeout to clear hint after 3 seconds

### Section 6: Visual Polish 🎨
**Medium Impact - UX**
- "No valid moves - shuffling!" notification
- Match preview highlighting before removal
- Score counter with increment animations
- Level intro animation
- Smooth transitions between states
- Loading skeleton screens

### Section 7: Achievement Notifications 🏆
**Low Impact - Delight**
- Toast notifications for achievements
- "Perfect! Under move limit!"
- "Cascade Master! 5+ chains!"
- "Color Expert! All [color] cleared!"
- Slide-in from top with auto-dismiss
- Sound effects (optional)

**Technical Approach:**
- Toast component with queue system
- Achievement detection in game logic
- Slide/fade animations
- Auto-dismiss timer (3-4 seconds)

---

## Implementation Priority

**Phase 2A (Current):**
1. ✅ Better Animations (Section 1)
2. ✅ Combo/Cascade Counter (Section 2)
3. ✅ Progress Saving (Section 4)

**Phase 2B (Next):**
4. Particle Effects (Section 3)
5. Hint System (Section 5)
6. Visual Polish (Section 6)
7. Achievement Notifications (Section 7)

**Future Considerations:**
- Undo move functionality
- Daily challenges
- Leaderboards
- Theming options
- Sound effects and music
- Accessibility features (color blind modes, screen reader support)

---

## Success Criteria for MVP

The MVP is complete when:
1. Player can complete 10+ procedurally generated levels
2. Match mechanics work reliably including cascades
3. Level goals are clearly communicated and tracked
4. Game is playable on mobile devices
5. Difficulty progression feels appropriate
6. No game-breaking bugs

---

*This design document is intended as a guide for implementation. Feel free to iterate and improve upon these specifications as development progresses.*
