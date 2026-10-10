import React from 'react'

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'btn'

  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-dark',
    outline: 'btn-outline',
    ghost: 'bg-transparent text-[var(--gold-600)] hover:bg-[var(--cream-100)]'
  }

  const sizes = {
    small: 'h-8 px-3 text-xs',
    medium: '',
    large: 'btn-lg'
  }

  return (
    <button
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
        ${loading ? 'opacity-70 cursor-wait' : ''}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  )
}

export default Button