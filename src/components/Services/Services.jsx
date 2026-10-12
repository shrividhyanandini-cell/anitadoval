import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { useFirestore } from '../../hooks/useFirestore'
import { Star, Home, Hash, Hand, Heart } from 'lucide-react'
import Loading from '../UI/Loading'

const Services = () => {
  const { isHindi } = useLanguage()
  const { documents: services, loading } = useFirestore('services')
  const validServices = services.filter(s => s.type !== 'guide' && !s.id.includes('_config') && s.id !== 'global_theme' && s.id !== 'cta_config' && s.id !== 'faq_config' && Boolean(s.title && s.title.trim()))

  // Default services agar Firebase me koi data na ho
  const defaultServices = [
    {
      id: '1',
      title: isHindi ? 'ज्योतिष शास्त्र' : 'Astrology',
      description: isHindi
        ? 'जन्म कुंडली विश्लेषण, ग्रह दोष निवारण, भविष्यवाणी और जीवन मार्गदर्शन'
        : 'Birth chart analysis, planetary remedies, predictions & life guidance',
      icon: 'star'
    },
    {
      id: '2',
      title: isHindi ? 'वास्तु शास्त्र' : 'Vastu Shastra',
      description: isHindi
        ? 'घर, ऑफिस और व्यवसाय स्थल के लिए वास्तु समाधान और सुधार'
        : 'Vastu solutions for home, office & business premises',
      icon: 'home'
    },
    {
      id: '3',
      title: isHindi ? 'अंकशास्त्र' : 'Numerology',
      description: isHindi
        ? 'अंकों के रहस्यों से जीवन की दिशा और उद्देश्य का पता लगाएं'
        : 'Discover life purpose and direction through numbers',
      icon: 'hash'
    },
    {
      id: '4',
      title: isHindi ? 'हस्तरेखा शास्त्र' : 'Palmistry',
      description: isHindi
        ? 'हाथ की रेखाओं से भविष्य और व्यक्तित्व का विश्लेषण'
        : 'Personality and future analysis through palm lines',
      icon: 'hand'
    },
    {
      id: '5',
      title: isHindi ? 'आध्यात्मिक परामर्श' : 'Spiritual Counseling',
      description: isHindi
        ? 'मानसिक शांति और आध्यात्मिक विकास के लिए मार्गदर्शन'
        : 'Guidance for mental peace and spiritual growth',
      icon: 'heart'
    }
  ]

  // Icon mapping function
  const getIconComponent = (iconName) => {
    const icons = {
      star: Star,
      home: Home,
      hash: Hash,
      hand: Hand,
      heart: Heart
    }
    const IconComponent = icons[iconName] || Star
    return <IconComponent className="w-8 h-8" />
  }

  // Display services from Firebase or default
  const displayServices = validServices.length > 0 ? validServices : defaultServices

  // Handle Learn More click
  const handleLearnMore = (service) => {
    // Scroll to services page or show modal
    window.location.href = '/services'
  }

  if (loading) {
    return (
      <section id="services" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              {isHindi ? 'मेरी सेवाएं' : 'My Services'}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {isHindi
                ? '22+ वर्षों के अनुभव के साथ सम्पूर्ण ज्योतिषीय समाधान'
                : 'Complete astrological solutions with 22+ years of expertise'
              }
            </p>
          </div>
          <div className="flex justify-center">
            <Loading type="dots" text={isHindi ? 'सेवाएं लोड हो रही हैं...' : 'Loading services...'} />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="services" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            {isHindi ? 'मेरी सेवाएं' : 'My Services'}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {isHindi
              ? '22+ वर्षों के अनुभव के साथ सम्पूर्ण ज्योतिषीय समाधान'
              : 'Complete astrological solutions with 22+ years of expertise'
            }
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayServices.slice(0, 6).map((service, index) => (
            <div
              key={service.id || index}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer"
              onClick={() => handleLearnMore(service)}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-gold-500 rounded-full flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                {getIconComponent(service.icon)}
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {service.description}
              </p>
              <div className="mt-6 text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors flex items-center space-x-1">
                <span>{isHindi ? 'और जानें' : 'Learn More'}</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>

        {/* View All Services Button */}
        {displayServices.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={() => window.location.href = '/services'}
              className="btn btn-primary shadow-sm"
            >
              {isHindi ? 'सभी सेवाएं देखें' : 'View All Services'}
            </button>
          </div>
        )}

        {/* Empty State - Agar koi service nahi hai */}
        {displayServices.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              {isHindi ? 'सेवाएं जल्द ही आ रही हैं' : 'Services Coming Soon'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {isHindi
                ? 'हमारी विशेषज्ञ सेवाएं जल्द ही उपलब्ध होंगी। संपर्क करके और जानकारी प्राप्त करें।'
                : 'Our expert services will be available soon. Contact us for more information.'
              }
            </p>
            <button
              onClick={() => window.location.href = '/contact'}
              className="btn btn-primary mt-6"
            >
              {isHindi ? 'संपर्क करें' : 'Contact Us'}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default Services