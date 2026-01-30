import { useState, useEffect, useCallback } from 'react';
import useSound from '@/hooks/useSound';
import Confetti from './Confetti';
import StarBurst from './StarBurst';
import Mascot from './Mascot';

interface Problem {
  num1: number;
  num2: number;
  answer: number;
  objects: string;
}

const emojis = ['🍎', '⭐', '🧸', '🌸', '🎈', '🍭', '🦋', '🌈'];

const generateProblem = (): Problem => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * (num1 + 1));
  return {
    num1,
    num2,
    answer: num1 - num2,
    objects: emojis[Math.floor(Math.random() * emojis.length)],
  };
};

const generateChoices = (correctAnswer: number): number[] => {
  const choices = new Set<number>([correctAnswer]);
  while (choices.size < 4) {
    const wrong = Math.max(0, Math.min(10, correctAnswer + Math.floor(Math.random() * 5) - 2));
    if (wrong !== correctAnswer) {
      choices.add(wrong);
    }
  }
  return Array.from(choices).sort(() => Math.random() - 0.5);
};

const SubtractionModule = () => {
  const [problem, setProblem] = useState<Problem>(generateProblem);
  const [choices, setChoices] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [mascotMessage, setMascotMessage] = useState('Take some away!');
  const [mascotEmotion, setMascotEmotion] = useState<'happy' | 'excited' | 'thinking' | 'celebrating'>('happy');
  const [removedObjects, setRemovedObjects] = useState<Set<number>>(new Set());
  const [showAnimation, setShowAnimation] = useState(false);

  const { playClick, playSuccess, playWrong, playCelebration } = useSound();

  const setupNewProblem = useCallback(() => {
    const newProblem = generateProblem();
    setProblem(newProblem);
    setChoices(generateChoices(newProblem.answer));
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowCelebration(false);
    setRemovedObjects(new Set());
    setShowAnimation(false);
    setMascotMessage('Take some away!');
    setMascotEmotion('happy');

    // Animate objects disappearing
    setTimeout(() => {
      setShowAnimation(true);
      const objectsToRemove = new Set<number>();
      for (let i = 0; i < newProblem.num2; i++) {
        objectsToRemove.add(newProblem.num1 - 1 - i);
      }
      setTimeout(() => setRemovedObjects(objectsToRemove), 800);
    }, 500);
  }, []);

  useEffect(() => {
    setupNewProblem();
  }, [setupNewProblem]);

  const handleAnswer = (answer: number) => {
    if (selectedAnswer !== null) return;
    
    playClick();
    setSelectedAnswer(answer);
    setTotalAttempts(prev => prev + 1);

    if (answer === problem.answer) {
      setIsCorrect(true);
      setScore(prev => prev + 1);
      playSuccess();
      setTimeout(() => {
        playCelebration();
        setShowCelebration(true);
        setMascotMessage('You got it! 🎉');
        setMascotEmotion('celebrating');
      }, 200);
    } else {
      setIsCorrect(false);
      playWrong();
      setMascotMessage(`Oops! It's ${problem.answer}!`);
      setMascotEmotion('thinking');
    }
  };

  const handleNext = () => {
    playClick();
    setupNewProblem();
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <Confetti active={showCelebration} />
      <StarBurst active={showCelebration} />

      {/* Progress */}
      <div className="text-center">
        <p className="font-nunito text-muted-foreground">
          Score: <span className="font-bold text-subtraction-accent">{score}</span> / {totalAttempts}
        </p>
      </div>

      {/* Mascot */}
      <Mascot message={mascotMessage} emotion={mascotEmotion} />

      {/* Problem display */}
      <div className="module-card bg-subtraction/50 w-full max-w-sm">
        {/* Objects visualization */}
        <div className="flex justify-center items-center gap-2 mb-6 min-h-[100px] flex-wrap max-w-[280px] mx-auto">
          {Array.from({ length: problem.num1 }, (_, i) => (
            <span
              key={i}
              className={`
                object-emoji transition-all duration-500
                ${showAnimation ? 'animate-bounce-in' : 'opacity-0'}
                ${removedObjects.has(i) ? 'opacity-20 scale-75 grayscale' : ''}
              `}
              style={{ 
                animationDelay: `${i * 0.1}s`,
                transitionDelay: removedObjects.has(i) ? `${(problem.num1 - i) * 0.1}s` : '0s'
              }}
            >
              {problem.objects}
            </span>
          ))}
        </div>

        {/* Visual indicator of removal */}
        {problem.num2 > 0 && (
          <div className="text-center mb-4 text-muted-foreground font-nunito">
            <span className="text-subtraction-accent font-bold">{problem.num2}</span> taken away
          </div>
        )}

        {/* Equation */}
        <div className="text-center mb-6">
          <p className="font-fredoka text-4xl md:text-5xl text-foreground">
            {problem.num1} <span className="text-subtraction-accent">−</span> {problem.num2} <span className="text-subtraction-accent">=</span> ?
          </p>
        </div>

        {/* Answer choices */}
        <div className="grid grid-cols-4 gap-3">
          {choices.map((choice) => (
            <button
              key={choice}
              onClick={() => handleAnswer(choice)}
              disabled={selectedAnswer !== null}
              className={`
                answer-button
                ${selectedAnswer === null 
                  ? 'bg-secondary text-secondary-foreground hover:bg-subtraction-accent hover:text-primary-foreground' 
                  : choice === problem.answer
                    ? 'bg-subtraction-accent text-primary-foreground animate-pop'
                    : selectedAnswer === choice
                      ? 'bg-destructive text-destructive-foreground animate-shake'
                      : 'bg-muted text-muted-foreground opacity-50'
                }
              `}
            >
              {choice}
            </button>
          ))}
        </div>
      </div>

      {/* Next button */}
      {selectedAnswer !== null && (
        <button
          onClick={handleNext}
          className="fun-button bg-subtraction-accent text-primary-foreground hover:opacity-90 animate-bounce-in"
        >
          Next Problem ➡️
        </button>
      )}
    </div>
  );
};

export default SubtractionModule;
