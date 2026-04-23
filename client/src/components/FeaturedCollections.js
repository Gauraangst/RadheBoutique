'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './FeaturedCollections.module.css';

const collections = [
  {
    id: 1,
    title: 'Festive Kurtis',
    subtitle: 'Celebrate in Style',
    image: '/images/collections/festive-kurtis.png',
    count: '120+ Designs',
    link: '/shop?category=festive-kurtis'
  },
  {
    id: 2,
    title: 'Everyday Wear',
    subtitle: 'Effortless Elegance',
    image: '/images/collections/everyday-wear.png',
    count: '200+ Designs',
    link: '/shop?category=everyday-wear'
  },
  {
    id: 3,
    title: 'Statement Jewellery',
    subtitle: 'Adorn with Grace',
    image: '/images/collections/statement-jewellery.png',
    count: '80+ Pieces',
    link: '/shop?category=statement-jewellery'
  }
];

export default function FeaturedCollections() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.05, rootMargin: '50px' }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`section mandala-bg ${styles.section}`} id="collections" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <p className="section-subtitle">Curated For You</p>
          <h2 className="section-title">Featured Collections</h2>
          <div className="section-divider"></div>
          <p className="section-description">
            Explore our handpicked collections, each crafted with love and tradition
          </p>
        </div>

        <div className={styles.grid}>
          {collections.map((collection, index) => (
            <Link
              href={collection.link}
              key={collection.id}
              className={`${styles.card} ${isVisible ? styles.visible : ''}`}
              style={{ '--delay': `${index * 0.2}s` }}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                  className={styles.image}
                />
                <div className={styles.overlay}>
                  <div className={styles.overlayContent}>
                    <span className={styles.count}>{collection.count}</span>
                    <span className={styles.exploreBtn}>
                      Explore Collection
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.info}>
                <h3 className={styles.title}>{collection.title}</h3>
                <p className={styles.subtitle}>{collection.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
