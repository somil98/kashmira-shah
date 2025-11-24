import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

export default function Products({ products, featured = false }) {
  const displayProducts = featured ? products.slice(0, 4) : products;

  if (products.length === 0) {
    return (
      <section id="products" className="products">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <p>Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="products">
      <div className="container">
        <div className="section-header">
          <h2>Featured Products</h2>
          <p>Ektra by Srithai Superware - Premium Quality Crockery</p>
        </div>
        <div className="products-grid">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {featured && (
          <div className="products-actions">
            <Link to="/catalog" className="btn btn-primary">
              View Full Catalog
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

