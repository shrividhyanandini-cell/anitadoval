import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { Award, Users, Clock, Shield, Star, Globe } from 'lucide-react'

const WhyChooseUs = () => {
  const { isHindi } = useLanguage()

  const features = [
    {
      icon: <Award className="w-8 h-8" />,
      title: isHindi ? '25+ वर्षों का अनुभव' : '25+ Years Experience',
      description: isHindi 
        ? 'ज्योतिष और वास्तु क्षेत्र में दो दशकों से अधिक का समृद्ध अनुभव'
        : 'Over two decades of rich experience in astrology and Vastu sciences'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: isHindi ? '5000+ संतुष्ट ग्राहक' : '5000+ Happy Clients',
      description: isHindi 
        ? 'विश्व भर में हजारों लोगों के जीवन में सकारात्मक परिवर्तन'
        : 'Positive transformations in thousands of lives across the globe'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: isHindi ? 'विश्वसनीय मार्गदर्शन' : 'Trusted Guidance',
      description: isHindi 
        ? 'प्रामाणिक और वैज्ञानिक दृष्टिकोण के साथ सटीक भविष्यवाणियाँ'
        : 'Accurate predictions with authentic and scientific approach'
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: isHindi ? '4.9/5 स्टार रेटिंग' : '4.9/5 Star Rating',
      description: isHindi 
        ? 'ग्राहकों द्वारा उत्कृष्ट सेवा और सटीकता के लिए उच्च रेटिंग'
        : 'High rating from clients for excellent service and accuracy'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: isHindi ? '22+ देशों में सेवा' : 'Service in 22+ Countries',
      description: isHindi 
        ? 'विश्व स्तर पर फैले ग्राहकों को ऑनलाइन और ऑफलाइन सेवाएं'
        : 'Online and offline services for clients spread globally'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: isHindi ? '24/7 समर्थन' : '24/7 Support',
      description: isHindi 
        ? 'किसी भी समय सहायता और मार्गदर्शन के लिए उपलब्धता'
        : 'Available for assistance and guidance anytime you need'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-l from-white to-gold-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white dark:text-white mb-4">
            {isHindi ? 'हमें क्यों चुनें?' : 'Why Choose Us?'}
          </h2>
          <p className="text-lg text-white dark:text-gray-300 max-w-2xl mx-auto">
            {isHindi 
              ? '25+ वर्षों का अनुभव, वैज्ञानिक दृष्टिकोण और हजारों सफलता की कहानियाँ'
              : '25+ years of experience, scientific approach, and thousands of success stories'
            }
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 border border-gray-100 dark:border-gray-700"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-gold-500 rounded-full flex items-center justify-center text-white mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs