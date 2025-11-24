import { useState } from 'react';

export default function QuantitySelector({ maxQuantity, value, onChange }) {
  const [quantity, setQuantity] = useState(value || 1);

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      onChange(newQty);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      const newQty = quantity + 1;
      setQuantity(newQty);
      onChange(newQty);
    }
  };

  const handleInputChange = (e) => {
    const val = parseInt(e.target.value) || 1;
    const clampedVal = Math.max(1, Math.min(maxQuantity, val));
    setQuantity(clampedVal);
    onChange(clampedVal);
  };

  return (
    <div className="quantity-selector">
      <label htmlFor={`qty-${value}`}>Quantity:</label>
      <div className="quantity-controls">
        <button 
          type="button" 
          onClick={handleDecrease}
          disabled={quantity <= 1}
          className="qty-btn qty-decrease"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <input
          type="number"
          id={`qty-${value}`}
          min="1"
          max={maxQuantity}
          value={quantity}
          onChange={handleInputChange}
          className="qty-input"
        />
        <button 
          type="button" 
          onClick={handleIncrease}
          disabled={quantity >= maxQuantity}
          className="qty-btn qty-increase"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <span className="qty-max">Max: {maxQuantity}</span>
    </div>
  );
}

