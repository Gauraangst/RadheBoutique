'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useStore } from '@/components/store/StoreProvider';
import { calculateOrderTotals } from '@/lib/pricing';
import { formatCurrency } from '@/lib/catalog';
import styles from './CartPage.module.css';

export default function CartPage() {
  const router = useRouter();
  const { cartItems, isHydrated, updateCartItem, removeFromCart } = useStore();

  if (!isHydrated) {
    return (
      <main className={styles.page}>
        <div className="container">
          <div className={styles.loading}>Loading your cart...</div>
        </div>
      </main>
    );
  }

  if (!cartItems.length) {
    return (
      <main className={styles.page}>
        <div className="container">
          <section className={styles.emptyState}>
            <p className="section-subtitle">Your Bag</p>
            <h1 className={styles.emptyTitle}>Your cart is empty</h1>
            <p>Browse the boutique and add a few favorites to begin checkout.</p>
            <Link href="/shop" className="btn btn-primary">
              Start shopping
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const totals = calculateOrderTotals(cartItems);

  return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <p className="section-subtitle">Your Bag</p>
            <h1 className={styles.title}>Ready to check out</h1>
          </div>
          <Link href="/shop" className={styles.continueLink}>
            Continue shopping
          </Link>
        </div>

        <section className={styles.layout}>
          <div className={styles.itemsPanel}>
            {cartItems.map((item) => (
              <article key={item.id} className={styles.itemCard}>
                <Link
                  href={`/shop/${item.slug || item.productId}`}
                  className={styles.productLink}
                  aria-label={`View ${item.name}`}
                >
                  <div className={styles.imageWrap}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="140px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </Link>

                <div className={styles.itemInfo}>
                  <div className={styles.itemTop}>
                    <div>
                      <h2 className={styles.itemName}>
                        <Link href={`/shop/${item.slug || item.productId}`} className={styles.productLink}>
                          {item.name}
                        </Link>
                      </h2>
                      <p className={styles.itemMeta}>
                        {item.selectedSize ? `Size: ${item.selectedSize}` : 'Standard fit'}
                        {item.selectedColor?.name ? ` • ${item.selectedColor.name}` : ''}
                      </p>
                    </div>
                    <p className={styles.itemPrice}>{formatCurrency(item.price)}</p>
                  </div>

                  <div className={styles.itemActions}>
                    <div className={styles.quantityBox}>
                      <button
                        type="button"
                        onClick={() => updateCartItem(item.id, item.qty - 1)}
                      >
                        -
                      </button>
                      <span>{item.qty}</span>
                      <button
                        type="button"
                        disabled={item.stock > 0 && item.qty >= item.stock}
                        aria-label={`Increase quantity for ${item.name}`}
                        onClick={() => updateCartItem(item.id, item.qty + 1)}
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>

                  {item.stock > 0 && item.qty >= item.stock ? (
                    <p className={styles.stockMessage}>Only {item.stock} pieces available in stock.</p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>

          <aside className={styles.summaryPanel}>
            <div className={styles.summaryCard}>
              <h2>Order summary</h2>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{formatCurrency(totals.itemsPrice)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>{totals.shippingPrice ? formatCurrency(totals.shippingPrice) : 'Free'}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Estimated tax</span>
                <span>{formatCurrency(totals.taxPrice)}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <span>Total</span>
                <span>{formatCurrency(totals.totalPrice)}</span>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => router.push('/checkout')}
              >
                Proceed to checkout
              </button>

              <p className={styles.shippingNote}>
                Free delivery unlocks automatically on orders above ₹2,999.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
