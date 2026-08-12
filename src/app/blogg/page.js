import Link from 'next/link';
import Image from 'next/image';
import {
  getAllBlogPosts,
  getFeaturedImageUrl,
  getReadingTime,
  getPostCategories,
} from '@/lib/getBlogPosts';
import '@/styles/blogPage.css';

export const metadata = {
  title: 'Blogg – Ahlgrens Husbilar',
  description:
    'Tips, guider och nyheter om husbilar och husvagnar från Ahlgrens Husbilar i Borås.',
  alternates: { canonical: 'https://www.ahlgrens.eu/blogg/' },
  openGraph: {
    title: 'Blogg – Ahlgrens Husbilar',
    description:
      'Tips, guider och nyheter om husbilar och husvagnar från Ahlgrens Husbilar i Borås.',
    url: 'https://www.ahlgrens.eu/blogg/',
    type: 'website',
  },
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogListPage() {
  const posts = await getAllBlogPosts();

  return (
    <main className="blog-page">
      <div className="container">
        <header className="blog-page__header">
          <span className="blog-page__eyebrow">Ahlgrens blogg</span>
          <h1 className="blog-page__title">Tips &amp; guider om husbilsliv</h1>
          <p className="blog-page__intro">
            Allt du behöver veta om att köpa, hyra och underhålla husbil eller
            husvagn — skrivet av oss på Ahlgrens i Borås.
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="blog-page__empty">Inga blogginlägg hittades just nu.</p>
        ) : (
          <div className="blog-page__grid">
            {posts.map(post => (
              <Link
                key={post.id}
                href={`/blogg/${post.slug}/`}
                className="blog-card"
              >
                <div className="blog-card__image-wrap">
                  <Image
                    src={getFeaturedImageUrl(post)}
                    alt={post.title.rendered}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="blog-card__image"
                  />
                </div>
                <div className="blog-card__body">
                  {getPostCategories(post).length > 0 && (
                    <div className="blog-card__tags">
                      {getPostCategories(post).slice(0, 2).map(cat => (
                        <span key={cat} className="blog-card__tag">
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                  <h2
                    className="blog-card__title"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                  <div
                    className="blog-card__excerpt"
                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                  />
                  <div className="blog-card__meta">
                    <span>{formatDate(post.date)}</span>
                    <span>·</span>
                    <span>{getReadingTime(post.content.rendered)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}