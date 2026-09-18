'use client';

import { useState } from 'react';

export default function FaqAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!items || items.length === 0) return null;

  return (
    <section className="blog-post__faq">
      <h2 className="blog-post__faq-title">Vanliga frågor</h2>

      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div className="blog-post__faq-item" key={i}>
            <h3 className="blog-post__faq-question-heading">
              <button
                type="button"
                className="blog-post__faq-question"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${i}`}
                onClick={() => setOpenIndex(isOpen ? null : i)}
              >
                <span>{item.question}</span>
                <span className="blog-post__faq-icon" aria-hidden="true">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
            </h3>

            <div
              id={`faq-answer-${i}`}
              className={`blog-post__faq-answer-wrap${isOpen ? ' blog-post__faq-answer-wrap--open' : ''}`}
            >
              <p className="blog-post__faq-answer">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}