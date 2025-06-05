
    import React, { createContext, useState, useContext, useEffect } from 'react';

    const ThemeContext = createContext();

    export const ThemeProvider = ({ children }) => {
      const [theme, setTheme] = useState(() => {
        const storedTheme = localStorage.getItem('aura-theme');
        return storedTheme ? storedTheme : 'light';
      });

      useEffect(() => {
        localStorage.setItem('aura-theme', theme);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
      }, [theme]);

      const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
      };

      return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
          {children}
        </ThemeContext.Provider>
      );
    };

    export const useTheme = () => useContext(ThemeContext);
  