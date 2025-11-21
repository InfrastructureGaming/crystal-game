import { useEffect, useState, useRef } from 'react';
import { COLORS } from '../constants/colors';

const Particles = ({ matches, grid, gridRef }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (matches && matches.length > 0 && gridRef?.current) {
      const gridRect = gridRef.current.getBoundingClientRect();
      const gridSize = grid.length;

      // Create particles for each matched crystal - GO BIG OR GO HOME!
      const newParticles = matches.flatMap((match) => {
        const color = grid[match.row]?.[match.col];
        if (!color) return [];

        // Calculate the position of this crystal on screen
        // Approximate crystal position within grid
        const cellFraction = 1 / gridSize;
        const crystalX = gridRect.left + gridRect.width * (match.col + 0.5) * cellFraction;
        const crystalY = gridRect.top + gridRect.height * (match.row + 0.5) * cellFraction;

        // Create 20-30 particles per crystal for MAXIMUM IMPACT!
        const particleCount = 20 + Math.floor(Math.random() * 11);
        return Array.from({ length: particleCount }, (_, i) => {
          // Random particle type - circles, stars, diamonds
          const shapes = ['circle', 'star', 'diamond'];
          const shape = shapes[Math.floor(Math.random() * shapes.length)];

          // Variable sizes - some HUGE particles!
          const sizeRoll = Math.random();
          let size;
          if (sizeRoll < 0.3) size = 'small'; // 30% small (4-6px)
          else if (sizeRoll < 0.7) size = 'medium'; // 40% medium (8-12px)
          else size = 'large'; // 30% LARGE (16-24px)

          // Create multiple waves/layers of particles
          const wave = i % 3; // 3 waves of particles

          return {
            id: `${match.row}-${match.col}-${i}-${Date.now()}`,
            color: COLORS[color],
            x: crystalX,
            y: crystalY,
            angle: (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5,
            distance: 60 + Math.random() * 120, // Much farther travel!
            delay: wave * 50 + Math.random() * 80, // Staggered waves
            duration: 1.0 + Math.random() * 0.5, // Variable duration
            shape,
            size,
            rotation: Math.random() * 360, // Random starting rotation
            spin: (Math.random() - 0.5) * 720, // Spin amount
          };
        });
      });

      setParticles(newParticles);

      // Clean up particles after animation (longer for epic effect)
      const timer = setTimeout(() => {
        setParticles([]);
      }, 1600);

      return () => clearTimeout(timer);
    }
  }, [matches, grid, gridRef]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {particles.map((particle) => {
        const tx = Math.cos(particle.angle) * particle.distance;
        const ty = Math.sin(particle.angle) * particle.distance;

        // Size mapping
        const sizeMap = {
          small: 'w-1.5 h-1.5', // 6px
          medium: 'w-3 h-3',    // 12px
          large: 'w-6 h-6',     // 24px
        };

        // Shape classes
        let shapeClass = 'rounded-full';
        if (particle.shape === 'star') {
          shapeClass = 'star-shape';
        } else if (particle.shape === 'diamond') {
          shapeClass = 'rotate-45';
        }

        // Glow effect intensity based on size
        const glowIntensity = {
          small: `0 0 4px ${particle.color}`,
          medium: `0 0 8px ${particle.color}, 0 0 12px ${particle.color}`,
          large: `0 0 16px ${particle.color}, 0 0 24px ${particle.color}, 0 0 32px ${particle.color}`,
        };

        return (
          <div
            key={particle.id}
            className={`absolute ${sizeMap[particle.size]} ${shapeClass} shadow-2xl`}
            style={{
              backgroundColor: particle.color,
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              '--tx': `${tx}px`,
              '--ty': `${ty}px`,
              '--rotation': `${particle.spin}deg`,
              animation: `particle-burst-epic ${particle.duration}s ease-out forwards`,
              animationDelay: `${particle.delay}ms`,
              transform: 'translate(-50%, -50%)',
              boxShadow: glowIntensity[particle.size],
              filter: 'brightness(1.2)',
            }}
          />
        );
      })}
    </div>
  );
};

export default Particles;
