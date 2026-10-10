import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { useFirestore } from '../../hooks/useFirestore'
import { uploadToCloudinary } from '../../utils/cloudinary'
import { Plus, Edit, Trash2, Image, Save, X } from 'lucide-react'
import Button from '../UI/Button'
import Loading from '../UI/Loading'

const BlogManager = () => {
 const { isHindi } = useLanguage()
 const { documents: blogs, addDocument, updateDocument, deleteDocument, loading } = useFirestore('blogs')
 const [editingBlog, setEditingBlog] = useState(null)
 const [showForm, setShowForm] = useState(false)
 const [formData, setFormData] = useState({
 title: '',
 content: '',
 excerpt: '',
 category: 'astrology',
 imageUrl: ''
 })
 const [uploading, setUploading] = useState(false)

 const handleSubmit = async (e) => {
 e.preventDefault()
 
 if (editingBlog) {
 await updateDocument(editingBlog.id, {
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

 const handleEdit = (blog) => {
 setEditingBlog(blog)
 setFormData({
 title: blog.title || '',
 content: blog.content || '',
 excerpt: blog.excerpt || '',
 category: blog.category || 'astrology',
 imageUrl: blog.imageUrl || ''
 })
 setShowForm(true)
 }

 const handleDelete = async (blogId) => {
 if (window.confirm(isHindi ? 'क्या आप वाकई इस ब्लॉग को हटाना चाहते हैं?' : 'Are you sure you want to delete this blog?')) {
 await deleteDocument(blogId)
 }
 }

 const handleImageUpload = async (e) => {
 const file = e.target.files[0]
 if (!file) return

 setUploading(true)
 const result = await uploadToCloudinary(file, 'anita-doval/blogs')
 
 if (result.success) {
 setFormData(prev => ({ ...prev, imageUrl: result.url }))
 } else {
 alert(isHindi ? 'छवि अपलोड विफल' : 'Image upload failed')
 }
 setUploading(false)
 }

 const resetForm = () => {
 setFormData({
 title: '',
 content: '',
 excerpt: '',
 category: 'astrology',
 imageUrl: ''
 })
 setEditingBlog(null)
 setShowForm(false)
 }

 const categories = [
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
 {isHindi ? 'ब्लॉग प्रबंधन' : 'Blog Management'}
 </h2>
 <Button
 onClick={() => setShowForm(true)}
 className="flex items-center space-x-2"
 >
 <Plus className="w-4 h-4" />
 <span>{isHindi ? 'नया ब्लॉग' : 'New Blog'}</span>
 </Button>
 </div>

 {/* Blog Form */}
 {showForm && (
 <div className="bg-gray-50 rounded-xl p-6 mb-6">
 <div className="flex items-center justify-between mb-4">
 <h3 className="text-lg font-semibold text-gray-800 ">
 {editingBlog ? (isHindi ? 'ब्लॉग संपादित करें' : 'Edit Blog') : (isHindi ? 'नया ब्लॉग' : 'New Blog')}
 </h3>
 <button
 onClick={resetForm}
 className="text-gray-400 hover:text-gray-600"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 <form onSubmit={handleSubmit} className="space-y-4">
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
 {isHindi ? 'शीर्षक' : 'Title'} *
 </label>
 <input
 type="text"
 value={formData.title}
 onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
 required
 className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 "
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
 {isHindi ? 'संक्षेप' : 'Excerpt'}
 </label>
 <textarea
 value={formData.excerpt}
 onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
 rows="2"
 className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 "
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
 {isHindi ? 'विषय' : 'Category'}
 </label>
 <select
 value={formData.category}
 onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
 className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 "
 >
 {categories.map(cat => (
 <option key={cat.value} value={cat.value}>{cat.label}</option>
 ))}
 </select>
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
 {isHindi ? 'छवि' : 'Image'}
 </label>
 <div className="flex items-center space-x-4">
 <input
 type="file"
 accept="image/*"
 onChange={handleImageUpload}
 className="hidden"
 id="blog-image"
 />
 <label
 htmlFor="blog-image"
 className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
 >
 <Image className="w-4 h-4" />
 <span>{uploading ? (isHindi ? 'अपलोड हो रहा...' : 'Uploading...') : (isHindi ? 'छवि चुनें' : 'Choose Image')}</span>
 </label>
 {formData.imageUrl && (
 <img src={formData.imageUrl} alt="Preview" className="w-16 h-16 object-cover rounded" />
 )}
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
 {isHindi ? 'विस्तृत सामग्री' : 'Detailed Content'} *
 </label>
 <textarea
 value={formData.content}
 onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
 required
 rows="6"
 className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 "
 />
 </div>

 <div className="flex space-x-3">
 <Button type="submit" className="flex items-center space-x-2">
 <Save className="w-4 h-4" />
 <span>{editingBlog ? (isHindi ? 'अपडेट करें' : 'Update') : (isHindi ? 'सेव करें' : 'Save')}</span>
 </Button>
 <Button type="button" variant="outline" onClick={resetForm}>
 {isHindi ? 'रद्द करें' : 'Cancel'}
 </Button>
 </div>
 </form>
 </div>
 )}

 {/* Blogs List */}
 <div className="space-y-4">
 {loading ? (
 <Loading type="dots" text={isHindi ? 'ब्लॉग लोड हो रहे हैं...' : 'Loading blogs...'} />
 ) : blogs.length === 0 ? (
 <div className="text-center py-8 text-gray-500 ">
 {isHindi ? 'अभी तक कोई ब्लॉग नहीं' : 'No blogs yet'}
 </div>
 ) : (
 blogs.map(blog => (
 <div key={blog.id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
 <div className="flex items-center space-x-4">
 {blog.imageUrl && (
 <img src={blog.imageUrl} alt={blog.title} className="w-16 h-16 object-cover rounded" />
 )}
 <div>
 <h4 className="font-semibold text-gray-800 ">{blog.title}</h4>
 <p className="text-sm text-gray-600 ">
 {categories.find(cat => cat.value === blog.category)?.label} • 
 {blog.createdAt?.toDate?.().toLocaleDateString()}
 </p>
 </div>
 </div>
 <div className="flex space-x-2">
 <button
 onClick={() => handleEdit(blog)}
 className="p-2 text-blue-600 hover:bg-blue-50 rounded"
 >
 <Edit className="w-4 h-4" />
 </button>
 <button
 onClick={() => handleDelete(blog.id)}
 className="p-2 text-red-600 hover:bg-red-50 rounded"
 >
 <Trash2 className="w-4 h-4" />
 </button>
 </div>
 </div>
 ))
 )}
 </div>
 </div>
 )
}

export default BlogManager