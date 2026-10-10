import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { Quote, Heart, Target, Sparkles } from 'lucide-react'

const MyPhilosophy = () => {
  const { isHindi } = useLanguage()

  return (
    <section className="py-20 bg-gradient-to-r from-primary-50 to-gold-50 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Quote className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-white dark:text-white mb-4">
            {isHindi ? 'मेरा दर्शन' : 'My Philosophy'}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              {isHindi ? 'सही समय' : 'Right Timing'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {isHindi 
                ? 'हर कार्य का एक सही समय होता है। ज्योतिष के माध्यम से आप उस सही समय की पहचान कर सकते हैं।'
                : 'Every action has its right timing. Through astrology, you can identify that perfect moment for success.'
              }
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-gold-100 dark:bg-gold-900 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-gold-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              {isHindi ? 'उचित मार्गदर्शन' : 'Proper Guidance'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {isHindi 
                ? 'सही मार्गदर्शन के बिना यात्रा अधूरी है। मैं आपको जीवन के हर मोड़ पर सही दिशा दिखाती हूं।'
                : 'A journey without proper guidance is incomplete. I provide you the right direction at every turn of life.'
              }
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              {isHindi ? 'भाग्य निर्माता' : 'Architect of Destiny'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {isHindi 
                ? 'मनुष्य अपने भाग्य का निर्माता स्वयं है। मैं आपको उस शक्ति से परिचित कराती हूं जो आपके भीतर है।'
                : 'Man is the architect of his own destiny. I help you discover the power that lies within you.'
              }
            </p>
          </div>
        </div>

        {/* Main Quote */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border-l-4 border-primary-600">
          <p className="text-2xl text-center text-gray-800 dark:text-white italic leading-relaxed">
            {isHindi 
              ? '"मनुष्य अपने भाग्य का निर्माता स्वयं है। सही समय और उचित मार्गदर्शन भाग्य में परिवर्तन ला सकता है।"'
              : '"Man is the architect of his own destiny. Right timing and proper guidance can bring about a change in one\'s fate."'
            }
          </p>
          <p className="text-center text-primary-600 font-semibold mt-4">- Anita Doval</p>
        </div>
      </div>
    </section>
  )
}

export default MyPhilosophy