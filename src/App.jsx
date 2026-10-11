import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'
import { PopupProvider } from './context/PopupContext'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import FloatingWhatsApp from './components/FloatingWhatsApp/FloatingWhatsApp'
import InquiryModal from './components/InquiryModal/InquiryModal'
import Home from './pages/Home/Home'
import About from './pages/About/About'
import ServicesPage from './pages/Services/ServicesPage'
import BlogPage from './pages/Blog/BlogPage'
import BlogDetailPage from './pages/Blog/BlogDetailPage'
import Contact from './pages/Contact/Contact'
import AdminPage from './pages/Admin/AdminPage'
import DigitalBrochure from './pages/Brochures/DigitalBrochure'
import ConnectPage from './pages/Connect/ConnectPage'
import Preloader from './components/UI/Preloader'

function AppContent() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--cream-50)', color: 'var(--charcoal-800)' }}>
      <Preloader />
      {!isAdmin && <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/connect" element={<ConnectPage />} />
          <Route path="/brochure/:type" element={<DigitalBrochure />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/login" element={<AdminPage />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <FloatingWhatsApp />}
      {!isAdmin && <InquiryModal />}
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <PopupProvider>
          <Router>
            <AppContent />
          </Router>
        </PopupProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App