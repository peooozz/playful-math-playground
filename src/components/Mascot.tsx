import { useState, useEffect } from 'react';
import mascotImage from '@/assets/mascot-fox.png';

interface MascotProps {
  message?: string;
  emotion?: 'happy' | 'excited' | 'thinking' | 'celebrating';
  className?: string;
}

const Mascot = ({ message, emotion = 'happy', className = '' }: MascotProps) => {
  const [showMessage, setShowMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(message);

  useEffect(() => {
    if (message) {
      setCurrentMessage(message);
      setShowMessage(true);
      const timer = setTimeout(() => setShowMessage(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const getEmotionStyle = () => {
    switch (emotion) {
      case 'excited':
        return 'animate-bounce';
      case 'thinking':
        return 'animate-wiggle';
      case 'celebrating':
        return 'animate-pop';
      default:
        return 'animate-float';
    }
  };

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      {/* Speech Bubble */}
      {showMessage && currentMessage && (
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-card rounded-2xl px-4 py-2 shadow-card animate-bounce-in z-10 max-w-[200px]">
          <p className="font-nunito font-semibold text-sm text-foreground text-center leading-tight">{currentMessage}</p>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-card" />
        </div>
      )}
      
      {/* Mascot Image */}
      <div className={`mascot select-none ${getEmotionStyle()}`}>
        <img 
          src={mascotImage} 
          alt="Friendly fox helper" 
          className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-md"
        />
      </div>
    </div>
  );
};

export default Mascot;
