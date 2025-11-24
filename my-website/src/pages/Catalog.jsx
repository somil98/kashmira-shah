import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../utils/useProducts';

export default function Catalog() {
  const { products, loading } = useProducts();
  const [filter, setFilter] = useState('all');

  // Get unique categories
  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(product => product.category === filter);

  if (loading) {
    return (
      <section className="catalog-hero">
        <div className="container">
          <div className="catalog-header">
            <h1>Product Catalog</h1>
            <p>Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="catalog-hero">
        <div className="container">
          <div className="catalog-header">
            <h1>Product Catalog</h1>
            <p>Discover our complete range of Ektra by Srithai Superware products</p>
            <div className="catalog-filters">
              {categories.map(category => (
                <button
                  key={category}
                  className={`filter-btn ${filter === category ? 'active' : ''}`}
                  onClick={() => setFilter(category)}
                  data-filter={category}
                >
                  {category === 'all' ? 'All Products' : category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="catalog-products">
        <div className="container">
          <div className="products-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p>No products found in this category.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

