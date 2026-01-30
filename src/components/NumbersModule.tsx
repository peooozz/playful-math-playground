import { useState } from 'react';
import NumberTracing from './NumberTracing';
import useSound from '@/hooks/useSound';

const NumbersModule = () => {
  const [currentNumber, setCurrentNumber] = useState(0);
  const [completedNumbers, setCompletedNumbers] = useState<Set<number>>(new Set());
  const { playClick } = useSound();

  const handleComplete = () => {
    setCompletedNumbers(prev => new Set([...prev, currentNumber]));
  };

  const handleNext = () => {
    if (currentNumber < 10) {
      setCurrentNumber(prev => prev + 1);
    } else {
      setCurrentNumber(0);
    }
  };

  const handleNumberSelect = (num: number) => {
    playClick();
    setCurrentNumber(num);
  };

  return (
    <div className="flex flex-col items-center gap-6 pb-8">
      {/* Number selector */}
      <div className="flex flex-wrap justify-center gap-2 px-4 max-w-md">
        {Array.from({ length: 11 }, (_, i) => (
          <button
            key={i}
            onClick={() => handleNumberSelect(i)}
            className={`
              w-10 h-10 md:w-12 md:h-12 rounded-xl font-fredoka font-bold text-lg
              transition-all duration-200 transform
              ${currentNumber === i 
                ? 'bg-numbers-accent text-primary-foreground scale-110 shadow-button' 
                : completedNumbers.has(i)
                  ? 'bg-secondary text-secondary-foreground'
                  : 'bg-numbers text-numbers-accent hover:scale-105'
              }
            `}
          >
            {i}
            {completedNumbers.has(i) && (
              <span className="absolute -top-1 -right-1 text-xs">✓</span>
            )}
          </button>
        ))}
      </div>

      {/* Progress indicator */}
      <div className="text-center">
        <p className="font-nunito text-muted-foreground">
          Progress: <span className="font-bold text-numbers-accent">{completedNumbers.size}</span> / 11 numbers
        </p>
      </div>

      {/* Tracing component */}
      <NumberTracing
        number={currentNumber}
        onComplete={handleComplete}
        onNext={handleNext}
      />
    </div>
  );
};

export default NumbersModule;
