import { useEffect, useState } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

interface StarBurstProps {
  active: boolean;
  x?: number;
  y?: number;
}

const StarBurst = ({ active, x = 50, y = 50 }: StarBurstProps) => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    if (active) {
      const newStars: Star[] = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: x + (Math.random() - 0.5) * 60,
        y: y + (Math.random() - 0.5) * 60,
        size: Math.random() * 20 + 15,
        delay: Math.random() * 0.3,
      }));
      setStars(newStars);

      const timer = setTimeout(() => setStars([]), 1000);
      return () => clearTimeout(timer);
    }
  }, [active, x, y]);

  if (stars.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute star-burst"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            fontSize: `${star.size}px`,
            animationDelay: `${star.delay}s`,
          }}
        >
          ⭐
        </div>
      ))}
    </div>
  );
};

export default StarBurst;
