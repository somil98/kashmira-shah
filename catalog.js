// Product data will be loaded from JSON
let catalogProducts = [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load products from JSON file
    loadProductsFromJSON();
    
    // Initialize filters
    initFilters();
    
    // Add floating WhatsApp button
    addFloatingWhatsApp();
});

// Load products from JSON file
async function loadProductsFromJSON() {
    try {
        const response = await fetch('products.json');
        const data = await response.json();
        catalogProducts = data.products;
        
        // Load all products after data is loaded
        loadCatalogProducts('all');
    } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to empty array if JSON fails to load
        catalogProducts = [];
        loadCatalogProducts('all');
    }
}

// Load catalog products based on filter
function loadCatalogProducts(filter = 'all') {
    const catalogGrid = document.getElementById('catalogGrid');
    if (!catalogGrid) return;
    
    let filteredProducts = catalogProducts;
    if (filter !== 'all') {
        filteredProducts = catalogProducts.filter(product => product.category === filter);
    }
    
    catalogGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">
                    <span class="price-original">₹${product.originalPrice}</span>
                    <span class="price-discounted">₹${product.discountedPrice}</span>
                </div>
                <p class="product-qty">Available: ${product.quantity} pieces</p>
                <div class="product-actions">
                    <a href="https://wa.me/+919876543210?text=Hi%20Kashmira,%20I'm%20interested%20in%20${encodeURIComponent(product.name)}%20(₹${product.discountedPrice})" 
                       class="btn btn-whatsapp" target="_blank">
                        <i class="fab fa-whatsapp"></i> WhatsApp Me
                    </a>
                </div>
            </div>
        </div>
    `).join('');
    
    // Update product count
    updateProductCount(filteredProducts.length);
}

// Initialize filter buttons
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value and load products
            const filter = this.getAttribute('data-filter');
            loadCatalogProducts(filter);
        });
    });
}

// Update product count display
function updateProductCount(count) {
    const catalogHeader = document.querySelector('.catalog-header p');
    if (catalogHeader) {
        catalogHeader.textContent = `Showing ${count} products from our Ektra by Srithai Superware collection`;
    }
}

// Add floating WhatsApp button
function addFloatingWhatsApp() {
    const floatingButton = document.createElement('a');
    floatingButton.href = `https://wa.me/+919876543210?text=Hi%20Kashmira,%20I'm%20interested%20in%20your%20crockery%20products`;
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