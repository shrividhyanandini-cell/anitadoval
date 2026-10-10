import React, { createContext, useContext, useState, useEffect } from 'react'

const PopupContext = createContext()

export const usePopup = () => {
  const context = useContext(PopupContext)
  if (!context) throw new Error('usePopup must be used within a PopupProvider')
  return context
}

export const PopupProvider = ({ children }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [popupService, setPopupService] = useState(null)

  const openPopup = (serviceSlug = null) => {
    setPopupService(serviceSlug)
    setIsPopupOpen(true)
  }

  const closePopup = () => {
    setIsPopupOpen(false)
    setPopupService(null)
  }

  // Lock body scroll when popup is open
  useEffect(() => {
    if (isPopupOpen) {
      document.body.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
    }
    return () => document.body.classList.remove('modal-open')
  }, [isPopupOpen])

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && isPopupOpen) closePopup()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isPopupOpen])

  return (
    <PopupContext.Provider value={{ isPopupOpen, openPopup, closePopup, popupService }}>
      {children}
    </PopupContext.Provider>
  )
}