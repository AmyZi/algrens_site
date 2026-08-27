'use client';

import { useState, useEffect } from 'react';

export default function PsaBar({ announcements = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (announcements.length <= 1) return;

    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
        setFade(true);
      }, 400);

    }, 5000);

    return () => clearInterval(interval);
  }, [announcements]);

  if (!announcements || announcements.length === 0) return null;

  const current = announcements[currentIndex];

  return (
    <div className="psa-bar">
      <div className="psa-bar__track">
        <div
          className={`psa-ticker-text ${fade ? 'fade-in' : ''}`}
          style={{ transition: 'opacity 0.4s ease-in-out' }}
        >
          <span>{current.message}</span>
          {current.linkUrl && (
            <a href={current.linkUrl} className="psa-bar__link">
              {current.linkLabel || 'Läs mer'}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}