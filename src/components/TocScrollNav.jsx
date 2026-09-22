'use client';

import { useRef } from 'react';

/**
 * Horizontal scrollable pill nav.
 */

export default function TocScrollNav({ headings }) {
  const trackRef = useRef(null);

  if (!headings || headings.length === 0) return null;

  const scrollBy = (amount) => {
    trackRef.current?.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <nav aria-label="Innehåll" className="toc-nav">
      <button
        type="button"
        className="toc-nav__arrow toc-nav__arrow--prev"
        aria-label="Bläddra bakåt"
        onClick={() => scrollBy(-200)}
      >
        &#8249;
      </button>

      <ul className="toc-nav__track" ref={trackRef}>
        {headings.map((h) => (
          <li key={h.id} className="toc-nav__item">
            <a href={`#${h.id}`} className="toc-nav__link">
              {h.label}
            </a>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="toc-nav__arrow toc-nav__arrow--next"
        aria-label="Bläddra framåt"
        onClick={() => scrollBy(200)}
      >
        &#8250;
      </button>
    </nav>
  );
}