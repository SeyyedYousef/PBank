import { createContext, useContext, useState } from 'react';

type PrivacyContextType = {
    isPrivacyMode: boolean;
    togglePrivacy: () => void;
    // Security Features
    biometricEnabled: boolean;
    toggleBiometric: () => void;
    setBiometric: (v: boolean) => void;
    incognitoKeyboardEnabled: boolean;
    toggleIncognitoKeyboard: () => void;
    setIncognitoKeyboard: (v: boolean) => void;
    geoFencingEnabled: boolean;
    toggleGeoFencing: () => void;
    isForeignLocation: boolean;
    toggleForeignLocation: () => void;
};

const PrivacyContext = createContext<PrivacyContextType>({
    isPrivacyMode: false,
    togglePrivacy: () => { },
    biometricEnabled: false,
    toggleBiometric: () => { },
    setBiometric: () => { },
    incognitoKeyboardEnabled: false,
    toggleIncognitoKeyboard: () => { },
    setIncognitoKeyboard: () => { },
    geoFencingEnabled: false,
    toggleGeoFencing: () => { },
    isForeignLocation: false,
    toggleForeignLocation: () => { },
});

export const usePrivacy = () => useContext(PrivacyContext);

export const PrivacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isPrivacyMode, setIsPrivacyMode] = useState(false);
    const [biometricEnabled, setBiometricEnabled] = useState(false);
    const [incognitoKeyboardEnabled, setIncognitoKeyboardEnabled] = useState(false);
    const [geoFencingEnabled, setGeoFencingEnabled] = useState(false);
    const [isForeignLocation, setIsForeignLocation] = useState(false);

    const togglePrivacy = () => setIsPrivacyMode(prev => !prev);
    const toggleBiometric = () => setBiometricEnabled(prev => !prev);
    const toggleIncognitoKeyboard = () => setIncognitoKeyboardEnabled(prev => !prev);
    const toggleGeoFencing = () => setGeoFencingEnabled(prev => !prev);
    const toggleForeignLocation = () => setIsForeignLocation(prev => !prev);

    return (
        <PrivacyContext.Provider value={{
            isPrivacyMode, togglePrivacy,
            biometricEnabled, toggleBiometric, setBiometric: setBiometricEnabled,
            incognitoKeyboardEnabled, toggleIncognitoKeyboard, setIncognitoKeyboard: setIncognitoKeyboardEnabled,
            geoFencingEnabled, toggleGeoFencing,
            isForeignLocation, toggleForeignLocation
        }}>
            {children}
        </PrivacyContext.Provider>
    );
};
