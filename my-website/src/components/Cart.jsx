import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getTotalSavings,
    generateWhatsAppMessage
  } = useCart();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const totalSavings = getTotalSavings();

  const handleSendWhatsApp = () => {
    const url = generateWhatsAppMessage();
    if (url) {
      window.open(url, '_blank');
    }
  };

  // Don't show if cart is empty
  if (totalItems === 0) return null;

  return (
    <>
      {/* Mobile Bottom Bar */}
      {isMobile && (
        <div className={`cart-mobile-bar ${isCartOpen ? 'expanded' : ''}`}>
          <div 
            className="cart-mobile-summary"
            onClick={() => setIsCartOpen(!isCartOpen)}
          >
            <div className="cart-summary-left">
              <div className="cart-icon-badge">
                <i className="fas fa-shopping-bag"></i>
                <span className="cart-badge">{totalItems}</span>
              </div>
              <div className="cart-summary-text">
                <span className="cart-summary-items">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
                <span className="cart-summary-price">₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="cart-summary-right">
              <span className="cart-expand-text">{isCartOpen ? 'Close' : 'View Cart'}</span>
              <i className={`fas fa-chevron-${isCartOpen ? 'down' : 'up'}`}></i>
            </div>
          </div>

          {/* Expanded Cart Panel */}
          <div className={`cart-mobile-panel ${isCartOpen ? 'open' : ''}`}>
            <div className="cart-panel-header">
              <h3>Your Selection</h3>
              <button className="cart-clear-btn" onClick={clearCart}>
                <i className="fas fa-trash-alt"></i> Clear All
              </button>
            </div>

            <div className="cart-items-list">
              {cartItems.map(({ product, quantity }) => (
                <CartItem 
                  key={product.id}
                  product={product}
                  quantity={quantity}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>

            <div className="cart-panel-footer">
              {totalSavings > 0 && (
                <div className="cart-savings">
                  <i className="fas fa-tag"></i>
                  You're saving ₹{totalSavings.toLocaleString('en-IN')}!
                </div>
              )}
              <button 
                className="btn btn-whatsapp cart-checkout-btn"
                onClick={handleSendWhatsApp}
              >
                <i className="fab fa-whatsapp"></i>
                Send Order via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Side Drawer */}
      {!isMobile && (
        <>
          {/* Floating Cart Button */}
          <button 
            className="cart-floating-btn"
            onClick={() => setIsCartOpen(true)}
          >
            <i className="fas fa-shopping-bag"></i>
            <span className="cart-floating-badge">{totalItems}</span>
          </button>

          {/* Overlay */}
          <div 
            className={`cart-overlay ${isCartOpen ? 'visible' : ''}`}
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer */}
          <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
            <div className="cart-drawer-header">
              <h2>
                <i className="fas fa-shopping-bag"></i>
                Your Selection
              </h2>
              <button 
                className="cart-close-btn"
                onClick={() => setIsCartOpen(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="cart-drawer-content">
              <div className="cart-items-count">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} selected
                <button className="cart-clear-link" onClick={clearCart}>
                  Clear all
                </button>
              </div>

              <div className="cart-items-list">
                {cartItems.map(({ product, quantity }) => (
                  <CartItem 
                    key={product.id}
                    product={product}
                    quantity={quantity}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>
            </div>

            <div className="cart-drawer-footer">
              {totalSavings > 0 && (
                <div className="cart-savings-desktop">
                  <i className="fas fa-tag"></i>
                  <span>Total Savings</span>
                  <strong>₹{totalSavings.toLocaleString('en-IN')}</strong>
                </div>
              )}
              
              <div className="cart-total-desktop">
                <span>Total Amount</span>
                <strong>₹{totalPrice.toLocaleString('en-IN')}</strong>
              </div>

              <button 
                className="btn btn-whatsapp cart-checkout-btn-desktop"
                onClick={handleSendWhatsApp}
              >
                <i className="fab fa-whatsapp"></i>
                Send Order via WhatsApp
              </button>
              
              <p className="cart-disclaimer">
                <i className="fas fa-info-circle"></i>
                Click to open WhatsApp with your order details
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}

// Cart Item Component
function CartItem({ product, quantity, onUpdateQuantity, onRemove }) {
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    const folderName = product.imageFolder;
    const imageExtensions = ['webp', 'jpg', 'jpeg', 'png', 'avif'];
    
    const tryLoadImage = (path) => {
      const img = new Image();
      img.onload = () => setImageSrc(path);
      img.onerror = () => {
        const currentExt = path.split('.').pop();
        const extIndex = imageExtensions.indexOf(currentExt.toLowerCase());
        if (extIndex < imageExtensions.length - 1) {
          const nextExt = imageExtensions[extIndex + 1];
          tryLoadImage(`/images/${folderName}/${folderName}_1.${nextExt}`);
        }
      };
      img.src = path;
    };

    tryLoadImage(`/images/${folderName}/${folderName}_1.webp`);
  }, [product.imageFolder]);

  const itemTotal = product.sellingPrice * quantity;

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        {imageSrc ? (
          <img src={imageSrc} alt={product.name} />
        ) : (
          <div className="cart-item-placeholder">
            <i className="fas fa-image"></i>
          </div>
        )}
      </div>
      
      <div className="cart-item-details">
        <h4 className="cart-item-name">{product.name}</h4>
        <div className="cart-item-price">
          ₹{product.sellingPrice.toLocaleString('en-IN')} each
        </div>
        
        <div className="cart-item-controls">
          <div className="cart-qty-controls">
            <button 
              className="cart-qty-btn"
              onClick={() => onUpdateQuantity(product.id, Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <i className="fas fa-minus"></i>
            </button>
            <span className="cart-qty-value">{quantity}</span>
            <button 
              className="cart-qty-btn"
              onClick={() => onUpdateQuantity(product.id, Math.min(quantity + 1, product.quantity))}
              disabled={quantity >= product.quantity}
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
          
          <button 
            className="cart-remove-btn"
            onClick={() => onRemove(product.id)}
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
      
      <div className="cart-item-total">
        ₹{itemTotal.toLocaleString('en-IN')}
      </div>
    </div>
  );
}

