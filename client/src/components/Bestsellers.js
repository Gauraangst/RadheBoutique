'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/shop/ProductCard';
import { fetchBestsellers } from '@/lib/api';
import styles from './Bestsellers.module.css';

const categories = [
  { key: 'all', label: 'All' },
  { key: 'festive-kurtis', label: 'Festive Kurtis' },
  { key: 'everyday-wear', label: 'Everyday Wear' },
  { key: 'statement-jewellery', label: 'Jewellery' },
];

export default function Bestsellers() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const data = await fetchBestsellers();
      setProducts(data);
      setLoading(false);
    }
    loadProducts();
  }, []);

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <section className={`section ${styles.section}`} id="bestsellers">
      <div className="container">
        <div className="section-header">
          <p className="section-subtitle">Most Loved</p>
          <h2 className="section-title">Bestsellers</h2>
          <div className="section-divider"></div>
        </div>

        {/* Filter Tabs */}
        <div className={styles.filters}>
          {categories.map(cat => (
            <button
              key={cat.key}
              className={`${styles.filterBtn} ${activeCategory === cat.key ? styles.active : ''}`}
              onClick={() => setActiveCategory(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? <p style={{ textAlign: 'center' }}>Loading products...</p> : null}

        <div className={styles.grid}>
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className={styles.viewAll}>
          <Link href="/shop" className="btn btn-outline">
            View All Products
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
