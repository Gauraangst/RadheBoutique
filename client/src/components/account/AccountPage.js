'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchMyOrders } from '@/lib/api';
import { formatCurrency } from '@/lib/catalog';
import { useStore } from '@/components/store/StoreProvider';
import styles from './AccountPage.module.css';

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(value))
    : '—';

export default function AccountPage() {
  const { authUser, authToken, isHydrated, saveProfile, logout } = useStore();
  const [orders, setOrders] = useState([]);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!authUser) {
      return;
    }

    setFormValues({
      name: authUser.name || '',
      email: authUser.email || '',
      phone: authUser.phone || '',
      password: '',
    });
  }, [authUser]);

  useEffect(() => {
    let ignore = false;

    async function loadOrders() {
      if (!authToken) {
        setLoadingOrders(false);
        return;
      }

      setLoadingOrders(true);

      try {
        const response = await fetchMyOrders(authToken);
        if (!ignore) {
          setOrders(response);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message || 'Unable to load your orders');
        }
      } finally {
        if (!ignore) {
          setLoadingOrders(false);
        }
      }
    }

    loadOrders();

    return () => {
      ignore = true;
    };
  }, [authToken]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await saveProfile(formValues);
      setFormValues((current) => ({ ...current, password: '' }));
      setSuccess('Profile updated successfully.');
    } catch (submitError) {
      setError(submitError.message || 'Unable to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!isHydrated) {
    return (
      <main className={styles.page}>
        <div className="container">
          <section className={styles.loading}>Loading your account...</section>
        </div>
      </main>
    );
  }

  if (!authUser) {
    return (
      <main className={styles.page}>
        <div className="container">
          <section className={styles.emptyState}>
            <p className="section-subtitle">Account</p>
            <h1 className={styles.title}>Sign in to view your account</h1>
            <p>You can review order history, save contact details, and move through checkout faster.</p>
            <Link href="/auth?redirect=/account" className="btn btn-primary">
              Sign in
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <div>
            <p className="section-subtitle">My Account</p>
            <h1 className={styles.title}>Hello, {authUser.name}</h1>
          </div>
          <button type="button" className={styles.logoutButton} onClick={logout}>
            Logout
          </button>
        </header>

        <section className={styles.layout}>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2>Profile</h2>
            </div>

            {error ? <p className={styles.error}>{error}</p> : null}
            {success ? <p className={styles.success}>{success}</p> : null}

            <form className={styles.form} onSubmit={handleSubmit}>
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
                <input name="phone" value={formValues.phone} onChange={handleChange} />
              </label>
              <label className={styles.field}>
                New password
                <input
                  type="password"
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                  minLength={8}
                  placeholder="Leave blank to keep current password"
                />
              </label>

              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </form>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2>My Orders</h2>
            </div>

            {loadingOrders ? (
              <p>Loading order history...</p>
            ) : orders.length ? (
              <div className={styles.orderList}>
                {orders.map((order) => (
                  <article key={order._id || order.orderNumber} className={styles.orderCard}>
                    <div className={styles.orderTop}>
                      <div>
                        <strong>{order.orderNumber || order._id}</strong>
                        <p>{formatDate(order.createdAt)}</p>
                      </div>
                      <div className={styles.orderMeta}>
                        <span>{order.status}</span>
                        <strong>{formatCurrency(order.totalPrice)}</strong>
                      </div>
                    </div>
                    <p className={styles.orderNote}>
                      {order.paymentMethod} • {order.paymentStatus}
                    </p>
                    <Link href={`/order/${order._id || order.orderNumber}`} className={styles.orderLink}>
                      View order
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className={styles.emptyOrders}>
                <p>You have not placed any orders yet.</p>
                <Link href="/shop" className="btn btn-outline">
                  Start shopping
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
