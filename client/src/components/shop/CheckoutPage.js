'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/components/store/StoreProvider';
import { createOrderWithAuth } from '@/lib/api';
import { formatCurrency } from '@/lib/catalog';
import { calculateOrderTotals } from '@/lib/pricing';
import styles from './CheckoutPage.module.css';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
  paymentMethod: 'Cash on Delivery',
  notes: '',
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, isHydrated, clearCart, authUser, authToken, isAuthenticated } = useStore();
  const [formValues, setFormValues] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authUser) {
      return;
    }

    setFormValues((current) => ({
      ...current,
      name: current.name || authUser.name || '',
      email: current.email || authUser.email || '',
      phone: current.phone || authUser.phone || '',
    }));
  }, [authUser]);

  if (!isHydrated) {
    return (
      <main className={styles.page}>
        <div className="container">
          <div className={styles.loading}>Preparing checkout...</div>
        </div>
      </main>
    );
  }

  if (!cartItems.length) {
    return (
      <main className={styles.page}>
        <div className="container">
          <div className={styles.emptyState}>
            <h1>Your cart is empty</h1>
            <p>Add products before starting checkout.</p>
            <Link href="/shop" className="btn btn-primary">
              Go to shop
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const totals = calculateOrderTotals(cartItems);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  };

  const buildOrderPayload = (paymentMethod) => ({
    customer: {
      name: formValues.name,
      email: formValues.email,
      phone: formValues.phone,
    },
    shippingAddress: {
      address: formValues.address,
      city: formValues.city,
      state: formValues.state,
      postalCode: formValues.postalCode,
      country: formValues.country,
    },
    paymentMethod,
    notes: formValues.notes,
    orderItems: cartItems.map((item) => ({
      name: item.name,
      price: item.price,
      image: item.image,
      productId: item.productId,
      qty: item.qty,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
    })),
  });

  const handleCashOnDelivery = async () => {
    const order = await createOrderWithAuth(
      buildOrderPayload('Cash on Delivery'),
      authToken
    );

    clearCart();
    router.push(`/order/${order._id || order.orderNumber}`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await handleCashOnDelivery();
    } catch (submitError) {
      setError(submitError.message || 'Unable to place order right now');
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <p className="section-subtitle">Checkout</p>
            <h1 className={styles.title}>Finish your order</h1>
          </div>
          <Link href="/cart" className={styles.backLink}>
            Back to cart
          </Link>
        </div>

        <form className={styles.layout} onSubmit={handleSubmit}>
          <section className={styles.formPanel}>
            <div className={styles.card}>
              <h2>Contact details</h2>
              {isAuthenticated ? (
                <p className={styles.accountHint}>
                  Signed in as {authUser.email}. Your order will also appear in your account history.
                </p>
              ) : (
                <p className={styles.accountHint}>
                  Want faster checkout next time? <Link href="/auth?redirect=/checkout">Sign in or create an account</Link>.
                </p>
              )}
              <div className={styles.fieldGrid}>
                <label className={styles.field}>
                  Full name
                  <input name="name" value={formValues.name} onChange={handleChange} required />
                </label>
                <label className={styles.field}>
                  Email
                  <input type="email" name="email" value={formValues.email} onChange={handleChange} required />
                </label>
                <label className={styles.field}>
                  Phone
                  <input name="phone" value={formValues.phone} onChange={handleChange} required />
                </label>
              </div>
            </div>

            <div className={styles.card}>
              <h2>Shipping address</h2>
              <div className={styles.fieldGrid}>
                <label className={`${styles.field} ${styles.fieldFull}`}>
                  Street address
                  <input name="address" value={formValues.address} onChange={handleChange} required />
                </label>
                <label className={styles.field}>
                  City
                  <input name="city" value={formValues.city} onChange={handleChange} required />
                </label>
                <label className={styles.field}>
                  State
                  <input name="state" value={formValues.state} onChange={handleChange} required />
                </label>
                <label className={styles.field}>
                  Postal code
                  <input name="postalCode" value={formValues.postalCode} onChange={handleChange} required />
                </label>
                <label className={styles.field}>
                  Country
                  <input name="country" value={formValues.country} onChange={handleChange} required />
                </label>
              </div>
            </div>

            <div className={styles.card}>
              <h2>Payment method</h2>
              <div className={styles.paymentOptions}>
                <label className={styles.paymentOption}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked
                    readOnly
                  />
                  <span>Cash on Delivery</span>
                </label>
              </div>

              <label className={`${styles.field} ${styles.notesField}`}>
                Notes for the boutique team
                <textarea
                  name="notes"
                  value={formValues.notes}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Optional delivery notes, alteration preferences, or order help"
                />
              </label>
            </div>
          </section>

          <aside className={styles.summaryPanel}>
            <div className={styles.card}>
              <h2>Order summary</h2>

              <div className={styles.lineItems}>
                {cartItems.map((item) => (
                  <div key={item.id} className={styles.lineItem}>
                    <div>
                      <p className={styles.lineItemName}>
                        {item.name} x {item.qty}
                      </p>
                      <p className={styles.lineItemMeta}>
                        {item.selectedSize || 'Standard'} {item.selectedColor?.name ? `• ${item.selectedColor.name}` : ''}
                      </p>
                    </div>
                    <span>{formatCurrency(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>

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
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Total</span>
                <span>{formatCurrency(totals.totalPrice)}</span>
              </div>

              {error ? <p className={styles.error}>{error}</p> : null}

              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Placing order...' : 'Place order'}
              </button>

              <p className={styles.note}>
                Cash on delivery orders are saved immediately and can be confirmed by the boutique team.
              </p>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}
