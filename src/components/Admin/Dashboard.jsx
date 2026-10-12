import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../context/LanguageContext'
import { useFirestore } from '../../hooks/useFirestore'
import BlogManager from './BlogManager'
import TestimonialsManager from './TestimonialsManager'
import ServicesManager from './ServicesManager'
import MediaManager from './MediaManager'
import MessagesManager from './MessagesManager'
import FAQManager from './FAQManager'
import CTAManager from './CTAManager'
import HeroManager from './HeroManager'
import AboutManager from './AboutManager'
import PhilosophyManager from './PhilosophyManager'
import GuidesManager from './GuidesManager'
import ProcessManager from './ProcessManager'
import ThemeCustomizer from './ThemeCustomizer'
import SettingsManager from './SettingsManager'
import PageHeadersManager from './PageHeadersManager'
import BackupManager from './BackupManager'
import VideoLibraryManager from './VideoLibraryManager'
import ConnectLinksManager from './ConnectLinksManager'
import { Book, BookOpen, Video, Settings, Image as ImageIcon, LogOut, Users, Mail, LayoutTemplate, UserCircle, Layers, Search, Bell, Menu, Anchor, PaintBucket, Link as LinkIcon, ImagePlus, Database, Film } from 'lucide-react'
import Button from '../UI/Button'

