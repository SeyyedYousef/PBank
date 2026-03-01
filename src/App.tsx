import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { ErrorBoundary } from "react-error-boundary";
import { AppProviders } from "./app/providers";
import { AppRoutes } from "./app/routes/AppRoutes";
import { SplashScreen } from "@/shared/ui/SplashScreen";
import { OfflineIndicator } from "@/shared/ui/OfflineIndicator";
import { ToastContainer } from "@/shared/ui/Toast";
import { ErrorFallback } from "@/shared/ui/ErrorFallback";
import { initNative, hideSplash } from "@/shared/lib/native";
import { AppLockScreen } from "@/shared/ui/AppLockScreen";

function App() {
    const [showSplash, setShowSplash] = useState(true);

    // Initialize native platform features
    useEffect(() => {
        initNative();
    }, []);

    const handleSplashComplete = () => {
        setShowSplash(false);
        // Hide native splash after web splash animation completes
        hideSplash();
    };

    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
                window.location.href = '/';
            }}
        >
            <AppProviders>
                <OfflineIndicator />
                <ToastContainer />
                <AppLockScreen />
                <AnimatePresence mode="wait">
                    {showSplash ? (
                        <SplashScreen key="splash" onComplete={handleSplashComplete} />
                    ) : (
                        <AppRoutes />
                    )}
                </AnimatePresence>
            </AppProviders>
        </ErrorBoundary>
    );
}

export default App;

