import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import fa from './locales/fa.json';
import en from './locales/en.json';
import ps from './locales/ps.json';

// RTL languages
const RTL_LANGUAGES = ['fa', 'ps', 'ar', 'he'];

// Update document direction based on language
const updateDirection = (lng: string) => {
    const dir = RTL_LANGUAGES.includes(lng) ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lng;
    document.body.style.fontFamily = dir === 'rtl'
        ? "'Vazirmatn', 'Inter', sans-serif"
        : "'Inter', 'Vazirmatn', sans-serif";
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            fa: { translation: fa },
            en: { translation: en },
            ps: { translation: ps }
        },
        fallbackLng: 'fa',
        debug: false,
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        }
    });

// Set initial direction
updateDirection(i18n.language || 'fa');

// Listen for language changes
i18n.on('languageChanged', (lng: string) => {
    updateDirection(lng);
});

export default i18n;
