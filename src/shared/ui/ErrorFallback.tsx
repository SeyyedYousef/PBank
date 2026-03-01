import React from 'react';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

interface ErrorFallbackProps {
    error: unknown;
    resetErrorBoundary: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-black">
            <div className="w-16 h-16 mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>

            <h2 className="text-xl font-bold text-white mb-2">
                اوپس! مشکلی پیش آمده
            </h2>

            <p className="text-gray-400 mb-8 max-w-xs text-sm">
                متاسفانه برنامه با یک خطای غیرمنتظره روبرو شد. لطفا دوباره تلاش کنید.
            </p>

            {/* Dev Only Details */}
            {import.meta.env.DEV && (
                <pre className="text-[10px] text-red-400/80 mb-6 p-4 bg-red-950/30 rounded-lg max-w-full overflow-auto text-left dir-ltr">
                    {errorMessage}
                </pre>
            )}

            <Button onClick={resetErrorBoundary} variant="primary" className="w-full max-w-xs">
                تلاش مجدد
            </Button>
        </div>
    );
};
