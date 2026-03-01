import { useCallback } from 'react';

type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

export const useHaptic = () => {
    const trigger = useCallback((type: HapticType = 'light') => {
        if (!navigator.vibrate) return;

        switch (type) {
            case 'light':
                // Very short, sharp tick (Mechanical Keyboard feel)
                navigator.vibrate(5);
                break;
            case 'medium':
                navigator.vibrate(15);
                break;
            case 'heavy':
                // Thud feel
                navigator.vibrate(30);
                break;
            case 'success':
                // Double tap (Heartbeat)
                navigator.vibrate([10, 50, 10]);
                break;
            case 'warning':
                navigator.vibrate([30, 50, 30]);
                break;
            case 'error':
                // Sharp buzzing (Glitch)
                navigator.vibrate([15, 30, 15, 30, 15]);
                break;
        }
    }, []);

    return { trigger };
};
