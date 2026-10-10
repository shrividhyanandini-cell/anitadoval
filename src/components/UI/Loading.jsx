import React from 'react'
import { useLanguage } from '../../context/LanguageContext'

const Loading = ({ type = 'spinner', text = '' }) => {
  const { isHindi } = useLanguage()

  const defaultText = isHindi ? 'लोड हो रहा है...' : 'Loading...'

  if (type === 'spinner') {
    return (
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <p className="text-gray-600 dark:text-gray-300">{text || defaultText}</p>
      </div>
    )
  }

  if (type === 'dots') {
    return (
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="flex space-x-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
        <p className="text-gray-600 dark:text-gray-300">{text || defaultText}</p>
      </div>
    )
  }

  return null
}

export default Loading