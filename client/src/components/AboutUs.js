'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './AboutUs.module.css';

export default function AboutUs() {
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
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`section mandala-bg ${styles.section} ${isVisible ? styles.visible : ''}`} id="about" ref={sectionRef}>
      <div className="container">
        <div className={styles.grid}>
          {/* Image Side */}
          <div className={styles.imageCol}>
            <div className={styles.imageWrapper}>
              <Image
                src="/images/about-story.png"
                alt="Radhe Boutique - Our Story"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                className={styles.image}
              />
            </div>
            <div className={styles.imageAccent}>
              <div className={styles.accentInner}>
                <span className={styles.accentYear}>Est.</span>
                <span className={styles.accentNumber}>2020</span>
              </div>
            </div>
          </div>

          {/* Text Side */}
          <div className={styles.textCol}>
            <p className="section-subtitle">Our Story</p>
            <h2 className={styles.title}>Where Tradition Meets Modern Elegance</h2>
            <div className="section-divider" style={{ margin: '1.5rem 0' }}></div>
            <p className={styles.story}>
              Radhe Boutique blends timeless Indian tradition with modern elegance, creating pieces
              that celebrate femininity and individuality. Each kurti is a canvas of artistry, and every
              piece of jewellery tells a story of heritage.
            </p>
            <p className={styles.story}>
              Founded with a passion for preserving India&apos;s rich textile heritage, we work directly
              with skilled artisans across India — from the weavers of Varanasi to the embroiderers
              of Lucknow — to bring you pieces that are not just garments, but heirlooms.
            </p>

            <div className={styles.values}>
              <div className={styles.value}>
                <div className={styles.valueIcon}>🪡</div>
                <div>
                  <h4 className={styles.valueTitle}>Artisan Crafted</h4>
                  <p className={styles.valueText}>Each piece handcrafted by master artisans</p>
                </div>
              </div>
              <div className={styles.value}>
                <div className={styles.valueIcon}>🌿</div>
                <div>
                  <h4 className={styles.valueTitle}>Sustainable Fashion</h4>
                  <p className={styles.valueText}>Ethically sourced & eco-friendly materials</p>
                </div>
              </div>
            </div>

            <a href="#collections" className="btn btn-primary">
              Discover Our Collections
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
