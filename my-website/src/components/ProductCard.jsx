import { useState, useEffect } from 'react';
import QuantitySelector from './QuantitySelector';
import WhatsAppButton from './WhatsAppButton';

export default function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [imageSrc, setImageSrc] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Construct image path - try first image in folder
    // The actual file will be determined by the browser (handles 404 gracefully)
    const folderName = product.imageFolder;
    const imageExtensions = ['webp', 'jpg', 'jpeg', 'png', 'avif'];
    
    // Try to find image by attempting to load it
    const tryLoadImage = (path) => {
      const img = new Image();
      img.onload = () => {
        setImageSrc(path);
        setImageError(false);
      };
      img.onerror = () => {
        // Try next extension
        const currentExt = path.split('.').pop();
        const extIndex = imageExtensions.indexOf(currentExt.toLowerCase());
        if (extIndex < imageExtensions.length - 1) {
          const nextExt = imageExtensions[extIndex + 1];
          tryLoadImage(`/kashmira-shah/images/${folderName}/${folderName}_1.${nextExt}`);
        } else {
          // All extensions tried, show placeholder
          setImageError(true);
        }
      };
      img.src = path;
    };

    // Start with webp (most common)
    tryLoadImage(`/kashmira-shah/images/${folderName}/${folderName}_1.webp`);
  }, [product.imageFolder]);

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        {imageSrc && !imageError ? (
          <img 
            src={imageSrc} 
            alt={product.name} 
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="product-image-placeholder">
            <i className="fas fa-image"></i>
            <span>No Image</span>
          </div>
        )}
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
        </div>
        {product.setOf && (
          <p className="product-set">Set of {product.setOf}</p>
        )}
        <p className="product-qty">Available: {product.quantity} pieces</p>
        <div className="product-actions">
          <QuantitySelector 
            maxQuantity={product.quantity} 
            value={quantity}
            onChange={handleQuantityChange}
          />
          <WhatsAppButton product={product} quantity={quantity} />
        </div>
      </div>
    </div>
  );
}

