import { useState, useEffect } from 'react';
import { loadInventory } from './csvParser';
import { safeName } from './imageMatcher';

/**
 * Custom hook to load products from CSV and match images
 */
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const loadedProducts = await loadInventory();
        
        // Match images to products
        const productsWithImages = loadedProducts.map(product => {
          const folderName = safeName(product.name);
          // Try to find first image in folder (will be handled by component)
          const imagePath = `/images/${folderName}`;
          
          return {
            ...product,
            imagePath,
            imageFolder: folderName,
          };
        });
        
        setProducts(productsWithImages);
        setError(null);
      } catch (err) {
        console.error('Error loading products:', err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { products, loading, error };
}

