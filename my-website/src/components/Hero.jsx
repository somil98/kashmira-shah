import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section id="home" className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Elevate Your Dining Experience</h1>
            <p className="hero-subtitle">
              Premium Ektra Crockery • Factory-Direct Prices • Easy WhatsApp Ordering
            </p>
            
            {/* Guarantee Badges */}
            <div className="guarantee-badges">
              <div className="guarantee-badge highlight">
                <i className="fas fa-tag"></i>
                Lowest Price Guarantee
              </div>
              <div className="guarantee-badge">
                <i className="fas fa-award"></i>
                100% Genuine Products
              </div>
              <div className="guarantee-badge">
                <i className="fas fa-headset"></i>
                Personal Support
              </div>
            </div>

            <div className="hero-buttons">
              <Link to="/catalog" className="btn btn-primary">
                <i className="fas fa-th-large"></i> Browse Catalog
              </Link>
              <a 
                href="https://wa.me/+919653323093?text=Hi%20Kashmira,%20I'm%20interested%20in%20your%20crockery%20products" 
                className="btn btn-whatsapp" 
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-whatsapp"></i> WhatsApp Me
              </a>
            </div>

            {/* Urgency Element */}
            <div className="limited-offer">
              <i className="fas fa-fire"></i>
              Limited Stock Available – Order Before It's Gone!
            </div>
          </div>
        </div>
    </section>
  );
}
