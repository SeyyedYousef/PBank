/**
 * PBank — Native Bridge
 * Integrates Capacitor native APIs with the web app
 * Falls back gracefully when running in browser
 */

import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Keyboard } from '@capacitor/keyboard';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { App } from '@capacitor/app';
import { Share } from '@capacitor/share';
import { Network } from '@capacitor/network';

const isNative = Capacitor.isNativePlatform();

// ── Status Bar ──
export const configureStatusBar = async () => {
    if (!isNative) return;
    try {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#05040A' });
        await StatusBar.setOverlaysWebView({ overlay: true });
    } catch (e) {
        console.warn('[Native] StatusBar config failed:', e);
    }
};

// ── Splash Screen ──
export const hideSplash = async () => {
    if (!isNative) return;
    try {
        await SplashScreen.hide({ fadeOutDuration: 300 });
    } catch (e) {
        console.warn('[Native] SplashScreen hide failed:', e);
    }
};

// ── Keyboard ──
export const setupKeyboard = () => {
    if (!isNative) return;
    try {
        Keyboard.setResizeMode({ mode: 'body' as never });
    } catch (e) {
        console.warn('[Native] Keyboard setup failed:', e);
    }
};

// ── Haptics ──
export const haptic = {
    light: async () => {
        if (!isNative) return;
        await Haptics.impact({ style: ImpactStyle.Light });
    },
    medium: async () => {
        if (!isNative) return;
        await Haptics.impact({ style: ImpactStyle.Medium });
    },
    heavy: async () => {
        if (!isNative) return;
        await Haptics.impact({ style: ImpactStyle.Heavy });
    },
    success: async () => {
        if (!isNative) return;
        await Haptics.notification({ type: NotificationType.Success });
    },
    error: async () => {
        if (!isNative) return;
        await Haptics.notification({ type: NotificationType.Error });
    },
    warning: async () => {
        if (!isNative) return;
        await Haptics.notification({ type: NotificationType.Warning });
    },
};

// ── Share ──
export const nativeShare = async (opts: { title: string; text: string; url?: string }) => {
    if (isNative) {
        await Share.share(opts);
    } else if (navigator.share) {
        await navigator.share(opts);
    } else {
        await navigator.clipboard.writeText(opts.text);
    }
};

// ── Back Button Handler ──
export const setupBackButton = (handler: () => void) => {
    if (!isNative) return () => { };
    const listener = App.addListener('backButton', ({ canGoBack }) => {
        if (canGoBack) {
            window.history.back();
        } else {
            handler();
        }
    });
    return () => { listener.then(l => l.remove()); };
};

// ── Network ──
export const getNetworkStatus = async () => {
    if (!isNative) return { connected: navigator.onLine, connectionType: 'unknown' };
    const status = await Network.getStatus();
    return { connected: status.connected, connectionType: status.connectionType };
};

export const onNetworkChange = (callback: (connected: boolean) => void) => {
    if (isNative) {
        const listener = Network.addListener('networkStatusChange', (status) => {
            callback(status.connected);
        });
        return () => { listener.then(l => l.remove()); };
    } else {
        const onOnline = () => callback(true);
        const onOffline = () => callback(false);
        window.addEventListener('online', onOnline);
        window.addEventListener('offline', onOffline);
        return () => {
            window.removeEventListener('online', onOnline);
            window.removeEventListener('offline', onOffline);
        };
    }
};

// ── Initialize All Native Features ──
export const initNative = async () => {
    if (!isNative) return;
    console.log('[PBank] Running on native platform:', Capacitor.getPlatform());
    await configureStatusBar();
    setupKeyboard();
};
