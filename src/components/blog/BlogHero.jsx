import '@/styles/blogHero.css';

export default function BlogHero({
  eyebrow = 'Köpguide',
  title,
  imageUrl,
  authorName,
  authorAvatarUrl,
  dateISO,
  readTime,
  linkUrl,
  linkLabel = 'Läs mer',
}) {
  const formattedDate = dateISO
    ? new Intl.DateTimeFormat('sv-SE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(dateISO))
    : null;

  return (
    <section
      className="blog-hero"
      style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
    >
      <div className="blog-hero__scrim" />

      <div className="blog-hero__content">
        {eyebrow && <span className="blog-hero__eyebrow">{eyebrow}</span>}

        <h1
          className="blog-hero__title"
          dangerouslySetInnerHTML={{ __html: title }}
        />

        <div className="blog-hero__meta">
          {authorAvatarUrl && (
            <img
              className="blog-hero__avatar"
              src={authorAvatarUrl}
              alt={authorName}
              width={32}
              height={32}
            />
          )}
          <span className="blog-hero__author">{authorName}</span>

          {formattedDate && (
            <>
              <span className="blog-hero__dot">•</span>
              <time className="blog-hero__date" dateTime={dateISO}>
                {formattedDate}
              </time>
            </>
          )}

          {readTime && (
            <>
              <span className="blog-hero__dot">•</span>
              <span className="blog-hero__read">{readTime}</span>
            </>
          )}

          {/* Optional company/related link — only renders when the editor filled it in */}
          {linkUrl && (
            <>
              <span className="blog-hero__dot">•</span>
              <a
                className="blog-hero__link"
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {linkLabel} ↗
              </a>
            </>
          )}
        </div>
      </div>

      <div className="blog-hero__scroll" aria-hidden="true">
        <span className="blog-hero__scroll-track">
          <span className="blog-hero__scroll-dash" />
        </span>
        <span className="blog-hero__scroll-label">Scrolla</span>
      </div>
    </section>
  );
}