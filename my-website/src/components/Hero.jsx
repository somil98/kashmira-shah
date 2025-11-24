import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">Premium Crockery Solutions</h1>
          <p className="hero-subtitle">
            Your trusted partner for quality crockery products with over 10 years of sales excellence
          </p>
          <div className="hero-buttons">
            <Link to="/catalog" className="btn btn-primary">
              View Catalog
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
        </div>
      </div>
    </section>
  );
}

