import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { useFirestore } from '../../hooks/useFirestore'
import { uploadToCloudinary } from '../../utils/cloudinary'
import { Plus, Edit, Trash2, Video, Star, Save, X } from 'lucide-react'
import Button from '../UI/Button'
import Loading from '../UI/Loading'

const TestimonialsManager = () => {
 const { isHindi } = useLanguage()
 const { documents: testimonials, addDocument, updateDocument, deleteDocument, loading } = useFirestore('testimonials')
 const [editingTestimonial, setEditingTestimonial] = useState(null)
 const [showForm, setShowForm] = useState(false)
 const [formData, setFormData] = useState({
 clientName: '',
 message: '',
 rating: 5,
 service: 'astrology',
 videoUrl: '',
 thumbnail: ''
 })
 const [uploading, setUploading] = useState(false)

 const handleSubmit = async (e) => {
 e.preventDefault()
 
 if (editingTestimonial) {
 await updateDocument(editingTestimonial.id, {
 ...formData,
 updatedAt: new Date()
 })
 } else {
 await addDocument({
 ...formData,
 createdAt: new Date(),
 updatedAt: new Date()
 })
 }
 
 resetForm()
 }

 const handleVideoUpload = async (e) => {
 const file = e.target.files[0]
 if (!file) return

 setUploading(true)
 const result = await uploadToCloudinary(file, 'anita-doval/testimonials')
 
 if (result.success) {
 setFormData(prev => ({ ...prev, videoUrl: result.url }))
 } else {
 alert(isHindi ? 'वीडियो अपलोड विफल' : 'Video upload failed')
 }
 setUploading(false)
 }

 const resetForm = () => {
 setFormData({
 clientName: '',
 message: '',
 rating: 5,
 service: 'astrology',
 videoUrl: '',
 thumbnail: ''
 })
 setEditingTestimonial(null)
 setShowForm(false)
 }

 const services = [
 { value: 'astrology', label: isHindi ? 'ज्योतिष' : 'Astrology' },
 { value: 'vastu', label: isHindi ? 'वास्तु' : 'Vastu' },
 { value: 'numerology', label: isHindi ? 'अंकशास्त्र' : 'Numerology' },
 { value: 'palmistry', label: isHindi ? 'हस्तरेखा' : 'Palmistry' },
 { value: 'spiritual', label: isHindi ? 'आध्यात्मिक' : 'Spiritual' }
 ]

 return (
 <div className="bg-white rounded-2xl shadow-lg p-6">
 <div className="flex items-center justify-between mb-6">
 <h2 className="text-2xl font-bold text-gray-800 ">
 {isHindi ? 'प्रशंसापत्र प्रबंधन' : 'Testimonials Management'}
 </h2>
 <Button
 onClick={() => setShowForm(true)}
 className="flex items-center space-x-2"
 >
 <Plus className="w-4 h-4" />
 <span>{isHindi ? 'नया प्रशंसापत्र' : 'New Testimonial'}</span>
 </Button>
 </div>

 {/* Testimonial Form */}
 {showForm && (
 <div className="bg-gray-50 rounded-xl p-6 mb-6">
 <div className="flex items-center justify-between mb-4">
 <h3 className="text-lg font-semibold text-gray-800 ">
 {editingTestimonial ? (isHindi ? 'प्रशंसापत्र संपादित करें' : 'Edit Testimonial') : (isHindi ? 'नया प्रशंसापत्र' : 'New Testimonial')}
 </h3>
 <button
 onClick={resetForm}
 className="text-gray-400 hover:text-gray-600"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 <form onSubmit={handleSubmit} className="space-y-4">
 <div className="grid md:grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
 {isHindi ? 'ग्राहक का नाम' : 'Client Name'} *
 </label>
 <input
 type="text"
 value={formData.clientName}
 onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
 required
 className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 "
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
 {isHindi ? 'रेटिंग' : 'Rating'}
 </label>
 <div className="flex items-center space-x-2">
 {[1, 2, 3, 4, 5].map(star => (
 <button
 key={star}
 type="button"
 onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
 className="p-1"
 >
 <Star
 className={`w-6 h-6 ${
 star <= formData.rating
 ? 'fill-gold-500 text-gold-500'
 : 'text-gray-300'
 }`}
 />
 </button>
 ))}
 </div>
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
 {isHindi ? 'सेवा' : 'Service'}
 </label>
 <select
 value={formData.service}
 onChange={(e) => setFormData(prev => ({ ...prev, service: e.target.value }))}
 className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 "
 >
 {services.map(service => (
 <option key={service.value} value={service.value}>{service.label}</option>
 ))}
 </select>
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
 {isHindi ? 'वीडियो' : 'Video'}
 </label>
 <div className="flex items-center space-x-4">
 <input
 type="file"
 accept="video/*"
 onChange={handleVideoUpload}
 className="hidden"
 id="testimonial-video"
 />
 <label
 htmlFor="testimonial-video"
 className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
 >
 <Video className="w-4 h-4" />
 <span>{uploading ? (isHindi ? 'अपलोड हो रहा...' : 'Uploading...') : (isHindi ? 'वीडियो चुनें' : 'Choose Video')}</span>
 </label>
 {formData.videoUrl && (
 <video src={formData.videoUrl} className="w-32 h-20 object-cover rounded" controls />
 )}
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
 {isHindi ? 'संदेश' : 'Message'} *
 </label>
 <textarea
 value={formData.message}
 onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
 required
 rows="4"
 className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 "
 placeholder={isHindi ? 'ग्राहक की प्रतिक्रिया...' : 'Client feedback...'}
 />
 </div>

 <div className="flex space-x-3">
 <Button type="submit" className="flex items-center space-x-2">
 <Save className="w-4 h-4" />
 <span>{editingTestimonial ? (isHindi ? 'अपडेट करें' : 'Update') : (isHindi ? 'सेव करें' : 'Save')}</span>
 </Button>
 <Button type="button" variant="outline" onClick={resetForm}>
 {isHindi ? 'रद्द करें' : 'Cancel'}
 </Button>
 </div>
 </form>
 </div>
 )}

 {/* Testimonials List */}
 <div className="space-y-4">
 {loading ? (
 <Loading type="dots" text={isHindi ? 'प्रशंसापत्र लोड हो रहे हैं...' : 'Loading testimonials...'} />
 ) : testimonials.length === 0 ? (
 <div className="text-center py-8 text-gray-500 ">
 {isHindi ? 'अभी तक कोई प्रशंसापत्र नहीं' : 'No testimonials yet'}
 </div>
 ) : (
 testimonials.map(testimonial => (
 <div key={testimonial.id} className="bg-gray-50 rounded-lg p-4">
 <div className="flex items-center justify-between mb-3">
 <div className="flex items-center space-x-3">
 <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-gold-500 rounded-full flex items-center justify-center text-white font-bold">
 {testimonial.clientName?.charAt(0) || 'C'}
 </div>
 <div>
 <h4 className="font-semibold text-gray-800 ">
 {testimonial.clientName}
 </h4>
 <p className="text-sm text-gray-600 ">
 {services.find(s => s.value === testimonial.service)?.label}
 </p>
 </div>
 </div>
 <div className="flex items-center space-x-2">
 <div className="flex">
 {[1, 2, 3, 4, 5].map(star => (
 <Star
 key={star}
 className={`w-4 h-4 ${
 star <= testimonial.rating
 ? 'fill-gold-500 text-gold-500'
 : 'text-gray-300'
 }`}
 />
 ))}
 </div>
 <div className="flex space-x-2">
 <button
 onClick={() => {
 setEditingTestimonial(testimonial)
 setFormData({
 clientName: testimonial.clientName || '',
 message: testimonial.message || '',
 rating: testimonial.rating || 5,
 service: testimonial.service || 'astrology',
 videoUrl: testimonial.videoUrl || '',
 thumbnail: testimonial.thumbnail || ''
 })
 setShowForm(true)
 }}
 className="p-2 text-blue-600 hover:bg-blue-50 rounded"
 >
 <Edit className="w-4 h-4" />
 </button>
 <button
 onClick={() => handleDelete(testimonial.id)}
 className="p-2 text-red-600 hover:bg-red-50 rounded"
 >
 <Trash2 className="w-4 h-4" />
 </button>
 </div>
 </div>
 </div>
 <p className="text-gray-600 text-sm">
 {testimonial.message}
 </p>
 {testimonial.videoUrl && (
 <div className="mt-3">
 <video src={testimonial.videoUrl} className="w-full max-w-xs rounded" controls />
 </div>
 )}
 </div>
 ))
 )}
 </div>
 </div>
 )
}

export default TestimonialsManager