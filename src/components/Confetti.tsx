import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  size: number;
}

interface ConfettiProps {
  active: boolean;
  duration?: number;
}

const colors = [
  'hsl(15, 90%, 65%)',   // coral
  'hsl(45, 100%, 70%)',  // yellow
  'hsl(160, 50%, 65%)',  // mint
  'hsl(270, 60%, 70%)',  // lavender
  'hsl(200, 80%, 65%)',  // sky blue
  'hsl(320, 60%, 70%)',  // pink
];

const Confetti = ({ active, duration = 3000 }: ConfettiProps) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (active) {
      const newPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        size: Math.random() * 8 + 6,
      }));
      setPieces(newPieces);

      const timer = setTimeout(() => setPieces([]), duration);
      return () => clearTimeout(timer);
    }
  }, [active, duration]);

  if (pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.x}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animationDelay: `${piece.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
