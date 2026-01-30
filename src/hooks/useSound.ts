import { useCallback, useRef } from 'react';

// Using Web Audio API for simple sound effects
const useSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio not supported, fail silently
    }
  }, [getAudioContext]);

  const playClick = useCallback(() => {
    playTone(800, 0.1, 'sine');
  }, [playTone]);

  const playSuccess = useCallback(() => {
    const ctx = getAudioContext();
    const notes = [523, 659, 784]; // C5, E5, G5
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.2, 'sine'), i * 100);
    });
  }, [getAudioContext, playTone]);

  const playWrong = useCallback(() => {
    playTone(200, 0.3, 'triangle');
  }, [playTone]);

  const playCelebration = useCallback(() => {
    const notes = [523, 587, 659, 698, 784, 880, 988, 1047]; // C major scale
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.15, 'sine'), i * 80);
    });
  }, [playTone]);

  return {
    playClick,
    playSuccess,
    playWrong,
    playCelebration,
  };
};

export default useSound;
