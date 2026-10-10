import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { usePopup } from '../../context/PopupContext'
import { X, User, Mail, Phone, MessageCircle, ChevronDown } from 'lucide-react'

const Popup = () => {
  const { isHindi } = useLanguage()
  const { isPopupOpen, closePopup } = usePopup()
  const [showOtherInput, setShowOtherInput] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    otherService: '',
    message: ''
  })

  const services = [
    { value: 'astrology', label: isHindi ? 'ज्योतिष' : 'Astrology' },
    { value: 'vastu', label: isHindi ? 'वास्तु विज्ञान' : 'Vastu Science' },
    { value: 'numerology', label: isHindi ? 'अंकशास्त्र' : 'Numerology' },
    { value: 'palmistry', label: isHindi ? 'हस्तरेखा शास्त्र' : 'Palmistry' },
    { value: 'spiritual', label: isHindi ? 'आध्यात्मिक मार्गदर्शन' : 'Spiritual Guidance' },
    { value: 'mantra', label: isHindi ? 'मंत्र उपासना' : 'Mantra Upasana' },
    { value: 'yoga', label: isHindi ? 'योग और ध्यान' : 'Yog & Meditation' },
    { value: 'other', label: isHindi ? 'अन्य' : 'Other' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    if (name === 'service' && value === 'other') {
      setShowOtherInput(true)
    } else if (name === 'service') {
      setShowOtherInput(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('https://backend.anitadoval.com/send_email.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        alert(isHindi ? 'संदेश सफलतापूर्वक भेजा गया! हम जल्द ही आपसे संपर्क करेंगे।' : 'Message sent successfully! We will contact you soon.')
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          otherService: '',
          message: ''
        })
        closePopup()
      } else {
        throw new Error(result.message || 'Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert(isHindi 
        ? 'संदेश भेजने में त्रुटि हुई। कृपया सीधे contact@anitadoval.com पर ईमेल करें।' 
        : 'Error sending message. Please email us directly at contact@anitadoval.com.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: '',
      otherService: '',
      message: ''
    })
    setShowOtherInput(false)
    closePopup()
  }

  if (!isPopupOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full relative animate-scale-in">
        {/* Close Button */}
        <button
          onClick={resetForm}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors z-10"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-gold-500 rounded-t-2xl p-6 text-white">
          <h2 className="text-2xl font-bold text-center">
            {isHindi ? 'मुफ्त परामर्श' : 'Free Consultation'}
          </h2>
          <p className="text-center text-white/90 mt-2">
            {isHindi 
              ? 'अपनी समस्याओं का समाधान पाएं'
              : 'Get solutions to your problems'
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <User size={16} className="mr-2" />
              {isHindi ? 'पूरा नाम *' : 'Full Name *'}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              placeholder={isHindi ? 'अपना नाम दर्ज करें' : 'Enter your name'}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <Mail size={16} className="mr-2" />
              {isHindi ? 'ईमेल *' : 'Email *'}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              placeholder={isHindi ? 'अपना ईमेल दर्ज करें' : 'Enter your email'}
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <Phone size={16} className="mr-2" />
              {isHindi ? 'फोन नंबर *' : 'Phone Number *'}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              placeholder={isHindi ? 'अपना फोन नंबर दर्ज करें' : 'Enter your phone number'}
            />
          </div>

          {/* Service */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <MessageCircle size={16} className="mr-2" />
              {isHindi ? 'सेवा *' : 'Service *'}
            </label>
            <div className="relative">
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none transition-colors"
              >
                <option value="">{isHindi ? 'सेवा चुनें' : 'Select Service'}</option>
                {services.map(service => (
                  <option key={service.value} value={service.value}>
                    {service.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Other Service Input */}
          {showOtherInput && (
            <div className="space-y-2 animate-fade-in">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isHindi ? 'अन्य सेवा विवरण *' : 'Other Service Details *'}
              </label>
              <input
                type="text"
                name="otherService"
                value={formData.otherService}
                onChange={handleChange}
                required={showOtherInput}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                placeholder={isHindi ? 'अपनी सेवा का विवरण दर्ज करें' : 'Enter your service details'}
              />
            </div>
          )}

          {/* Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {isHindi ? 'संदेश' : 'Message'}
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors resize-none"
              placeholder={isHindi ? 'अपना संदेश दर्ज करें...' : 'Enter your message...'}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary-600 to-gold-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-primary-700 hover:to-gold-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading 
              ? (isHindi ? 'भेज रहा है...' : 'Sending...')
              : (isHindi ? 'संदेश भेजें' : 'Send Message')
            }
          </button>

          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            {isHindi 
              ? 'हम 24 घंटे के भीतर आपसे संपर्क करेंगे'
              : 'We will contact you within 24 hours'
            }
          </p>
        </form>
      </div>
    </div>
  )
}

export default Popup