import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import './App.css';

function App() {
  // Handle GitHub Pages routing (404.html redirect)
  useEffect(() => {
    // Check if we're on GitHub Pages and need to handle the query parameter redirect
    const path = window.location.pathname;
    if (path.includes('/?/')) {
      const newPath = path.split('/?/')[1].replace(/~and~/g, '&');
      window.history.replaceState({}, '', newPath);
    }
  }, []);

  useEffect(() => {
    // Add floating WhatsApp button
    const floatingButton = document.createElement('a');
    floatingButton.href = 'https://wa.me/+919653323093?text=Hi%20Kashmira,%20I\'m%20interested%20in%20your%20crockery%20products';
    floatingButton.target = '_blank';
    floatingButton.rel = 'noopener noreferrer';
    floatingButton.className = 'floating-whatsapp';
    floatingButton.innerHTML = '<i class="fab fa-whatsapp"></i>';
    floatingButton.title = 'Chat with us on WhatsApp';
    
    document.body.appendChild(floatingButton);

    // Navbar scroll effect
    const handleScroll = () => {
      const header = document.querySelector('.header');
      if (header) {
        if (window.scrollY > 100) {
          header.style.background = 'rgba(255, 255, 255, 0.98)';
          header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
          header.style.background = 'rgba(255, 255, 255, 0.95)';
          header.style.boxShadow = 'none';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Cleanup floating button if component unmounts
      const existingButton = document.querySelector('.floating-whatsapp');
      if (existingButton) {
        existingButton.remove();
      }
    };
  }, []);

  return (
    <Router basename="/kashmira-shah">
      <div className="App">
        {/* Trust Banner - Shows on all pages */}
        <div className="trust-banner">
          <span><i className="fas fa-star"></i> 10+ Years Experience</span>
          <span><i className="fas fa-check-circle"></i> Authentic Ektra Products</span>
          <span><i className="fas fa-truck"></i> Pan-India Delivery</span>
        </div>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
