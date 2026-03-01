/**
 * Unit Tests for Custom Hooks
 * Tests useFeedback, useHaptic, and useSound hooks
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useHaptic } from './useHaptic';
import { useFeedback } from './useFeedback';

// Mock navigator.vibrate
const mockVibrate = vi.fn();

describe('useHaptic', () => {
    beforeEach(() => {
        // Setup mock
        Object.defineProperty(navigator, 'vibrate', {
            value: mockVibrate,
            writable: true,
            configurable: true
        });
        mockVibrate.mockClear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should trigger light haptic with 5ms vibration', () => {
        const { result } = renderHook(() => useHaptic());

        result.current.trigger('light');

        expect(mockVibrate).toHaveBeenCalledWith(5);
    });

    it('should trigger medium haptic with 15ms vibration', () => {
        const { result } = renderHook(() => useHaptic());

        result.current.trigger('medium');

        expect(mockVibrate).toHaveBeenCalledWith(15);
    });

    it('should trigger heavy haptic with 30ms vibration', () => {
        const { result } = renderHook(() => useHaptic());

        result.current.trigger('heavy');

        expect(mockVibrate).toHaveBeenCalledWith(30);
    });

    it('should trigger success haptic with heartbeat pattern', () => {
        const { result } = renderHook(() => useHaptic());

        result.current.trigger('success');

        expect(mockVibrate).toHaveBeenCalledWith([10, 50, 10]);
    });

    it('should trigger warning haptic with double buzz', () => {
        const { result } = renderHook(() => useHaptic());

        result.current.trigger('warning');

        expect(mockVibrate).toHaveBeenCalledWith([30, 50, 30]);
    });

    it('should trigger error haptic with glitch pattern', () => {
        const { result } = renderHook(() => useHaptic());

        result.current.trigger('error');

        expect(mockVibrate).toHaveBeenCalledWith([15, 30, 15, 30, 15]);
    });

    it('should default to light haptic when no type provided', () => {
        const { result } = renderHook(() => useHaptic());

        result.current.trigger();

        expect(mockVibrate).toHaveBeenCalledWith(5);
    });

    it('should not throw when navigator.vibrate is not available', () => {
        // Remove vibrate API
        Object.defineProperty(navigator, 'vibrate', {
            value: undefined,
            writable: true,
            configurable: true
        });

        const { result } = renderHook(() => useHaptic());

        // Should not throw
        expect(() => result.current.trigger('success')).not.toThrow();
    });
});

describe('useFeedback', () => {
    beforeEach(() => {
        Object.defineProperty(navigator, 'vibrate', {
            value: mockVibrate,
            writable: true,
            configurable: true
        });
        mockVibrate.mockClear();

        // Mock AudioContext
        const mockAudioContext = {
            createOscillator: () => ({
                type: '',
                frequency: { setValueAtTime: vi.fn() },
                connect: vi.fn(),
                start: vi.fn(),
                stop: vi.fn(),
            }),
            createGain: () => ({
                gain: {
                    setValueAtTime: vi.fn(),
                    exponentialRampToValueAtTime: vi.fn()
                },
                connect: vi.fn(),
            }),
            currentTime: 0,
            destination: {},
        };

        (window as any).AudioContext = vi.fn(() => mockAudioContext);
    });

    it('should trigger click feedback (sound + light haptic)', () => {
        const { result } = renderHook(() => useFeedback());

        result.current.trigger('click');

        // Should trigger light haptic
        expect(mockVibrate).toHaveBeenCalledWith(5);
    });

    it('should trigger success feedback (sound + success haptic)', () => {
        const { result } = renderHook(() => useFeedback());

        result.current.trigger('success');

        // Should trigger success haptic pattern
        expect(mockVibrate).toHaveBeenCalledWith([10, 50, 10]);
    });

    it('should trigger error feedback (sound + error haptic)', () => {
        const { result } = renderHook(() => useFeedback());

        result.current.trigger('error');

        // Should trigger error haptic pattern
        expect(mockVibrate).toHaveBeenCalledWith([15, 30, 15, 30, 15]);
    });

    it('should trigger warning feedback (sound + warning haptic)', () => {
        const { result } = renderHook(() => useFeedback());

        result.current.trigger('warning');

        // Should trigger warning haptic pattern
        expect(mockVibrate).toHaveBeenCalledWith([30, 50, 30]);
    });
});
