'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className={styles.hero} id="hero">
      {/* Background Image */}
      <div className={styles.bgWrapper}>
        <Image
          src="/images/hero-banner.png"
          alt="Radhe Boutique - Designer Kurti Collection"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
          className={styles.bgImage}
        />
        <div className={styles.overlay}></div>
        <div className={styles.gradientOverlay}></div>
      </div>

      {/* Floating Decorations */}
      <div className={styles.decorations}>
        <div className={styles.mandalaLeft}>
          <svg viewBox="0 0 200 200" className={styles.mandalaSvg}>
            <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(201,169,110,0.15)" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(201,169,110,0.12)" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="40" fill="none" stroke="rgba(201,169,110,0.1)" strokeWidth="0.5" />
            {[...Array(12)].map((_, i) => (
              <line key={i} x1="100" y1="20" x2="100" y2="180" stroke="rgba(201,169,110,0.08)" strokeWidth="0.5"
                transform={`rotate(${i * 30} 100 100)`} />
            ))}
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className={`${styles.content} ${loaded ? styles.loaded : ''}`}>
        <div className={styles.tagContainer}>
          <span className={styles.tag}>✦ New Collection 2026 ✦</span>
        </div>
        <h1 className={styles.title}>
          <span className={styles.titleLine}>Grace in Every Thread,</span>
          <span className={styles.titleLine2}>Elegance in Every Detail</span>
        </h1>
        <p className={styles.subtitle}>
          Discover handcrafted designer kurtis and exquisite jewellery that celebrate the essence of Indian femininity
        </p>
        <div className={styles.ctas}>
          <Link href="/shop?category=festive-kurtis" className={`btn btn-white ${styles.ctaBtn}`}>
            Shop Kurtis
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <Link href="/shop?category=statement-jewellery" className={`btn btn-outline ${styles.ctaBtn} ${styles.ctaOutline}`}>
            Shop Jewellery
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>500+</span>
            <span className={styles.statLabel}>Designs</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>50K+</span>
            <span className={styles.statLabel}>Happy Customers</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>4.8</span>
            <span className={styles.statLabel}>★ Rating</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={styles.scrollIndicator}>
        <div className={styles.scrollLine}></div>
        <span className={styles.scrollText}>Scroll to Explore</span>
      </div>
    </section>
  );
}
