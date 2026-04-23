'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className={styles.footer} id="contact">
      {/* Newsletter Banner */}
      <div className={styles.newsletter}>
        <div className="container">
          <div className={styles.newsletterInner}>
            <div className={styles.newsletterText}>
              <h3 className={styles.newsletterTitle}>Join the Radhe Family</h3>
              <p className={styles.newsletterSubtitle}>
                Get 10% off your first order + exclusive access to new collections
              </p>
            </div>
            <form className={styles.newsletterForm} onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.newsletterInput}
                required
              />
              <button type="submit" className={styles.newsletterBtn}>
                {subscribed ? '✓ Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className={styles.main}>
        <div className="container">
          <div className={styles.grid}>
            {/* Brand */}
            <div className={styles.brand}>
              <div className={styles.logo}>
                <span className={styles.logoIcon}>✦</span>
                <div>
                  <span className={styles.logoName}>Radhe</span>
                  <span className={styles.logoBoutique}>Boutique</span>
                </div>
              </div>
              <p className={styles.brandText}>
                Blending timeless Indian tradition with modern elegance, creating pieces
                that celebrate femininity and individuality.
              </p>
              <div className={styles.socials}>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.social} aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5"/>
                    <circle cx="12" cy="12" r="5"/>
                    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
                  </svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.social} aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className={styles.social} aria-label="Pinterest">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.15 9.42 7.6 11.18-.1-.95-.19-2.4.04-3.44.21-.94 1.36-5.78 1.36-5.78s-.35-.7-.35-1.73c0-1.62.94-2.83 2.11-2.83.99 0 1.47.75 1.47 1.64 0 1-.64 2.5-.97 3.89-.28 1.16.58 2.11 1.73 2.11 2.08 0 3.68-2.19 3.68-5.36 0-2.8-2.01-4.76-4.89-4.76-3.33 0-5.28 2.49-5.28 5.07 0 1 .39 2.08.87 2.67.1.12.11.22.08.34-.09.36-.29 1.16-.33 1.32-.05.21-.17.26-.39.16-1.46-.68-2.37-2.82-2.37-4.54 0-3.7 2.69-7.09 7.75-7.09 4.07 0 7.23 2.9 7.23 6.77 0 4.04-2.55 7.3-6.08 7.3-1.19 0-2.31-.62-2.69-1.35 0 0-.59 2.24-.73 2.79-.26 1.01-.97 2.27-1.45 3.04C9.57 23.81 10.76 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z"/>
                  </svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={styles.social} aria-label="YouTube">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z"/>
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className={styles.linkGroup}>
              <h4 className={styles.linkTitle}>Shop</h4>
              <ul className={styles.links}>
                <li><Link href="/shop?category=festive-kurtis">Festive Kurtis</Link></li>
                <li><Link href="/shop?category=everyday-wear">Everyday Wear</Link></li>
                <li><Link href="/shop?category=statement-jewellery">Statement Jewellery</Link></li>
                <li><Link href="/shop">All Products</Link></li>
                <li><Link href="/cart">Cart</Link></li>
                <li><Link href="/checkout">Checkout</Link></li>
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h4 className={styles.linkTitle}>Company</h4>
              <ul className={styles.links}>
                <li><Link href="/#about">About Us</Link></li>
                <li><Link href="/#collections">Collections</Link></li>
                <li><Link href="/#testimonials">Customer Reviews</Link></li>
                <li><Link href="/shop">Shop Online</Link></li>
                <li><Link href="/#contact">Get in Touch</Link></li>
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h4 className={styles.linkTitle}>Help</h4>
              <ul className={styles.links}>
                <li><Link href="/#contact">Contact Us</Link></li>
                <li><Link href="/shop">Browse Size Options</Link></li>
                <li><Link href="/checkout">Shipping & Delivery</Link></li>
                <li><Link href="/cart">Review Cart</Link></li>
                <li><Link href="/#testimonials">FAQs & Reviews</Link></li>
                <li><Link href="/#contact">Order support</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottom}>
        <div className="container">
          <div className={styles.bottomInner}>
            <p className={styles.copyright}>
              © {new Date().getFullYear()} Radhe Boutique. All rights reserved. Crafted with ♥ in India
            </p>
            <div className={styles.bottomLinks}>
              <Link href="/shop">Shopping Guide</Link>
              <Link href="/checkout">Checkout Info</Link>
              <Link href="/#contact">Support</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
