import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Theme = 'dark' | 'light';
type Direction = 'ltr' | 'rtl';

interface ThemeContextType {
    theme: Theme;
    direction: Direction;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { i18n } = useTranslation();
    const [theme, setTheme] = useState<Theme>('dark');
    const [direction, setDirection] = useState<Direction>('rtl');

    useEffect(() => {
        const root = document.documentElement;

        // Handle Theme
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        // Handle Direction & Language
        const isRtl = i18n.language === 'fa' || i18n.language === 'ps';
        const newDirection = isRtl ? 'rtl' : 'ltr';
        setDirection(newDirection);
        root.dir = newDirection;
        root.lang = i18n.language;

        // Handle font classes
        document.body.classList.remove('font-sans', 'font-sans-en');
        if (isRtl) {
            document.body.classList.add('font-sans');
        } else {
            document.body.classList.add('font-sans-en');
        }

    }, [i18n.language, theme]);

    return (
        <ThemeContext.Provider value={{ theme, direction, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
