import { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { PrivacyProvider } from "@/shared/context/PrivacyContext";
import { GamificationProvider } from "@/shared/context/GamificationContext";
import { ThemeProvider } from "@/shared/context/ThemeContext";
import { ErrorFallback } from "@/shared/ui/ErrorFallback";

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5, // 5 minutes fresh
        },
    },
});

interface AppProvidersProps {
    children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
    return (
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <PrivacyProvider>
                        <GamificationProvider>
                            <BrowserRouter>
                                {children}
                            </BrowserRouter>
                        </GamificationProvider>
                    </PrivacyProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </ErrorBoundary>
    );
};
