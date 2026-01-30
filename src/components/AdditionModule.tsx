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
  const num1 = Math.floor(Math.random() * 6);
  const num2 = Math.floor(Math.random() * (10 - num1 + 1));
  return {
    num1,
    num2,
    answer: num1 + num2,
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

const AdditionModule = () => {
  const [problem, setProblem] = useState<Problem>(generateProblem);
  const [choices, setChoices] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [mascotMessage, setMascotMessage] = useState('Count the objects!');
  const [mascotEmotion, setMascotEmotion] = useState<'happy' | 'excited' | 'thinking' | 'celebrating'>('happy');
  const [showObjects, setShowObjects] = useState(false);

  const { playClick, playSuccess, playWrong, playCelebration } = useSound();

  const setupNewProblem = useCallback(() => {
    const newProblem = generateProblem();
    setProblem(newProblem);
    setChoices(generateChoices(newProblem.answer));
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowCelebration(false);
    setShowObjects(false);
    setMascotMessage('Count the objects!');
    setMascotEmotion('happy');

    // Animate objects appearing
    setTimeout(() => setShowObjects(true), 300);
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
        setMascotMessage('Fantastic! 🎉');
        setMascotEmotion('celebrating');
      }, 200);
    } else {
      setIsCorrect(false);
      playWrong();
      setMascotMessage(`Not quite! It's ${problem.answer}!`);
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
          Score: <span className="font-bold text-addition-accent">{score}</span> / {totalAttempts}
        </p>
      </div>

      {/* Mascot */}
      <Mascot message={mascotMessage} emotion={mascotEmotion} />

      {/* Problem display */}
      <div className="module-card bg-addition/50 w-full max-w-sm">
        {/* Objects visualization */}
        <div className="flex justify-center items-center gap-4 mb-6 min-h-[100px]">
          {/* First group */}
          <div className="flex flex-wrap justify-center gap-1 max-w-[120px]">
            {Array.from({ length: problem.num1 }, (_, i) => (
              <span
                key={`a-${i}`}
                className={`object-emoji ${showObjects ? 'animate-bounce-in' : 'opacity-0'}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {problem.objects}
              </span>
            ))}
          </div>
          
          {/* Plus sign */}
          <span className="text-4xl font-fredoka text-addition-accent">+</span>
          
          {/* Second group */}
          <div className="flex flex-wrap justify-center gap-1 max-w-[120px]">
            {Array.from({ length: problem.num2 }, (_, i) => (
              <span
                key={`b-${i}`}
                className={`object-emoji ${showObjects ? 'animate-bounce-in' : 'opacity-0'}`}
                style={{ animationDelay: `${(problem.num1 + i) * 0.1}s` }}
              >
                {problem.objects}
              </span>
            ))}
          </div>
        </div>

        {/* Equation */}
        <div className="text-center mb-6">
          <p className="font-fredoka text-4xl md:text-5xl text-foreground">
            {problem.num1} <span className="text-addition-accent">+</span> {problem.num2} <span className="text-addition-accent">=</span> ?
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
                  ? 'bg-secondary text-secondary-foreground hover:bg-addition-accent hover:text-primary-foreground' 
                  : choice === problem.answer
                    ? 'bg-addition-accent text-primary-foreground animate-pop'
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
          className="fun-button bg-addition-accent text-primary-foreground hover:opacity-90 animate-bounce-in"
        >
          Next Problem ➡️
        </button>
      )}
    </div>
  );
};

export default AdditionModule;
