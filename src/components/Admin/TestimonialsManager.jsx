import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { useFirestore } from '../../hooks/useFirestore'
import { uploadToCloudinary } from '../../utils/cloudinary'
import { Plus, Edit, Trash2, Video, Star, Save, X, MapPin } from 'lucide-react'
import Button from '../UI/Button'
import Loading from '../UI/Loading'

const TestimonialsManager = () => {
    const { isHindi } = useLanguage()
    const { documents: testimonials, addDocument, updateDocument, deleteDocument, loading } = useFirestore('testimonials')
    const [editingTestimonial, setEditingTestimonial] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [uploading, setUploading] = useState(false)

    const [formData, setFormData] = useState({
        clientName: '',
        quote: '',
        serviceTaken: 'Vedic Horoscope Analysis',
        rating: 5,
        location: '',
        date: new Date().toISOString().split('T')[0],
        sortOrder: 0,
        status: 'draft',
        enabled: true,
        videoUrl: '',
        thumbnail: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()

        const payload = {
            clientName: formData.clientName,
            quote: formData.quote,
            message: formData.quote, // backwards compatibility
            serviceTaken: formData.serviceTaken,
            service: formData.serviceTaken, // backwards compatibility
            rating: Number(formData.rating) || 5,
            location: formData.location || '',
            date: formData.date || '',
            sortOrder: Number(formData.sortOrder) || 0,
            status: formData.status || 'draft',
            enabled: formData.enabled !== false,
            videoUrl: formData.videoUrl || '',
            thumbnail: formData.thumbnail || '',
            updatedAt: new Date()
        }

        if (editingTestimonial) {
            await updateDocument(editingTestimonial.id, payload)
        } else {
            await addDocument({
                ...payload,
                createdAt: new Date()
            })
        }

        resetForm()
    }

    const handleEdit = (testimonial) => {
        setEditingTestimonial(testimonial)
        setFormData({
            clientName: testimonial.clientName || '',
            quote: testimonial.quote || testimonial.message || '',
            serviceTaken: testimonial.serviceTaken || testimonial.service || 'Vedic Horoscope Analysis',
            rating: testimonial.rating || 5,
            location: testimonial.location || '',
            date: testimonial.date || new Date().toISOString().split('T')[0],
            sortOrder: testimonial.sortOrder || 0,
            status: testimonial.status || 'draft',
            enabled: testimonial.enabled !== false,
            videoUrl: testimonial.videoUrl || '',
            thumbnail: testimonial.thumbnail || ''
        })
        setShowForm(true)
    }

    const handleToggleStatus = async (testimonial) => {
        const nextStatus = testimonial.status === 'published' ? 'draft' : 'published'
        await updateDocument(testimonial.id, {
            status: nextStatus,
            updatedAt: new Date()
        })
    }

    const handleDelete = async (testimonialId) => {
        if (window.confirm(isHindi ? 'क्या आप वाकई इस प्रशंसापत्र को हटाना चाहते हैं?' : 'Are you sure you want to delete this testimonial?')) {
            await deleteDocument(testimonialId)
        }
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
            quote: '',
            serviceTaken: 'Vedic Horoscope Analysis',
            rating: 5,
            location: '',
            date: new Date().toISOString().split('T')[0],
            sortOrder: 0,
            status: 'draft',
            enabled: true,
            videoUrl: '',
            thumbnail: ''
        })
        setEditingTestimonial(null)
        setShowForm(false)
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        {isHindi ? 'प्रशंसापत्र प्रबंधन' : 'Testimonials & Reviews Manager'}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                        Manage client reviews and video testimonials. Only published testimonials appear on the storefront.
                    </p>
                </div>
                {!showForm && (
                    <Button
                        onClick={() => setShowForm(true)}
                        className="flex items-center space-x-2 bg-[#A67828] hover:bg-[#8C641C] text-white"
                    >
                        <Plus className="w-4 h-4" />
                        <span>{isHindi ? 'नया प्रशंसापत्र' : 'New Testimonial'}</span>
                    </Button>
                )}
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-200">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">
                            {editingTestimonial ? (isHindi ? 'प्रशंसापत्र संपादित करें' : 'Edit Testimonial') : (isHindi ? 'नया प्रशंसापत्र' : 'Create Testimonial')}
                        </h3>
                        <button
                            onClick={resetForm}
                            className="text-gray-400 hover:text-gray-600 p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    {isHindi ? 'ग्राहक का नाम' : 'Client Name'} *
                                </label>
                                <input
                                    type="text"
                                    value={formData.clientName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                                    required
                                    placeholder="e.g. Ramesh Sharma"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    {isHindi ? 'सेवा' : 'Service Taken'} *
                                </label>
                                <input
                                    type="text"
                                    value={formData.serviceTaken}
                                    onChange={(e) => setFormData(prev => ({ ...prev, serviceTaken: e.target.value }))}
                                    required
                                    placeholder="e.g. Vedic Horoscope Analysis"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    {isHindi ? 'रेटिंग' : 'Rating (1 - 5)'}
                                </label>
                                <div className="flex items-center space-x-2 pt-1">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                                            className="p-1 cursor-pointer"
                                        >
                                            <Star
                                                className={`w-6 h-6 ${star <= formData.rating
                                                    ? 'fill-[#D4AF37] text-[#D4AF37]'
                                                    : 'text-gray-300'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                    <span className="text-sm font-semibold text-gray-700 ml-2">({formData.rating}/5)</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                    placeholder="e.g. Mumbai, India"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Sort Order</label>
                                <input
                                    type="number"
                                    value={formData.sortOrder}
                                    onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Publish Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                    className={`w-full px-3 py-2 border rounded-lg font-semibold text-sm ${formData.status === 'published' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-yellow-50 text-yellow-800 border-yellow-200'}`}
                                >
                                    <option value="draft">Draft (Hidden)</option>
                                    <option value="published">Published (Live)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                {isHindi ? 'प्रशंसापत्र उद्धरण' : 'Testimonial Quote / Review'} *
                            </label>
                            <textarea
                                value={formData.quote}
                                onChange={(e) => setFormData(prev => ({ ...prev, quote: e.target.value }))}
                                required
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-[#A67828]"
                                placeholder="Client feedback and reflections..."
                            />
                        </div>

                        {/* Optional Video Support */}
                        <div className="pt-2 border-t border-gray-200">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                Video Testimonial (Optional)
                            </label>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={formData.videoUrl}
                                        onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                                        placeholder="Video URL or upload below"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                                    />
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={handleVideoUpload}
                                        className="hidden"
                                        id="testimonial-video"
                                    />
                                    <label
                                        htmlFor="testimonial-video"
                                        className="inline-flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 text-sm font-medium"
                                    >
                                        <Video className="w-4 h-4" />
                                        <span>{uploading ? '...' : 'Upload'}</span>
                                    </label>
                                </div>

                                <div>
                                    <input
                                        type="text"
                                        value={formData.thumbnail}
                                        onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                                        placeholder="Poster / Thumbnail image URL"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-200">
                            <Button type="button" variant="outline" onClick={resetForm}>
                                {isHindi ? 'रद्द करें' : 'Cancel'}
                            </Button>
                            <Button type="submit" className="bg-[#A67828] hover:bg-[#8C641C] text-white flex items-center space-x-2">
                                <Save className="w-4 h-4 mr-1" />
                                <span>{editingTestimonial ? (isHindi ? 'अपडेट करें' : 'Update Testimonial') : (isHindi ? 'सेव करें' : 'Save Testimonial')}</span>
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
                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        {isHindi ? 'अभी तक कोई प्रशंसापत्र नहीं' : 'No testimonials yet. Click "New Testimonial" or import from System Backup.'}
                    </div>
                ) : (
                    testimonials.map(testimonial => {
                        const quote = testimonial.quote || testimonial.message || ''
                        const service = testimonial.serviceTaken || testimonial.service || 'Vedic Astrology'
                        const rating = Number(testimonial.rating) || 5

                        return (
                            <div key={testimonial.id} className="bg-gray-50/70 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gray-200 hover:bg-white transition-all">
                                <div className="flex items-start space-x-4 flex-1 min-w-0">
                                    <div className="w-12 h-12 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center text-[#A67828] font-serif font-bold text-base shrink-0 mt-0.5">
                                        {testimonial.clientName?.charAt(0) || 'C'}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold text-gray-900 text-base">{testimonial.clientName}</h4>
                                            <button
                                                onClick={() => handleToggleStatus(testimonial)}
                                                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider cursor-pointer transition-colors ${testimonial.status === 'published' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-amber-500 text-white hover:bg-amber-600'}`}
                                                title="Click to toggle Draft / Published"
                                            >
                                                {testimonial.status === 'published' ? 'Published' : 'Draft'}
                                            </button>
                                            {testimonial.enabled === false && (
                                                <span className="bg-gray-400 text-white text-[11px] font-bold px-2 py-0.5 rounded uppercase">
                                                    Disabled
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-1">
                                            <span className="text-[#8C7A58] font-medium">{service}</span>
                                            {testimonial.location && <span>• {testimonial.location}</span>}
                                            {testimonial.date && <span>• {testimonial.date}</span>}
                                            <div className="flex items-center ml-2">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Star
                                                        key={star}
                                                        className={`w-3 h-3 ${star <= rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-200'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <p className="text-xs text-gray-600 line-clamp-2 italic">
                                            "{quote}"
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                                    <button
                                        onClick={() => handleEdit(testimonial)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(testimonial.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

export default TestimonialsManager