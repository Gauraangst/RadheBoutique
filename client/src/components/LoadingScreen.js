'use client';
import { useState, useEffect } from 'react';
import styles from './LoadingScreen.module.css';

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setLoading(false), 600);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className={`${styles.screen} ${fadeOut ? styles.fadeOut : ''}`}>
      <div className={styles.content}>
        {/* Mandala Loader */}
        <div className={styles.mandala}>
          <svg viewBox="0 0 120 120" className={styles.ring1}>
            <circle cx="60" cy="60" r="55" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </svg>
          <svg viewBox="0 0 120 120" className={styles.ring2}>
            <circle cx="60" cy="60" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="8 4" />
          </svg>
          <svg viewBox="0 0 120 120" className={styles.ring3}>
            <circle cx="60" cy="60" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </svg>
          <div className={styles.centerDot}>✦</div>
        </div>

        {/* Brand Name */}
        <div className={styles.brand}>
          <h1 className={styles.logoName}>Radhe</h1>
          <span className={styles.logoBoutique}>Boutique</span>
        </div>

        <div className={styles.loadingBar}>
          <div className={styles.loadingFill}></div>
        </div>
      </div>
    </div>
  );
}
