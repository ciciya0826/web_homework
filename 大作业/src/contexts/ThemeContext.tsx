import React, { createContext, useContext, useState, useEffect } from 'react';
import { SettingsStorage } from '../utils/storage';

interface ThemeContextType {
    primaryColor: string;
    activeColor: string;
    borderRadius: number;
    updateTheme: (primaryColor: string, activeColor: string, borderRadius: number) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [primaryColor, setPrimaryColor] = useState('#7ce5ef');
    const [activeColor, setActiveColor] = useState('#f4bff4');
    const [borderRadius, setBorderRadius] = useState(20);

    useEffect(() => {
        // 加载保存的主题设置
        const settings = SettingsStorage.getSettings();
        setPrimaryColor(settings.theme.primaryColor);
        setActiveColor(settings.theme.activeColor);
        setBorderRadius(settings.theme.borderRadius);

        // 应用CSS变量
        updateCSSVariables(settings.theme.primaryColor, settings.theme.activeColor, settings.theme.borderRadius);
    }, []);

    const updateCSSVariables = (primaryColor: string, activeColor: string, borderRadius: number) => {
        document.documentElement.style.setProperty('--primary-color', primaryColor);
        document.documentElement.style.setProperty('--active-color', activeColor);
        document.documentElement.style.setProperty('--border-radius', `${borderRadius}px`);
    };

    const updateTheme = (newPrimaryColor: string, newActiveColor: string, newBorderRadius: number) => {
        setPrimaryColor(newPrimaryColor);
        setActiveColor(newActiveColor);
        setBorderRadius(newBorderRadius);

        // 更新CSS变量
        updateCSSVariables(newPrimaryColor, newActiveColor, newBorderRadius);
    };

    return (
        <ThemeContext.Provider value={{
            primaryColor,
            activeColor,
            borderRadius,
            updateTheme
        }}>
            {children}
        </ThemeContext.Provider>
    );
};