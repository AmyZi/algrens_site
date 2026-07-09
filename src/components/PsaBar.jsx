'use client';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function PsaBar({ announcements }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const id = setInterval(() => {
      setIndex(prev => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(id);
  }, [announcements.length]);

  if (!announcements || announcements.length === 0) return null;

  const current = announcements[index];

  return (
    <div className="psa-bar">
      <div className="psa-bar__inner">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4 }}
            className="psa-bar__message"
          >
            <span>{current.message}</span>
            {current.linkUrl && (
              <a href={current.linkUrl} className="psa-bar__link">
                {current.linkLabel || 'Läs mer'}
              </a>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}