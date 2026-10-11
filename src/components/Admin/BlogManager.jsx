import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { useFirestore } from '../../hooks/useFirestore'
import { uploadToCloudinary } from '../../utils/cloudinary'
import { contentBlocksToText, textToContentBlocks } from '../../utils/blogAdapter'
import { Plus, Edit, Trash2, Image, Save, X, ExternalLink, Sparkles } from 'lucide-react'
import Button from '../UI/Button'
import Loading from '../UI/Loading'

const BlogManager = () => {
    const { isHindi } = useLanguage()
    const { documents: blogs, addDocument, updateDocument, deleteDocument, loading } = useFirestore('blogs')
    const [editingBlog, setEditingBlog] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [uploading, setUploading] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        category: 'Astrology',
        author: 'Anita Doval',
        readTimeMinutes: 5,
        publishedAt: new Date().toISOString().split('T')[0],
        status: 'draft',
        enabled: true,
        imageUrl: '',
        imageAlt: '',
        content: '',
        metaTitle: '',
        metaDescription: ''
    })

    const slugify = (text) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const finalSlug = formData.slug.trim() || slugify(formData.title)
        // Convert text content to structured block array
        const structuredBlocks = textToContentBlocks(formData.content)

        const payload = {
            title: formData.title,
            slug: finalSlug,
            excerpt: formData.excerpt,
            category: formData.category,
            author: formData.author || 'Anita Doval',
            readTimeMinutes: Number(formData.readTimeMinutes) || 5,
            publishedAt: formData.publishedAt || new Date().toISOString(),
            status: formData.status || 'draft',
            enabled: formData.enabled !== false,
            imageUrl: formData.imageUrl,
            featuredImage: {
                url: formData.imageUrl,
                alt: formData.imageAlt || formData.title
            },
            content: structuredBlocks,
            seo: {
                metaTitle: formData.metaTitle || formData.title,
                metaDescription: formData.metaDescription || formData.excerpt
            },
            updatedAt: new Date()
        }

        if (editingBlog) {
            await updateDocument(editingBlog.id, payload)
        } else {
            await addDocument({
                ...payload,
                createdAt: new Date()
            })
        }

        resetForm()
    }

    const handleEdit = (blog) => {
        setEditingBlog(blog)

        // Convert existing blocks or string content to text for the editor
        const textContent = contentBlocksToText(blog.content)

        setFormData({
            title: blog.title || '',
            slug: blog.slug || '',
            excerpt: blog.excerpt || '',
            category: blog.category || 'Astrology',
            author: blog.author || 'Anita Doval',
            readTimeMinutes: blog.readTimeMinutes || 5,
            publishedAt: blog.publishedAt ? new Date(blog.publishedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            status: blog.status || 'draft',
            enabled: blog.enabled !== false,
            imageUrl: blog.featuredImage?.url || blog.imageUrl || '',
            imageAlt: blog.featuredImage?.alt || blog.title || '',
            content: textContent,
            metaTitle: blog.seo?.metaTitle || '',
            metaDescription: blog.seo?.metaDescription || ''
        })
        setShowForm(true)
    }

    const handleToggleStatus = async (blog) => {
        const nextStatus = blog.status === 'published' ? 'draft' : 'published'
        await updateDocument(blog.id, {
            status: nextStatus,
            updatedAt: new Date()
        })
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
            slug: '',
            excerpt: '',
            category: 'Astrology',
            author: 'Anita Doval',
            readTimeMinutes: 5,
            publishedAt: new Date().toISOString().split('T')[0],
            status: 'draft',
            enabled: true,
            imageUrl: '',
            imageAlt: '',
            content: '',
            metaTitle: '',
            metaDescription: ''
        })
        setEditingBlog(null)
        setShowForm(false)
    }

    const categories = [
        { value: 'Astrology', label: 'Astrology' },
        { value: 'Vastu', label: 'Vastu' },
        { value: 'Numerology', label: 'Numerology' },
        { value: 'Palmistry', label: 'Palmistry' },
        { value: 'Spirituality', label: 'Spirituality' }
    ]

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        {isHindi ? 'ब्लॉग प्रबंधन' : 'Blog & Editorial Manager'}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                        Manage articles, rich content blocks, and SEO metadata. Only published articles appear on the public website.
                    </p>
                </div>
                {!showForm && (
                    <Button
                        onClick={() => setShowForm(true)}
                        className="flex items-center space-x-2 bg-[#A67828] hover:bg-[#8C641C] text-white"
                    >
                        <Plus className="w-4 h-4" />
                        <span>{isHindi ? 'नया ब्लॉग' : 'New Article'}</span>
                    </Button>
                )}
            </div>

            {/* Blog Form */}
            {showForm && (
                <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-200">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">
                            {editingBlog ? (isHindi ? 'ब्लॉग संपादित करें' : 'Edit Article') : (isHindi ? 'नया ब्लॉग' : 'Create Article')}
                        </h3>
                        <button
                            onClick={resetForm}
                            className="text-gray-400 hover:text-gray-600 p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    {isHindi ? 'शीर्षक' : 'Article Title'} *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => {
                                        const newTitle = e.target.value
                                        setFormData(prev => ({
                                            ...prev,
                                            title: newTitle,
                                            slug: prev.slug ? prev.slug : slugify(newTitle)
                                        }))
                                    }}
                                    required
                                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-[#A67828]"
                                    placeholder="e.g. Understanding Your Birth Chart: A Vedic Perspective"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Slug / URL Identifier *
                                </label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData(prev => ({ ...prev, slug: slugify(e.target.value) }))}
                                    required
                                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-800 font-mono text-sm focus:ring-2 focus:ring-[#A67828]"
                                    placeholder="understanding-your-birth-chart"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                {isHindi ? 'संक्षेप' : 'Excerpt / Short Summary'} *
                            </label>
                            <textarea
                                value={formData.excerpt}
                                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                                rows="2"
                                required
                                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-[#A67828]"
                                placeholder="A compelling 1-2 sentence overview for cards and meta descriptions..."
                            />
                        </div>

                        <div className="grid md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    {isHindi ? 'विषय' : 'Category'}
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 font-medium"
                                >
                                    {categories.map(cat => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Author</label>
                                <input
                                    type="text"
                                    value={formData.author}
                                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Read Time (Mins)</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.readTimeMinutes}
                                    onChange={(e) => setFormData(prev => ({ ...prev, readTimeMinutes: parseInt(e.target.value) || 1 }))}
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

                        {/* Image Fields */}
                        <div className="grid md:grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    {isHindi ? 'छवि URL' : 'Featured Image URL'}
                                </label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                                        placeholder="https://... or upload"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="blog-image"
                                    />
                                    <label
                                        htmlFor="blog-image"
                                        className="inline-flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 text-sm font-medium"
                                    >
                                        <Image className="w-4 h-4" />
                                        <span>{uploading ? '...' : 'Upload'}</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Image Alt Text</label>
                                <input
                                    type="text"
                                    value={formData.imageAlt}
                                    onChange={(e) => setFormData(prev => ({ ...prev, imageAlt: e.target.value }))}
                                    placeholder="Descriptive image alt text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                                />
                            </div>
                        </div>

                        {/* Detailed Content */}
                        <div className="pt-2 border-t border-gray-200">
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-semibold text-gray-700">
                                    {isHindi ? 'विस्तृत सामग्री' : 'Article Content'} *
                                </label>
                                <span className="text-xs text-gray-500">Supports markdown headings (## Heading) & paragraphs.</span>
                            </div>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                required
                                rows="12"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 font-mono text-sm leading-relaxed focus:ring-2 focus:ring-[#A67828]"
                                placeholder="Write article content here. Use ## for section headings, separate paragraphs with blank lines."
                            />
                        </div>

                        {/* SEO Fields */}
                        <div className="pt-2 border-t border-gray-200">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">SEO Metadata (Optional)</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Meta Title</label>
                                    <input
                                        type="text"
                                        value={formData.metaTitle}
                                        onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                                        placeholder="Defaults to article title"
                                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Meta Description</label>
                                    <input
                                        type="text"
                                        value={formData.metaDescription}
                                        onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                                        placeholder="Defaults to excerpt"
                                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                            <Button type="button" variant="outline" onClick={resetForm}>
                                {isHindi ? 'रद्द करें' : 'Cancel'}
                            </Button>
                            <Button type="submit" className="bg-[#A67828] hover:bg-[#8C641C] text-white flex items-center space-x-2">
                                <Save className="w-4 h-4 mr-1" />
                                <span>{editingBlog ? (isHindi ? 'अपडेट करें' : 'Update Article') : (isHindi ? 'सेव करें' : 'Save Article')}</span>
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
                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        {isHindi ? 'अभी तक कोई ब्लॉग नहीं' : 'No articles yet. Click "New Article" or import from System Backup.'}
                    </div>
                ) : (
                    blogs.map(blog => {
                        const imageSrc = blog.featuredImage?.url || blog.imageUrl
                        return (
                            <div key={blog.id} className="bg-gray-50/70 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gray-200 hover:bg-white transition-all">
                                <div className="flex items-center space-x-4 flex-1 min-w-0">
                                    {imageSrc ? (
                                        <img src={imageSrc} alt="" className="w-16 h-16 object-cover rounded-lg shrink-0 border border-gray-200" />
                                    ) : (
                                        <div className="w-16 h-16 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold shrink-0">
                                            AD
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-gray-200 text-gray-700">
                                                {blog.category || 'Article'}
                                            </span>
                                            <button
                                                onClick={() => handleToggleStatus(blog)}
                                                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider cursor-pointer transition-colors ${blog.status === 'published' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-amber-500 text-white hover:bg-amber-600'}`}
                                                title="Click to toggle Draft / Published"
                                            >
                                                {blog.status === 'published' ? 'Published' : 'Draft'}
                                            </button>
                                            {blog.enabled === false && (
                                                <span className="bg-gray-400 text-white text-[11px] font-bold px-2 py-0.5 rounded uppercase">
                                                    Disabled
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="font-semibold text-gray-900 truncate text-base">{blog.title}</h4>
                                        <p className="text-xs text-gray-500 truncate mt-0.5">
                                            {blog.author || 'Anita Doval'} • {blog.readTimeMinutes || 5} min read • slug: <span className="font-mono text-gray-600">{blog.slug || blog.id}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                                    <a
                                        href={`/blog/${blog.slug || blog.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 text-gray-500 hover:text-[#A67828] hover:bg-amber-50 rounded-lg transition-colors"
                                        title="View Article"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                    <button
                                        onClick={() => handleEdit(blog)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(blog.id)}
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

export default BlogManager