const Dashboard = () => {
    const { user, logout } = useAuth()
    const { isHindi } = useLanguage()
    const { documents: blogs } = useFirestore('blogs')
    const { documents: testimonials } = useFirestore('testimonials')
    const { documents: contactMessages } = useFirestore('contactMessages')
    const { documents: services } = useFirestore('services')

    const [activeTab, setActiveTab] = useState('dashboard')

    const handleLogout = async () => {
        await logout()
    }

    const overviewItems = [
        { id: 'dashboard', label: isHindi ? 'डैशबोर्ड' : 'Dashboard', icon: Settings },
        { id: 'theme', label: 'Theme Customizer', icon: PaintBucket },
        { id: 'settings', label: 'Global Contact Settings', icon: LinkIcon },
        { id: 'pageHeaders', label: 'Page Headers (Breadcrumbs)', icon: ImagePlus },
        { id: 'backup', label: 'System Backup & Sync', icon: Database },
    ]

    const storefrontItems = [
        { id: 'hero', label: isHindi ? 'हीरो अनुभाग' : 'Hero Banner', icon: LayoutTemplate },
        { id: 'about', label: isHindi ? 'हमारे बारे में' : 'About Section', icon: UserCircle },
        { id: 'philosophy', label: isHindi ? 'दर्शन' : 'Philosophy', icon: Layers },
        { id: 'process', label: isHindi ? 'परामर्श प्रक्रिया' : 'Consultation Process', icon: Anchor },
        { id: 'guides', label: isHindi ? 'परामर्श गाइड' : 'Guides Section', icon: BookOpen },
        { id: 'videoLibrary', label: isHindi ? 'वीडियो लाइब्रेरी' : 'Video Library', icon: Film },
        { id: 'connectLinks', label: isHindi ? 'कनेक्ट पेज लिंक्स (QR)' : 'Connect & QR Hub Links', icon: LinkIcon },
        { id: 'faq', label: 'FAQ', icon: Settings },
        { id: 'cta', label: 'Bottom CTA', icon: Book },
    ]

    const contentItems = [
        { id: 'blogs', label: isHindi ? 'ब्लॉग' : 'Blogs', icon: Book },
        { id: 'testimonials', label: isHindi ? 'प्रशंसापत्र' : 'Testimonials', icon: Video },
        { id: 'services', label: isHindi ? 'सेवाएं' : 'Services', icon: Users },
        { id: 'media', label: isHindi ? 'मीडिया' : 'Media', icon: ImageIcon },
        { id: 'messages', label: isHindi ? 'संदेश' : 'Messages', icon: Mail }
    ]

    const renderContent = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        switch (activeTab) {
            case 'dashboard': return <DashboardContent />
            case 'theme': return <ThemeCustomizer />
            case 'settings': return <SettingsManager />
            case 'pageHeaders': return <PageHeadersManager />
            case 'backup': return <BackupManager />
            case 'hero': return <HeroManager />
            case 'about': return <AboutManager />
            case 'philosophy': return <PhilosophyManager />
            case 'process': return <ProcessManager />
            case 'guides': return <GuidesManager />
            case 'videoLibrary': return <VideoLibraryManager />
            case 'connectLinks': return <ConnectLinksManager />
            case 'faq': return <FAQManager />
            case 'cta': return <CTAManager />
            case 'blogs': return <BlogManager />
            case 'testimonials': return <TestimonialsManager />
            case 'services': return <ServicesManager />
            case 'media': return <MediaManager />
            case 'messages': return <MessagesManager />
            default: return <DashboardContent />
        }
    }

    useEffect(() => {
        const handleTabChange = (event) => {
            setActiveTab(event.detail)
        }
        window.addEventListener('changeTab', handleTabChange)
        return () => window.removeEventListener('changeTab', handleTabChange)
    }, [])

    const renderMenuItem = (item) => (
        <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 min-h-[44px] rounded-xl transition-all duration-300 border ${activeTab === item.id
                ? 'bg-blue-50/70 border-blue-100 text-blue-700 shadow-sm'
                : 'bg-transparent border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
        >
            <item.icon className="w-[18px] h-[18px]" strokeWidth={activeTab === item.id ? 2.5 : 2} />
            <span className={`font-sans tracking-wide text-[14px] ${activeTab === item.id ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
        </button>
    )

    return (
        <div className="min-h-screen bg-[#F4F7FE] font-sans text-gray-800 flex">
            {/* Sidebar */}
            <div className="fixed left-0 top-0 h-full w-[280px] bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-40 border-r border-gray-100 flex flex-col justify-between">
                <div>
                    <div className="p-6 mb-2">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(37,99,235,0.25)]">
                                <span className="text-white font-bold text-lg leading-none">M</span>
                            </div>
                            <div>
                                <h1 className="font-bold text-gray-900 text-xl tracking-tight leading-none">Master Admin</h1>
                            </div>
                        </div>
                    </div>

                    <nav className="px-4 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)] hide-scrollbar">
                        <div>
                            <div className="text-[14px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-4">Overview</div>
                            <div className="space-y-1">
                                {overviewItems.map(renderMenuItem)}
                            </div>
                        </div>

                        <div>
                            <div className="text-[14px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-4">Storefront Sections</div>
                            <div className="space-y-1">
                                {storefrontItems.map(renderMenuItem)}
                            </div>
                        </div>

                        <div>
                            <div className="text-[14px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-4">Content & Data</div>
                            <div className="space-y-1">
                                {contentItems.map(renderMenuItem)}
                            </div>
                        </div>
                    </nav>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <UserCircle className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">Anita Doval</p>
                                <p className="text-sm text-gray-500 font-medium">Administrator</p>
                            </div>
                        </div>
                    </div>
                    <Button onClick={handleLogout} variant="outline" className="w-full flex items-center justify-center gap-2 border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 shadow-sm py-2.5">
                        <LogOut className="w-4 h-4" />
                        <span className="font-semibold text-[14px]">{isHindi ? 'लॉग आउट' : 'Logout'}</span>
                    </Button>
                </div>
            </div>

            {/* Main Wrapper */}
            <div className="flex-1 ml-[280px] flex flex-col min-h-screen relative">
                {/* Topbar */}
                <header className="sticky top-0 z-30 bg-[#F4F7FE]/80 backdrop-blur-md border-b border-gray-200/50 px-8 py-5 flex items-center justify-between">
                    <div className="relative w-full max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-[18px] w-[18px] text-gray-400" />
                        </div>
                        <input type="text" className="w-full pl-11 pr-4 py-2.5 bg-white border-none rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.03)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium text-gray-700 placeholder-gray-400 transition-all" placeholder="Search exactly what you need..." />
                    </div>
                    <div className="flex items-center space-x-5">
                        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 p-8">
                    <div className="max-w-[1400px] mx-auto w-full">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    )
}

// Dashboard Content Component
const DashboardContent = () => {
    const { isHindi } = useLanguage()
    const { documents: blogs } = useFirestore('blogs')
    const { documents: testimonials } = useFirestore('testimonials')
    const { documents: contactMessages } = useFirestore('contactMessages')
    const { documents: services } = useFirestore('services')

    const stats = [
        {
            label: isHindi ? 'कुल ब्लॉग' : 'Total Articles',
            value: blogs.length,
            icon: Book,
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            label: isHindi ? 'प्रशंसापत्र' : 'Client Reviews',
            value: testimonials.length,
            icon: Video,
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-500'
        },
        {
            label: isHindi ? 'सेवाएं' : 'Active Services',
            value: services.filter(s => s.id !== 'hero_config' && s.id !== 'about_config' && s.id !== 'philosophy_config').length || 5,
            icon: Users,
            bgColor: 'bg-green-50',
            textColor: 'text-green-600'
        },
        {
            label: isHindi ? 'संदेश' : 'New Inquiries',
            value: contactMessages.length,
            icon: Mail,
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600'
        }
    ]

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[28px] font-bold text-gray-900 mb-1 tracking-tight">
                        {isHindi ? 'विवरण' : 'Overview'}
                    </h1>
                    <p className="text-gray-500 font-medium text-[15px]">
                        {isHindi
                            ? 'वेबसाइट सामग्री प्रबंधन और विश्लेषण'
                            : 'Website content management and analytics'
                        }
                    </p>
                </div>
                <div className="text-sm font-semibold text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-200">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-[20px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex items-center justify-between group hover:-translate-y-1 transition-transform duration-300">
                        <div>
                            <p className="text-[14px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                                {stat.label}
                            </p>
                            <p className="text-[32px] font-black text-gray-800 leading-none">
                                {stat.value}
                            </p>
                        </div>
                        <div className={`w-14 h-14 ${stat.bgColor} rounded-2xl flex items-center justify-center transition-colors`}>
                            <stat.icon className={`w-7 h-7 ${stat.textColor}`} strokeWidth={2.5} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-[24px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100">
                    <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                        <h3 className="text-[18px] font-bold text-gray-800">
                            {isHindi ? 'हाल की गतिविधि' : 'Recent Articles'}
                        </h3>
                        <button onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'blogs' }))} className="text-sm text-blue-600 font-semibold hover:text-blue-800">View All</button>
                    </div>
                    <div className="space-y-5">
                        {blogs.slice(0, 4).map((blog, i) => (
                            <div key={blog.id} className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg">
                                    {i + 1}
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800 text-[15px] leading-tight mb-1">{blog.title}</p>
                                    <p className="text-[14px] font-medium text-gray-500">
                                        {blog.createdAt?.toDate?.().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                                <button className="px-4 py-1.5 bg-gray-100 text-gray-600 font-semibold text-sm rounded-lg hover:bg-gray-200">Edit</button>
                            </div>
                        ))}
                        {blogs.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <Book className="w-8 h-8 text-gray-300 mb-2" />
                                <p className="text-gray-500 font-medium">
                                    {isHindi ? 'अभी तक कोई गतिविधि नहीं' : 'No recent articles found'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100">
                    <h3 className="text-[18px] font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">
                        {isHindi ? 'त्वरित कार्य' : 'Quick Actions'}
                    </h3>
                    <div className="space-y-4">
                        <button
                            onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'blogs' }))}
                            className="w-full text-left p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all group"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Book className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <span className="block text-gray-800 font-semibold text-[15px]">{isHindi ? 'नया ब्लॉग जोड़ें' : 'Add New Blog'}</span>
                                    <span className="block text-gray-500 text-sm font-medium mt-0.5">Publish an article</span>
                                </div>
                            </div>
                        </button>
                        <button
                            onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'testimonials' }))}
                            className="w-full text-left p-4 bg-white border border-gray-200 rounded-xl hover:border-orange-400 hover:shadow-md transition-all group"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Video className="w-5 h-5 text-orange-500" />
                                </div>
                                <div>
                                    <span className="block text-gray-800 font-semibold text-[15px]">{isHindi ? 'प्रशंसापत्र जोड़ें' : 'Add Testimonial'}</span>
                                    <span className="block text-gray-500 text-sm font-medium mt-0.5">Upload client feedback</span>
                                </div>
                            </div>
                        </button>
                        <button
                            onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'services' }))}
                            className="w-full text-left p-4 bg-white border border-gray-200 rounded-xl hover:border-green-400 hover:shadow-md transition-all group"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Users className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <span className="block text-gray-800 font-semibold text-[15px]">{isHindi ? 'सेवा प्रबंधित करें' : 'Manage Services'}</span>
                                    <span className="block text-gray-500 text-sm font-medium mt-0.5">Update catalog</span>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Dashboard