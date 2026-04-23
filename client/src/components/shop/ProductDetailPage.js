'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/shop/ProductCard';
import { useStore } from '@/components/store/StoreProvider';
import { fetchProduct, fetchProducts } from '@/lib/api';
import { formatCategoryLabel, formatCurrency, getDiscountPercentage, getPrimaryImage } from '@/lib/catalog';
import styles from './ProductDetailPage.module.css';

export default function ProductDetailPage({ slug }) {
  const router = useRouter();
  const { addToCart } = useStore();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadProduct() {
      setLoading(true);
      const foundProduct = await fetchProduct(slug);

      if (ignore) {
        return;
      }

      setProduct(foundProduct);
      setSelectedSize(foundProduct?.sizes?.[0] || '');
      setSelectedColor(foundProduct?.colors?.[0] || null);
      setQty(1);

      if (foundProduct) {
        const relatedResponse = await fetchProducts({
          category: foundProduct.category,
          sort: 'rating',
          order: 'desc',
          limit: 4,
        });

        if (!ignore) {
          setRelatedProducts(
            (relatedResponse.products || [])
              .filter((item) => item.slug !== foundProduct.slug)
              .slice(0, 4)
          );
        }
      }

      if (!ignore) {
        setLoading(false);
      }
    }

    loadProduct();

    return () => {
      ignore = true;
    };
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    addToCart(product, { qty, selectedSize, selectedColor });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  if (loading) {
    return (
      <main className={styles.page}>
        <div className="container">
          <div className={styles.loading}>Loading product details...</div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className={styles.page}>
        <div className="container">
          <div className={styles.emptyState}>
            <h1>Product not found</h1>
            <p>The item you are looking for is unavailable or has moved.</p>
            <Link href="/shop" className="btn btn-outline">
              Back to shop
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const discount = getDiscountPercentage(product);

  return (
    <main className={styles.page}>
      <div className="container">
        <nav className={styles.breadcrumbs}>
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/shop">Shop</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        <section className={styles.hero}>
          <div className={styles.imagePanel}>
            <div className={styles.imageFrame}>
              <Image
                src={getPrimaryImage(product)}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>

          <div className={styles.details}>
            <div className={styles.header}>
              <span className={styles.category}>{formatCategoryLabel(product.category)}</span>
              {product.isNewArrival ? <span className={styles.pill}>New Arrival</span> : null}
            </div>

            <h1 className={styles.title}>{product.name}</h1>
            <p className={styles.description}>{product.description}</p>

            <div className={styles.ratingRow}>
              <div className="stars">
                {[...Array(5)].map((_, index) => (
                  <span key={index} className={`star ${index < Math.round(product.rating) ? '' : 'empty'}`}>
                    ★
                  </span>
                ))}
              </div>
              <span>{product.reviewCount} verified reviews</span>
            </div>

            <div className={styles.priceRow}>
              <span className={styles.price}>{formatCurrency(product.price)}</span>
              {product.originalPrice ? (
                <span className={styles.originalPrice}>{formatCurrency(product.originalPrice)}</span>
              ) : null}
              {discount > 0 ? <span className={styles.discount}>{discount}% off</span> : null}
            </div>

            <div className={styles.specs}>
              <div>
                <span className={styles.specLabel}>Material</span>
                <p>{product.material}</p>
              </div>
              <div>
                <span className={styles.specLabel}>Availability</span>
                <p>{product.stock > 0 ? `${product.stock} pieces ready to ship` : 'Currently sold out'}</p>
              </div>
            </div>

            {product.sizes?.length ? (
              <div className={styles.selectorGroup}>
                <p className={styles.selectorLabel}>Select size</p>
                <div className={styles.optionRow}>
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`${styles.optionButton} ${
                        selectedSize === size ? styles.optionButtonActive : ''
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {product.colors?.length ? (
              <div className={styles.selectorGroup}>
                <p className={styles.selectorLabel}>Select colour</p>
                <div className={styles.colorRow}>
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      className={`${styles.colorButton} ${
                        selectedColor?.name === color.name ? styles.colorButtonActive : ''
                      }`}
                      onClick={() => setSelectedColor(color)}
                    >
                      <span className={styles.colorSwatch} style={{ background: color.hex }} />
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className={styles.actionRow}>
              <div className={styles.quantityBox}>
                <button
                  type="button"
                  className={styles.quantityButton}
                  onClick={() => setQty((current) => Math.max(1, current - 1))}
                >
                  -
                </button>
                <span>{qty}</span>
                <button
                  type="button"
                  className={styles.quantityButton}
                  onClick={() =>
                    setQty((current) =>
                      product.stock > 0 ? Math.min(product.stock, current + 1) : current
                    )
                  }
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className={`btn btn-outline ${styles.ctaButton}`}
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                {added ? 'Added to Cart' : 'Add to Cart'}
              </button>

              <button
                type="button"
                className={`btn btn-primary ${styles.ctaButton}`}
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
              >
                Buy Now
              </button>
            </div>

            <div className={styles.promiseBox}>
              <p>Free shipping over ₹2,999</p>
              <p>Secure guest checkout</p>
              <p>Quick support for size and styling help</p>
            </div>
          </div>
        </section>

        {relatedProducts.length ? (
          <section className={styles.relatedSection}>
            <div className="section-header">
              <p className="section-subtitle">Pair It With</p>
              <h2 className="section-title">You may also like</h2>
            </div>
            <div className={styles.relatedGrid}>
              {relatedProducts.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
