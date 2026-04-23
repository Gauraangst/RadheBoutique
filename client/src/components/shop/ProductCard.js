'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { formatCategoryLabel, formatCurrency, getDiscountPercentage, getPrimaryImage } from '@/lib/catalog';
import { useStore } from '@/components/store/StoreProvider';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const { addToCart } = useStore();
  const [added, setAdded] = useState(false);

  const discount = getDiscountPercentage(product);

  const handleAddToCart = () => {
    addToCart(product, { qty: 1 });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <article className={styles.card}>
      <div className={styles.imageShell}>
        <Link href={`/shop/${product.slug}`} className={styles.imageLink}>
          <Image
            src={getPrimaryImage(product)}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            style={{ objectFit: 'cover' }}
            className={styles.image}
          />
        </Link>

        <div className={styles.badges}>
          {product.isNewArrival ? <span className={styles.newBadge}>New</span> : null}
          {discount > 0 ? <span className={styles.discountBadge}>{discount}% Off</span> : null}
        </div>

        <span className={styles.stockBadge}>
          {product.stock > 0 ? `${product.stock} left` : 'Sold out'}
        </span>
      </div>

      <div className={styles.content}>
        <div className={styles.meta}>
          <span>{formatCategoryLabel(product.category)}</span>
          <span>{product.material}</span>
        </div>

        <Link href={`/shop/${product.slug}`} className={styles.titleLink}>
          <h3 className={styles.title}>{product.name}</h3>
        </Link>

        <div className={styles.ratingRow}>
          <div className="stars" aria-label={`${product.rating} out of 5 stars`}>
            {[...Array(5)].map((_, index) => (
              <span key={index} className={`star ${index < Math.round(product.rating) ? '' : 'empty'}`}>
                ★
              </span>
            ))}
          </div>
          <span className={styles.reviewCount}>{product.reviewCount} reviews</span>
        </div>

        <div className={styles.priceRow}>
          <span className={styles.price}>{formatCurrency(product.price)}</span>
          {product.originalPrice ? (
            <span className={styles.originalPrice}>{formatCurrency(product.originalPrice)}</span>
          ) : null}
        </div>

        <div className={styles.actions}>
          <Link href={`/shop/${product.slug}`} className={styles.viewLink}>
            View Details
          </Link>
          <button
            type="button"
            className={`${styles.cartButton} ${added ? styles.added : ''}`}
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            {product.stock <= 0 ? 'Out of Stock' : added ? 'Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </article>
  );
}
