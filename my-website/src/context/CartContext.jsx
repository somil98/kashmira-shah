import { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        // Update quantity if already in cart
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.quantity) }
            : item
        );
      }
      // Add new item
      return [...prev, { product, quantity }];
    });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    setCartItems(prev => 
      prev.map(item => 
        item.product.id === productId 
          ? { ...item, quantity }
          : item
      )
    );
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + (item.product.sellingPrice * item.quantity), 0);
  }, [cartItems]);

  const getTotalSavings = useCallback(() => {
    return cartItems.reduce((sum, item) => {
      const savings = item.product.mrp > item.product.sellingPrice 
        ? (item.product.mrp - item.product.sellingPrice) * item.quantity 
        : 0;
      return sum + savings;
    }, 0);
  }, [cartItems]);

  const generateWhatsAppMessage = useCallback(() => {
    if (cartItems.length === 0) return '';
    
    const phoneNumber = '+919653323093';
    let message = `Hi Kashmira, I'd like to order the following items:\n\n`;
    
    cartItems.forEach((item, index) => {
      const itemTotal = item.product.sellingPrice * item.quantity;
      message += `${index + 1}. ${item.product.name}\n`;
      message += `   Qty: ${item.quantity} × ₹${item.product.sellingPrice.toLocaleString('en-IN')} = ₹${itemTotal.toLocaleString('en-IN')}\n\n`;
    });
    
    const total = getTotalPrice();
    const savings = getTotalSavings();
    
    message += `━━━━━━━━━━━━━━━\n`;
    message += `Total: ₹${total.toLocaleString('en-IN')}`;
    if (savings > 0) {
      message += `\nYou save: ₹${savings.toLocaleString('en-IN')}`;
    }
    message += `\n\nPlease let me know the delivery details.`;
    
    return `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
  }, [cartItems, getTotalPrice, getTotalSavings]);

  const isInCart = useCallback((productId) => {
    return cartItems.some(item => item.product.id === productId);
  }, [cartItems]);

  const getCartQuantity = useCallback((productId) => {
    const item = cartItems.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }, [cartItems]);

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getTotalItems,
      getTotalPrice,
      getTotalSavings,
      generateWhatsAppMessage,
      isInCart,
      getCartQuantity
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

