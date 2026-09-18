import Link from 'next/link';
import { stripHtml, truncateDescription, } from '@/lib/seo';
import { getFeaturedImageUrl, getPostCategories, blogPostUrl } from '@/lib/getBlogPosts';

export default function BlogPreviewCard({ post }) {
  const img = getFeaturedImageUrl(post);
  const categories = getPostCategories(post);
  const eyebrow = categories[0] ?? null;
  const excerpt = truncateDescription(post.excerpt?.rendered, 110);
  const author = post._embedded?.author?.[0];
  const authorName = author?.name ?? 'Ahlgrens Husbilar';
  const authorAvatarUrl = author?.avatar_urls?.['48'] ?? null;
  const dateDisplay = new Date(post.date).toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Link href={blogPostUrl(post)} className="blog-preview-card">
      <div className="blog-preview-card__image-wrap">
        <img
          src={img}
          alt={stripHtml(post.title.rendered)}
          className="blog-preview-card__image"
        />
      </div>

      <div className="blog-preview-card__body">
        {eyebrow && (
          <span className="blog-preview-card__eyebrow">{eyebrow}</span>
        )}

        <h3
          className="blog-preview-card__title"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />

        <p className="blog-preview-card__excerpt">{excerpt}</p>

        <div className="blog-preview-card__meta">
          {authorAvatarUrl && (
            <img
              src={authorAvatarUrl}
              alt=""
              className="blog-preview-card__avatar"
              width={24}
              height={24}
              loading="lazy"
            />
          )}
          <span className="blog-preview-card__author">{authorName}</span>
          <span className="blog-preview-card__dot">·</span>
          <span className="blog-preview-card__date">{dateDisplay}</span>
        </div>
      </div>
    </Link>
  );
}