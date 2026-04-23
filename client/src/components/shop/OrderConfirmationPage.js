'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchOrder } from '@/lib/api';
import { formatCurrency } from '@/lib/catalog';
import styles from './OrderConfirmationPage.module.css';

export default function OrderConfirmationPage({ id }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadOrder() {
      const response = await fetchOrder(id);
      if (!ignore) {
        setOrder(response);
        setLoading(false);
      }
    }

    loadOrder();

    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className={styles.page}>
        <div className="container">
          <div className={styles.loading}>Loading your order...</div>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className={styles.page}>
        <div className="container">
          <div className={styles.emptyState}>
            <h1>Order not found</h1>
            <p>We could not find that order reference. Please check the link and try again.</p>
            <Link href="/shop" className="btn btn-outline">
              Back to shop
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className="container">
        <section className={styles.heroCard}>
          <p className="section-subtitle">Order Confirmed</p>
          <h1 className={styles.title}>Thank you for shopping with Radhe Boutique</h1>
          <p className={styles.lead}>
            Your order has been placed successfully. We will share the next update as your order
            moves from confirmation to dispatch.
          </p>
          <div className={styles.heroMeta}>
            <div>
              <span className={styles.metaLabel}>Order number</span>
              <strong>{order.orderNumber || order._id}</strong>
            </div>
            <div>
              <span className={styles.metaLabel}>Status</span>
              <strong>{order.status}</strong>
            </div>
            <div>
              <span className={styles.metaLabel}>Payment</span>
              <strong>{order.paymentMethod}</strong>
            </div>
          </div>
        </section>

        <section className={styles.layout}>
          <div className={styles.card}>
            <h2>Items ordered</h2>
            <div className={styles.lineItems}>
              {order.orderItems?.map((item, index) => (
                <div key={`${item.product || item.productId || item.name}-${index}`} className={styles.lineItem}>
                  <div>
                    <p className={styles.lineItemName}>
                      {item.name} x {item.qty}
                    </p>
                    <p className={styles.lineItemMeta}>
                      {item.selectedSize || 'Standard'}{' '}
                      {item.selectedColor?.name ? `• ${item.selectedColor.name}` : ''}
                    </p>
                  </div>
                  <span>{formatCurrency(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.sideColumn}>
            <div className={styles.card}>
              <h2>Delivery details</h2>
              <p>{order.customer?.name}</p>
              <p>{order.customer?.email}</p>
              <p>{order.customer?.phone}</p>
              <p>{order.shippingAddress?.address}</p>
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
                {order.shippingAddress?.postalCode}
              </p>
              <p>{order.shippingAddress?.country}</p>
            </div>

            <div className={styles.card}>
              <h2>Payment summary</h2>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{formatCurrency(order.itemsPrice)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>{order.shippingPrice ? formatCurrency(order.shippingPrice) : 'Free'}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Tax</span>
                <span>{formatCurrency(order.taxPrice)}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Total</span>
                <span>{formatCurrency(order.totalPrice)}</span>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.actions}>
          <Link href="/shop" className="btn btn-primary">
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
