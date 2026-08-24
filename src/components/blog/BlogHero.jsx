import "../styles/blogHero.css";
 
export default function BlogHero({
  imageUrl,
  heroImageAlt = "",
  eyebrow,
  title,
  authorName,
  authorAvatarUrl,
  dateISO,
  readTime,
  linkUrl,
  linkLabel,
}) {
  const dateDisplay = dateISO
    ? new Date(dateISO).toLocaleDateString("sv-SE", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;
 
  return (
    <section
      className="blog-hero"
      style={{ backgroundImage: `url(${imageUrl})` }}
      role="img"
      aria-label={heroImageAlt}
    >
      <div className="blog-hero__scrim" />
 
      <div className="blog-hero__content">
        {eyebrow && <span className="blog-hero__eyebrow">{eyebrow}</span>}
 
        <h1 className="blog-hero__title">{title}</h1>
 
        <div className="blog-hero__meta">
          {authorAvatarUrl && (
            <img
              className="blog-hero__avatar"
              src={authorAvatarUrl}
              alt=""
              width={32}
              height={32}
              loading="eager"
            />
          )}
 
          {authorName && (
            <span className="blog-hero__author">{authorName}</span>
          )}
 
          {dateDisplay && (
            <>
              <span className="blog-hero__dot">•</span>
              <time className="blog-hero__date" dateTime={dateISO}>
                {dateDisplay}
              </time>
            </>
          )}
 
          {readTime && (
            <>
              <span className="blog-hero__dot">•</span>
              <span className="blog-hero__read">{readTime}</span>
            </>
          )}
 
          {linkUrl && (
            <>
              <span className="blog-hero__dot">•</span>
              <a
                className="blog-hero__link"
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {linkLabel}
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