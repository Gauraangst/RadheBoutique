'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './InstagramGallery.module.css';

const posts = [
  { id: 1, image: '/images/instagram/insta-1.png', likes: '2.4K' },
  { id: 2, image: '/images/collections/festive-kurtis.png', likes: '1.8K' },
  { id: 3, image: '/images/collections/statement-jewellery.png', likes: '3.1K' },
  { id: 4, image: '/images/collections/everyday-wear.png', likes: '1.5K' },
  { id: 5, image: '/images/products/kurti-1.png', likes: '2.7K' },
  { id: 6, image: '/images/products/jewel-1.png', likes: '1.9K' },
];

export default function InstagramGallery() {
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
    <section className={`section ${styles.section}`} ref={sectionRef}>
      <div className="container-wide">
        <div className="section-header">
          <p className="section-subtitle">Follow Us</p>
          <h2 className="section-title">@RadheBoutique</h2>
          <div className="section-divider"></div>
          <p className="section-description">
            Join our community of 25K+ fashion lovers. Tag us in your looks!
          </p>
        </div>

        <div className={styles.grid}>
          {posts.map((post, index) => (
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              key={post.id}
              className={`${styles.item} ${isVisible ? styles.visible : ''}`}
              style={{ '--delay': `${index * 0.1}s` }}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={post.image}
                  alt={`Instagram post ${post.id}`}
                  fill
                  sizes="(max-width: 640px) 33vw, 16vw"
                  style={{ objectFit: 'cover' }}
                  className={styles.image}
                />
                <div className={styles.overlay}>
                  <div className={styles.overlayContent}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    <span className={styles.likes}>{post.likes}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="5"/>
              <circle cx="12" cy="12" r="5"/>
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
            </svg>
            Follow on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
