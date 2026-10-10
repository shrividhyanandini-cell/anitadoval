import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { useFirestore } from '../../hooks/useFirestore'
import { Mail, User, Phone, Calendar, Trash2, Eye } from 'lucide-react'
import Loading from '../UI/Loading'

const MessagesManager = () => {
 const { isHindi } = useLanguage()
 const { documents: messages, deleteDocument, loading } = useFirestore('contactMessages')

 const handleDelete = async (messageId) => {
 if (window.confirm(isHindi ? 'क्या आप वाकई इस संदेश को हटाना चाहते हैं?' : 'Are you sure you want to delete this message?')) {
 await deleteDocument(messageId)
 }
 }

 const formatDate = (timestamp) => {
 if (!timestamp) return ''
 const date = timestamp.toDate()
 return new Intl.DateTimeFormat('en-IN', {
 day: 'numeric',
 month: 'short',
 year: 'numeric',
 hour: '2-digit',
 minute: '2-digit'
 }).format(date)
 }

 const services = {
 astrology: isHindi ? 'ज्योतिष' : 'Astrology',
 vastu: isHindi ? 'वास्तु' : 'Vastu', 
 numerology: isHindi ? 'अंकशास्त्र' : 'Numerology',
 palmistry: isHindi ? 'हस्तरेखा' : 'Palmistry',
 spiritual: isHindi ? 'आध्यात्मिक' : 'Spiritual'
 }

 return (
 <div className="bg-white rounded-2xl shadow-lg p-6">
 <div className="flex items-center justify-between mb-6">
 <h2 className="text-2xl font-bold text-gray-800 ">
 {isHindi ? 'संपर्क संदेश' : 'Contact Messages'}
 </h2>
 <div className="text-sm text-gray-600 ">
 {messages.length} {isHindi ? 'संदेश' : 'messages'}
 </div>
 </div>

 {loading ? (
 <Loading type="dots" text={isHindi ? 'संदेश लोड हो रहे हैं...' : 'Loading messages...'} />
 ) : messages.length === 0 ? (
 <div className="text-center py-12">
 <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
 <h3 className="text-lg font-semibold text-gray-600 mb-2">
 {isHindi ? 'कोई संदेश नहीं' : 'No Messages'}
 </h3>
 <p className="text-gray-500 ">
 {isHindi 
 ? 'अभी तक कोई संपर्क संदेश नहीं आया है' 
 : 'No contact messages received yet'
 }
 </p>
 </div>
 ) : (
 <div className="space-y-4">
 {messages.map(message => (
 <div key={message.id} className="bg-gray-50 rounded-lg p-6">
 <div className="flex items-start justify-between mb-4">
 <div className="flex items-center space-x-4">
 <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-gold-500 rounded-full flex items-center justify-center text-white">
 <User className="w-6 h-6" />
 </div>
 <div>
 <h3 className="font-semibold text-gray-800 ">
 {message.name}
 </h3>
 <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
 <div className="flex items-center space-x-1">
 <Mail className="w-3 h-3" />
 <span>{message.email}</span>
 </div>
 {message.phone && (
 <div className="flex items-center space-x-1">
 <Phone className="w-3 h-3" />
 <span>{message.phone}</span>
 </div>
 )}
 <div className="flex items-center space-x-1">
 <Calendar className="w-3 h-3" />
 <span>{formatDate(message.createdAt)}</span>
 </div>
 </div>
 </div>
 </div>
 <button
 onClick={() => handleDelete(message.id)}
 className="p-2 text-red-600 hover:bg-red-50 rounded"
 >
 <Trash2 className="w-4 h-4" />
 </button>
 </div>

 {message.service && (
 <div className="mb-3">
 <span className="inline-block px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm">
 {services[message.service] || message.service}
 </span>
 </div>
 )}

 <div className="bg-white rounded-lg p-4">
 <p className="text-gray-700 whitespace-pre-wrap">
 {message.message}
 </p>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 )
}

export default MessagesManager