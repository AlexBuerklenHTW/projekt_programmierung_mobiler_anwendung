import React, { createContext, useState, useContext, useEffect } from 'react';
import { Colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextType {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    themeColors: typeof Colors.light;
}

const ThemeContext = createContext<ThemeContextType>({
    isDarkMode: false,
    toggleDarkMode: () => {},
    themeColors: Colors.light,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(()=>{
        const loadDarkModeFromStorage = async () => {
            try {
                const storedDarkMode = await AsyncStorage.getItem('DarkMode');
                if (storedDarkMode !== null) {
                    setIsDarkMode(storedDarkMode === 'true')   
                } 
            }
            catch (error) {
                console.error('Fehler beim Laden des Dark Modes aus AsyncStorage:', error);
            }
        };
        loadDarkModeFromStorage();
    }, []);

    useEffect(()=>{
        AsyncStorage.setItem('DarkMode', isDarkMode.toString());
    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

    const themeColors = isDarkMode ? Colors.dark : Colors.light;

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, themeColors }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useThemeContext = () => useContext(ThemeContext);
