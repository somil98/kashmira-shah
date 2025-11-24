import { useState } from 'react';
import QuantitySelector from './QuantitySelector';
import WhatsAppButton from './WhatsAppButton';
import ImageGallery from './ImageGallery';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [showAddedFeedback, setShowAddedFeedback] = useState(false);
  
  const { addToCart, isInCart, getCartQuantity } = useCart();

  // Calculate discount percentage
  const discountPercent = product.mrp > 0 && product.mrp > product.sellingPrice 
    ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100) 
    : 0;
  
  // Calculate savings per unit
  const savingsPerUnit = product.mrp > product.sellingPrice ? product.mrp - product.sellingPrice : 0;
  
  // Calculate total price based on quantity
  const totalPrice = product.sellingPrice * quantity;
  const totalSavings = savingsPerUnit * quantity;
  
  // Check if low stock (5 or fewer)
  const isLowStock = product.quantity <= 5 && product.quantity > 0;
  
  // Check if item is already in cart
  const inCart = isInCart(product.id);
  const cartQuantity = getCartQuantity(product.id);

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setShowAddedFeedback(true);
    setTimeout(() => setShowAddedFeedback(false), 1500);
    // Reset quantity selector after adding
    setQuantity(1);
  };

  return (
    <div className={`product-card ${inCart ? 'in-cart' : ''}`}>
      {/* In Cart Indicator */}
      {inCart && (
        <span className="in-cart-badge">
          <i className="fas fa-check"></i> In Selection ({cartQuantity})
        </span>
      )}
      
      {/* Discount Badge */}
      {discountPercent > 0 && (
        <span className="discount-badge">-{discountPercent}% OFF</span>
      )}
      
      <div className="product-image">
        <ImageGallery 
          folderName={product.imageFolder} 
          productName={product.name}
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        {product.description && (
          <p className="product-description">{product.description}</p>
        )}
        <div className="product-price">
          {product.mrp > 0 && product.mrp > product.sellingPrice && (
            <span className="price-original">₹{product.mrp}</span>
          )}
          <span className="price-discounted">₹{product.sellingPrice}</span>
          {savingsPerUnit > 0 && (
            <span className="savings-text">Save ₹{savingsPerUnit}</span>
          )}
        </div>
        
        {/* Total Price - Shows when quantity > 1 */}
        {quantity > 1 && (
          <div className="product-total">
            <span className="total-label">Total ({quantity} items):</span>
            <span className="total-price">₹{totalPrice.toLocaleString('en-IN')}</span>
            {totalSavings > 0 && (
              <span className="total-savings">You save ₹{totalSavings.toLocaleString('en-IN')}</span>
            )}
          </div>
        )}
        {product.setOf && (
          <p className="product-set">Set of {product.setOf}</p>
        )}
        
        {/* Low Stock Alert */}
        {isLowStock ? (
          <p className="low-stock">
            <i className="fas fa-fire"></i> Only {product.quantity} left!
          </p>
        ) : (
          <p className="product-qty">Available: {product.quantity} pieces</p>
        )}
        
        <div className="product-actions">
          <QuantitySelector 
            maxQuantity={product.quantity} 
            value={quantity}
            onChange={handleQuantityChange}
          />
          
          <div className="product-buttons">
            <button 
              className={`btn btn-add-cart ${showAddedFeedback ? 'added' : ''}`}
              onClick={handleAddToCart}
              disabled={product.quantity === 0}
            >
              {showAddedFeedback ? (
                <>
                  <i className="fas fa-check"></i> Added!
                </>
              ) : (
                <>
                  <i className="fas fa-plus"></i> Add to Selection
                </>
              )}
            </button>
            <WhatsAppButton product={product} quantity={quantity} />
          </div>
        </div>
      </div>
    </div>
  );
}
