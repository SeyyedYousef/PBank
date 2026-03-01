import { useCallback } from 'react';

// Simple beep synth for now, to ensure zero-dependency sound
// In production, this would load MP3 files
const playTone = (freq: number, type: 'sine' | 'square' | 'triangle' | 'sawtooth', duration: number) => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch (e) {
        console.error("Audio error", e);
    }
};

export const useSound = () => {
    const playClick = useCallback(() => {
        // High pitched sophisticated "glass" tick (higher freq, shorter decay)
        playTone(1800, 'sine', 0.05);
    }, []);

    const playSuccess = useCallback(() => {
        // Ascending chime (Coin drop feel)
        const now = 0;
        setTimeout(() => playTone(880, 'sine', 0.1), now);       // A5
        setTimeout(() => playTone(1108, 'sine', 0.1), now + 80); // C#6
        setTimeout(() => playTone(1318, 'sine', 0.3), now + 160); // E6
    }, []);

    const playError = useCallback(() => {
        // Low dissonant buzz
        playTone(150, 'sawtooth', 0.2);
        setTimeout(() => playTone(140, 'sawtooth', 0.2), 100);
    }, []);

    return { playClick, playSuccess, playError };
};
