import { useState, useRef, useCallback, useEffect } from 'react';
import { getNumberPath } from '@/data/numberPaths';
import useSound from '@/hooks/useSound';
import Confetti from './Confetti';
import StarBurst from './StarBurst';
import Mascot from './Mascot';

interface NumberTracingProps {
  number: number;
  onComplete: () => void;
  onNext: () => void;
}

const NumberTracing = ({ number, onComplete, onNext }: NumberTracingProps) => {
  const [isTracing, setIsTracing] = useState(false);
  const [tracedPath, setTracedPath] = useState<string>('');
  const [traceProgress, setTraceProgress] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [mascotMessage, setMascotMessage] = useState('Trace the number!');
  const [mascotEmotion, setMascotEmotion] = useState<'happy' | 'excited' | 'thinking' | 'celebrating'>('happy');
  
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const { playSuccess, playCelebration, playClick } = useSound();

  const numberData = getNumberPath(number);

  useEffect(() => {
    // Reset state when number changes
    setTracedPath('');
    setTraceProgress(0);
    setShowCelebration(false);
    setMascotMessage('Trace the number!');
    setMascotEmotion('happy');
  }, [number]);

  const getEventCoordinates = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Convert to SVG coordinates
    const x = ((clientX - rect.left) / rect.width) * 200;
    const y = ((clientY - rect.top) / rect.height) * 240;
    
    return { x, y };
  }, []);

  const handleStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    playClick();
    setIsTracing(true);
    const { x, y } = getEventCoordinates(e);
    setTracedPath(`M ${x} ${y}`);
    setMascotMessage('Great! Keep going!');
    setMascotEmotion('excited');
  }, [getEventCoordinates, playClick]);

  const handleMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!isTracing) return;
    e.preventDefault();
    
    const { x, y } = getEventCoordinates(e);
    setTracedPath(prev => `${prev} L ${x} ${y}`);
    
    // Calculate progress based on path length
    const newProgress = Math.min(traceProgress + 2, 100);
    setTraceProgress(newProgress);
  }, [isTracing, getEventCoordinates, traceProgress]);

  const handleEnd = useCallback(() => {
    setIsTracing(false);
    
    if (traceProgress >= 70) {
      // Success!
      playSuccess();
      setTimeout(() => {
        playCelebration();
        setShowCelebration(true);
        setMascotMessage('Amazing! You did it! 🎉');
        setMascotEmotion('celebrating');
        onComplete();
      }, 300);
    } else if (traceProgress > 20) {
      setMascotMessage('Almost! Try again!');
      setMascotEmotion('thinking');
    }
  }, [traceProgress, playSuccess, playCelebration, onComplete]);

  const handleRetry = () => {
    playClick();
    setTracedPath('');
    setTraceProgress(0);
    setShowCelebration(false);
    setMascotMessage('Let\'s try again!');
    setMascotEmotion('happy');
  };

  const handleNext = () => {
    playClick();
    onNext();
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <Confetti active={showCelebration} />
      <StarBurst active={showCelebration} x={50} y={40} />
      
      {/* Header with number name */}
      <div className="text-center">
        <h2 className="font-fredoka text-3xl md:text-4xl text-foreground mb-2">
          Number <span className="text-numbers-accent">{number}</span>
        </h2>
        <p className="font-nunito text-xl text-muted-foreground">{numberData.name}</p>
      </div>

      {/* Mascot */}
      <Mascot message={mascotMessage} emotion={mascotEmotion} />

      {/* Tracing Area */}
      <div className="module-card bg-numbers/50 w-full max-w-sm">
        <svg
          ref={svgRef}
          viewBox="0 0 200 240"
          className="w-full h-auto number-trace-area touch-none"
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={() => isTracing && handleEnd()}
        >
          {/* Background number outline */}
          <path
            ref={pathRef}
            d={numberData.path}
            className="number-outline"
          />
          
          {/* Dotted guide path */}
          <path
            d={numberData.path}
            className="dotted-guide"
          />
          
          {/* User's traced path */}
          {tracedPath && (
            <path
              d={tracedPath}
              className="number-traced"
              stroke={showCelebration ? 'hsl(var(--numbers-accent))' : 'hsl(var(--primary))'}
              strokeOpacity={0.8}
            />
          )}
          
          {/* Start indicator */}
          <circle
            cx="100"
            cy="40"
            r="8"
            fill="hsl(var(--accent))"
            className={isTracing ? 'opacity-50' : 'animate-pulse'}
          />
          <text
            x="100"
            y="25"
            textAnchor="middle"
            className="text-xs fill-muted-foreground font-nunito"
          >
            Start
          </text>
        </svg>

        {/* Progress bar */}
        <div className="mt-4 h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-numbers-accent transition-all duration-200 rounded-full"
            style={{ width: `${traceProgress}%` }}
          />
        </div>
      </div>

      {/* Objects to count */}
      {numberData.objects.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 max-w-xs">
          {numberData.objects.map((obj, i) => (
            <span
              key={i}
              className="object-emoji animate-bounce-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {obj}
            </span>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={handleRetry}
          className="fun-button bg-muted text-muted-foreground hover:bg-muted/80"
        >
          🔄 Retry
        </button>
        <button
          onClick={handleNext}
          className="fun-button bg-numbers-accent text-primary-foreground hover:opacity-90"
        >
          Next ➡️
        </button>
      </div>
    </div>
  );
};

export default NumberTracing;
