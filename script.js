// Product data will be loaded from JSON
let products = [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load products from JSON file
    loadProductsFromJSON();
    
    // Smooth scrolling for navigation links
    initSmoothScrolling();
    
    // Contact form handling
    initContactForm();
    
    // Add floating WhatsApp button
    addFloatingWhatsApp();
});

// Load products from JSON file
async function loadProductsFromJSON() {
    try {
        const response = await fetch('products.json');
        const data = await response.json();
        products = data.products;
        
        // Load featured products after data is loaded
        loadFeaturedProducts();
    } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to empty array if JSON fails to load
        products = [];
        loadFeaturedProducts();
    }
}

// Load featured products on homepage
function loadFeaturedProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    // Show first 4 products as featured
    const featuredProducts = products.slice(0, 4);
    
    productsGrid.innerHTML = featuredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">
                    <span class="price-original">₹${product.originalPrice}</span>
                    <span class="price-discounted">₹${product.discountedPrice}</span>
                </div>
                <p class="product-qty">Available: ${product.quantity} pieces</p>
                <a href="https://wa.me/+919876543210?text=Hi%20Kashmira,%20I'm%20interested%20in%20${encodeURIComponent(product.name)}%20(₹${product.discountedPrice})" 
                   class="btn btn-whatsapp" target="_blank">
                    <i class="fab fa-whatsapp"></i> WhatsApp Me
                </a>
            </div>
        </div>
    `).join('');
}

// Initialize smooth scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize contact form
function initContactForm() {
    const contactForm = document.querySelector('.contact-form form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;
        
        // Create WhatsApp message
        const whatsappMessage = `Hi Kashmira,\n\nName: ${name}\nEmail: ${email}\n\nMessage: ${message}`;
        const whatsappUrl = `https://wa.me/+919876543210?text=${encodeURIComponent(whatsappMessage)}`;
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Reset form
        this.reset();
        
        // Show success message
        alert('Thank you! Your message will be sent via WhatsApp.');
    });
}

// Add floating WhatsApp button
function addFloatingWhatsApp() {
    const floatingButton = document.createElement('a');
    floatingButton.href = 'https://wa.me/+919876543210?text=Hi%20Kashmira,%20I'm%20interested%20in%20your%20crockery%20products';
    floatingButton.target = '_blank';
    floatingButton.className = 'floating-whatsapp';
    floatingButton.innerHTML = '<i class="fab fa-whatsapp"></i>';
    floatingButton.title = 'Chat with us on WhatsApp';
    
    document.body.appendChild(floatingButton);
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});