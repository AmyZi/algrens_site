'use client';
import '@/styles/HomePage.css';

import { useRef } from 'react';

export default function TocScrollNav({ headings }) {
  const trackRef = useRef(null);

  if (!headings || headings.length === 0) return null;

  const scrollBy = (amount) => {
    trackRef.current?.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <section className="featured-section" id="blog-toc">
      <div className="featured-desktop">
        <div className="featured-slider-container">
          <button
            type="button"
            className="feat-side-btn feat-side-btn--prev"
            aria-label="Bläddra bakåt"
            onClick={() => scrollBy(-200)}
          >&#10216;</button>
          <button
            type="button"
            className="feat-side-btn feat-side-btn--next"
            aria-label="Bläddra framåt"
            onClick={() => scrollBy(200)}
          >&#10217;</button>

          <div className="featured-desktop__swiper" ref={trackRef}>
            {headings.map((h) => (
              <a key={h.id} href={`#${h.id}`} className="featured-link">
                {h.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="featured-mobile">
        <div className="featured-mobile__swiper-clip">
          {headings.map((h) => (
            <a key={h.id} href={`#${h.id}`} className="featured-link">
              {h.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}