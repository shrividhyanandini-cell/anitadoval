import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Force Light Mode globally
    document.documentElement.classList.remove('dark')
    setIsDark(false)
    localStorage.setItem('theme', 'light')
  }, [])

  const toggleTheme = () => {
    // Disabled functionality, app is light mode only
  }

  const setTheme = (theme) => {
    // Disabled
  }

  return (
    <ThemeContext.Provider value={{
      isDark: false,
      toggleTheme,
      setTheme,
      theme: 'light'
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}