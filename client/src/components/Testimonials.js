'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './Testimonials.module.css';
import { fetchReviews } from '@/lib/api';

const fallbackReviews = [
  {
    _id: '1',
    customerName: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    title: 'Absolutely stunning!',
    text: 'The Maharani Silk Anarkali is even more beautiful in person. The fabric quality is exceptional and the embroidery work is flawless. Got so many compliments at the wedding!',
    avatar: '👩🏻'
  },
  {
    _id: '2',
    customerName: 'Ananya Reddy',
    location: 'Hyderabad',
    rating: 5,
    title: 'Perfect festive wear',
    text: 'I ordered the Chanderi kurti set for Diwali and it was perfect. The fit was exactly as described, and the dupatta is gorgeous. Will definitely order again!',
    avatar: '👩🏽'
  },
  {
    _id: '3',
    customerName: 'Meera Patel',
    location: 'Ahmedabad',
    rating: 4,
    title: 'Great quality, fast delivery',
    text: 'The cotton printed kurti is my go-to daily wear now. So comfortable and the print hasn\'t faded even after multiple washes. Love it!',
    avatar: '👩🏻'
  },
  {
    _id: '4',
    customerName: 'Kavitha Nair',
    location: 'Kochi',
    rating: 5,
    title: 'Jewellery is breathtaking',
    text: 'The Kundan Polki set is absolutely breathtaking. It looks like real gold and the stones catch light beautifully. Worth every penny!',
    avatar: '👩🏽'
  },
  {
    _id: '5',
    customerName: 'Ritu Agarwal',
    location: 'Delhi',
    rating: 5,
    title: 'Never disappoints',
    text: 'This is my 5th order and I\'m always amazed by the quality. The temple jhumkas are exquisite — handcrafted perfection. Already eyeing my next purchase!',
    avatar: '👩🏻'
  },
  {
    _id: '6',
    customerName: 'Sneha Iyer',
    location: 'Bangalore',
    rating: 4,
    title: 'Elegant and comfortable',
    text: 'The linen straight kurti is perfect for Bangalore weather. Minimal, elegant, and so well-stitched. The fabric quality is premium. Love the earthy tones!',
    avatar: '👩🏽'
  }
];

export default function Testimonials() {
  const [reviews, setReviews] = useState(fallbackReviews);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    async function loadReviews() {
      const data = await fetchReviews();
      if (data.length > 0) setReviews(data);
    }
    loadReviews();
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % Math.ceil(reviews.length / 3));
  }, [reviews.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => prev === 0 ? Math.ceil(reviews.length / 3) - 1 : prev - 1);
  }, [reviews.length]);

  useEffect(() => {
    if (isAutoPlay) {
      intervalRef.current = setInterval(nextSlide, 5000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isAutoPlay, nextSlide]);

  const visibleReviews = reviews.slice(currentIndex * 3, currentIndex * 3 + 3);
  const totalPages = Math.ceil(reviews.length / 3);

  return (
    <section className={`section ${styles.section}`} id="testimonials">
      <div className="container">
        <div className="section-header">
          <p className="section-subtitle">Love Notes</p>
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="section-divider"></div>
        </div>

        <div
          className={styles.carousel}
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseLeave={() => setIsAutoPlay(true)}
        >
          <div className={styles.cards}>
            {visibleReviews.map((review) => (
              <div key={review._id} className={styles.card}>
                {/* Quote icon */}
                <div className={styles.quoteIcon}>&ldquo;</div>

                <div className="stars" style={{ marginBottom: '1rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`star ${i < review.rating ? '' : 'empty'}`}>★</span>
                  ))}
                </div>

                {review.title && <h4 className={styles.reviewTitle}>{review.title}</h4>}
                <p className={styles.reviewText}>{review.text}</p>

                <div className={styles.reviewer}>
                  <div className={styles.avatar}>{review.avatar}</div>
                  <div>
                    <span className={styles.reviewerName}>{review.customerName}</span>
                    {review.location && (
                      <span className={styles.reviewerLocation}>{review.location}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className={styles.navigation}>
            <button className={styles.navBtn} onClick={prevSlide} aria-label="Previous">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <div className={styles.dots}>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === currentIndex ? styles.activeDot : ''}`}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Page ${i + 1}`}
                />
              ))}
            </div>
            <button className={styles.navBtn} onClick={nextSlide} aria-label="Next">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
