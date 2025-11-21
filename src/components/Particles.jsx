import { useEffect, useState } from 'react';

const Particles = ({ matches, colors }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (matches && matches.length > 0) {
      // Create particles for each matched crystal
      const newParticles = matches.flatMap((match) => {
        const color = colors[match.row]?.[match.col];
        if (!color) return [];

        // Create 6-8 particles per crystal
        const particleCount = 6 + Math.floor(Math.random() * 3);
        return Array.from({ length: particleCount }, (_, i) => ({
          id: `${match.row}-${match.col}-${i}-${Date.now()}`,
          color,
          row: match.row,
          col: match.col,
          angle: (Math.PI * 2 * i) / particleCount,
          distance: 30 + Math.random() * 40,
          delay: Math.random() * 100,
        }));
      });

      setParticles(newParticles);

      // Clean up particles after animation
      const timer = setTimeout(() => {
        setParticles([]);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [matches, colors]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {particles.map((particle) => {
        const tx = Math.cos(particle.angle) * particle.distance;
        const ty = Math.sin(particle.angle) * particle.distance;

        return (
          <div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: particle.color,
              left: '50%',
              top: '50%',
              '--tx': `${tx}px`,
              '--ty': `${ty}px`,
              animation: `particle-burst 0.6s ease-out forwards`,
              animationDelay: `${particle.delay}ms`,
            }}
          />
        );
      })}
    </div>
  );
};

export default Particles;
