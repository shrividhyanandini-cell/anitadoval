import React, { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
  const [isHindi, setIsHindi] = useState(false)

  useEffect(() => {
    const savedLang = localStorage.getItem('language')
    if (savedLang) {
      setIsHindi(savedLang === 'hindi')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('language', isHindi ? 'hindi' : 'english')
  }, [isHindi])

  const toggleLanguage = () => setIsHindi(!isHindi)

  const content = {
    // Common translations
    home: isHindi ? 'होम' : 'Home',
    about: isHindi ? 'परिचय' : 'About',
    services: isHindi ? 'सेवाएं' : 'Services',
    blog: isHindi ? 'ब्लॉग' : 'Blog',
    contact: isHindi ? 'संपर्क' : 'Contact',
    // Add more translations as needed
  }

  return (
    <LanguageContext.Provider value={{ isHindi, toggleLanguage, content }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)