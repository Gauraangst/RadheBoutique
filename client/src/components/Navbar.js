'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';
import { useStore } from '@/components/store/StoreProvider';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount, authUser, isAuthenticated, logout } = useStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>✦</span>
          <div className={styles.logoText}>
            <span className={styles.logoName}>Radhe</span>
            <span className={styles.logoBoutique}>Boutique</span>
          </div>
        </Link>

        <ul className={styles.navLinks}>
          <li><Link href="/shop" className={styles.navLink}>Shop</Link></li>
          <li><Link href="/shop?category=festive-kurtis" className={styles.navLink}>Kurtis</Link></li>
          <li><Link href="/shop?category=statement-jewellery" className={styles.navLink}>Jewellery</Link></li>
          <li><Link href="/#testimonials" className={styles.navLink}>Reviews</Link></li>
          <li><Link href="/#contact" className={styles.navLink}>Contact</Link></li>
        </ul>

        <div className={styles.navActions}>
          <Link href="/shop" className="btn btn-primary btn-sm">
            Shop All
          </Link>
          {isAuthenticated ? (
            <>
              {authUser?.role === 'admin' ? (
                <Link href="/admin" className={styles.utilityLink}>
                  Admin
                </Link>
              ) : null}
              <Link href="/account" className={styles.utilityLink}>
                Account
              </Link>
              <button type="button" className={styles.utilityButton} onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <Link href="/auth" className={styles.utilityLink}>
              Sign In
            </Link>
          )}
          <Link href="/cart" className={styles.cartBtn} aria-label="Cart" id="nav-cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </Link>

          <button
            className={`${styles.hamburger} ${mobileOpen ? styles.active : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
            id="nav-hamburger"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      <div className={`${styles.mobileMenu} ${mobileOpen ? styles.open : ''}`}>
        <div className={styles.mobileMenuInner}>
          <ul className={styles.mobileLinks}>
            <li><Link href="/shop" onClick={() => setMobileOpen(false)}>Shop</Link></li>
            <li><Link href="/shop?category=festive-kurtis" onClick={() => setMobileOpen(false)}>Festive Kurtis</Link></li>
            <li><Link href="/shop?category=statement-jewellery" onClick={() => setMobileOpen(false)}>Jewellery</Link></li>
            {authUser?.role === 'admin' ? <li><Link href="/admin" onClick={() => setMobileOpen(false)}>Admin</Link></li> : null}
            {isAuthenticated ? (
              <li><Link href="/account" onClick={() => setMobileOpen(false)}>Account</Link></li>
            ) : (
              <li><Link href="/auth" onClick={() => setMobileOpen(false)}>Sign In</Link></li>
            )}
            <li><Link href="/cart" onClick={() => setMobileOpen(false)}>Cart ({cartCount})</Link></li>
            <li><Link href="/#contact" onClick={() => setMobileOpen(false)}>Contact</Link></li>
          </ul>
          <div className={styles.mobileCta}>
            <Link href="/checkout" className="btn btn-primary" onClick={() => setMobileOpen(false)}>
              Checkout
            </Link>
          </div>
          <div className={styles.mobileCta}>
            <Link href="/shop" className="btn btn-outline" onClick={() => setMobileOpen(false)}>
              Shop Now
            </Link>
          </div>
          {isAuthenticated ? (
            <div className={styles.mobileCta}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
              >
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
