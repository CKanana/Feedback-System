
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('virtualPayTheme');
    return savedTheme || 'light';
  });

  useEffect(() => {
    localStorage.setItem('virtualPayTheme', theme);
    
    // Update CSS variables based on theme
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.style.setProperty('--background', '222.2 84% 4.9%');
      root.style.setProperty('--foreground', '210 40% 98%');
      root.style.setProperty('--card', '222.2 84% 8%');
      root.style.setProperty('--card-foreground', '210 40% 98%');
      root.style.setProperty('--primary', '281 83% 29%'); // Purple #81134b
      root.style.setProperty('--primary-foreground', '210 40% 98%');
      root.style.setProperty('--secondary', '38 92% 50%'); // Orange #f59e24
      root.style.setProperty('--secondary-foreground', '222.2 47.4% 11.2%');
      root.style.setProperty('--muted', '217.2 32.6% 17.5%');
      root.style.setProperty('--muted-foreground', '215 20.2% 65.1%');
      root.style.setProperty('--accent', '217.2 32.6% 17.5%');
      root.style.setProperty('--accent-foreground', '210 40% 98%');
      root.style.setProperty('--border', '217.2 32.6% 17.5%');
      root.style.setProperty('--input', '217.2 32.6% 17.5%');
    } else {
      root.style.setProperty('--background', '0 0% 100%');
      root.style.setProperty('--foreground', '222.2 84% 4.9%');
      root.style.setProperty('--card', '0 0% 100%');
      root.style.setProperty('--card-foreground', '222.2 84% 4.9%');
      root.style.setProperty('--primary', '281 83% 29%'); // Purple #81134b
      root.style.setProperty('--primary-foreground', '210 40% 98%');
      root.style.setProperty('--secondary', '38 92% 50%'); // Orange #f59e24
      root.style.setProperty('--secondary-foreground', '222.2 47.4% 11.2%');
      root.style.setProperty('--muted', '210 40% 96.1%');
      root.style.setProperty('--muted-foreground', '215.4 16.3% 46.9%');
      root.style.setProperty('--accent', '210 40% 96.1%');
      root.style.setProperty('--accent-foreground', '222.2 47.4% 11.2%');
      root.style.setProperty('--border', '214.3 31.8% 91.4%');
      root.style.setProperty('--input', '214.3 31.8% 91.4%');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
