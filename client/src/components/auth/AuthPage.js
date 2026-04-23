'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/components/store/StoreProvider';
import styles from './AuthPage.module.css';

const initialLoginForm = {
  email: '',
  password: '',
};

const initialRegisterForm = {
  name: '',
  email: '',
  phone: '',
  password: '',
};

export default function AuthPage({ redirectTo = '/account' }) {
  const router = useRouter();
  const { login, register, isHydrated, authUser } = useStore();
  const [mode, setMode] = useState('login');
  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [registerForm, setRegisterForm] = useState(initialRegisterForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isHydrated || !authUser) {
      return;
    }

    router.replace(redirectTo || (authUser.role === 'admin' ? '/admin' : '/account'));
  }, [authUser, isHydrated, redirectTo, router]);

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((current) => ({ ...current, [name]: value }));
  };

  const handleRegisterChange = (event) => {
    const { name, value } = event.target;
    setRegisterForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response =
        mode === 'login'
          ? await login(loginForm)
          : await register(registerForm);

      const nextRoute = redirectTo || (response.role === 'admin' ? '/admin' : '/account');
      router.push(nextRoute);
    } catch (submitError) {
      setError(submitError.message || 'Unable to continue');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className="container">
        <section className={styles.card}>
          <div className={styles.header}>
            <p className="section-subtitle">Secure Access</p>
            <h1 className={styles.title}>
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className={styles.description}>
              {mode === 'login'
                ? 'Sign in to view your orders or manage the store if you are the owner.'
                : 'Create a customer account for faster checkout and order history.'}
            </p>
          </div>

          <div className={styles.switcher}>
            <button
              type="button"
              className={`${styles.switchButton} ${mode === 'login' ? styles.switchButtonActive : ''}`}
              onClick={() => setMode('login')}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`${styles.switchButton} ${mode === 'register' ? styles.switchButtonActive : ''}`}
              onClick={() => setMode('register')}
            >
              Register
            </button>
          </div>

          {error ? <p className={styles.error}>{error}</p> : null}

          <form className={styles.form} onSubmit={handleSubmit}>
            {mode === 'login' ? (
              <>
                <label className={styles.field}>
                  Email
                  <input
                    type="email"
                    name="email"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    required
                  />
                </label>
                <label className={styles.field}>
                  Password
                  <input
                    type="password"
                    name="password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    required
                  />
                </label>
              </>
            ) : (
              <>
                <label className={styles.field}>
                  Full name
                  <input
                    name="name"
                    value={registerForm.name}
                    onChange={handleRegisterChange}
                    required
                  />
                </label>
                <label className={styles.field}>
                  Email
                  <input
                    type="email"
                    name="email"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                    required
                  />
                </label>
                <label className={styles.field}>
                  Phone
                  <input
                    name="phone"
                    value={registerForm.phone}
                    onChange={handleRegisterChange}
                  />
                </label>
                <label className={styles.field}>
                  Password
                  <input
                    type="password"
                    name="password"
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                    minLength={8}
                    required
                  />
                </label>
              </>
            )}

            <button type="submit" className="btn btn-primary" disabled={submitting || !isHydrated}>
              {submitting ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div className={styles.helpBox}>
            <strong>Client-only mode</strong>
            <p>
              Accounts are stored in your browser for this deployment. Register first, then sign in to
              access account history and checkout details on this device.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
