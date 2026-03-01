import { useCallback } from 'react';
import { useSound } from './useSound';
import { useHaptic } from './useHaptic';

type FeedbackType = 'click' | 'success' | 'error' | 'warning';

export const useFeedback = () => {
    const { playClick, playSuccess, playError } = useSound();
    const { trigger: triggerHaptic } = useHaptic();

    const trigger = useCallback((type: FeedbackType) => {
        switch (type) {
            case 'click':
                playClick();
                triggerHaptic('light');
                break;
            case 'success':
                playSuccess();
                triggerHaptic('success');
                break;
            case 'error':
                playError();
                triggerHaptic('error');
                break;
            case 'warning':
                // maybe add warning sound later
                playClick(); // fallback
                triggerHaptic('warning');
                break;
        }
    }, [playClick, playSuccess, playError, triggerHaptic]);

    return { trigger };
};
