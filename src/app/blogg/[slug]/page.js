// src/app/blogg/[slug]/page.js
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  getRelatedVehicle,
  getFeaturedImageUrl,
  getReadingTime,
  getPostCategories,
  getFaqItems,
  blogPostUrl,
} from '@/lib/getBlogPosts';
import { stripHtml, truncateDescription, vehicleTitle, vehicleUrl } from '@/lib/seo';
import '@/styles/blogPost.css';

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return { title: 'Blogginlägg', robots: { index: false, follow: true } };
  }

  const meta = post.meta || {};
  const title = meta._seo_title?.trim() || `${stripHtml(post.title.rendered)} – Ahlgrens Husbilar`;
  const description =
    meta._seo_description?.trim() ||
    truncateDescription(stripHtml(post.excerpt.rendered));
  const image = getFeaturedImageUrl(post);

  return {
    title,
    description,
    alternates: { canonical: blogPostUrl(post) },
    openGraph: {
      title,
      description,
      url: blogPostUrl(post),
      type: 'article',
      images: [{ url: image }],
    },
  };
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const meta = post.meta || {};
  const image = getFeaturedImageUrl(post);
  const faqItems = getFaqItems(post);
  const relatedVehicle = meta._related_vehicle_id
    ? await getRelatedVehicle(meta._related_vehicle_id)
    : null;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: stripHtml(post.title.rendered),
    description: stripHtml(post.excerpt.rendered),
    image: [image],
    datePublished: post.date,
    dateModified: post.modified,
    author: { '@type': 'Organization', name: 'Ahlgrens Husbilar' },
    publisher: {
      '@type': 'Organization',
      name: 'Ahlgrens Husbilar',
      logo: { '@type': 'ImageObject', url: 'https://www.ahlgrens.eu/images/logo.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': blogPostUrl(post) },
  };

  // Only emit FAQPage schema when the author actually filled in Q&A pairs —
  // don't force it onto every post.
  const faqJsonLd =
    faqItems.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems.map(item => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          })),
        }
      : null;

  return (
    <main className="blog-post">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <div className="container">
        <article className="blog-post__article">
          <header className="blog-post__header">
            {getPostCategories(post).length > 0 && (
              <div className="blog-post__tags">
                {getPostCategories(post).map(cat => (
                  <span key={cat} className="blog-post__tag">{cat}</span>
                ))}
              </div>
            )}
            <h1
              className="blog-post__title"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
            <div className="blog-post__meta">
              <span>{formatDate(post.date)}</span>
              <span>·</span>
              <span>{getReadingTime(post.content.rendered)}</span>
            </div>
          </header>

          <div className="blog-post__cover-wrap">
            <Image
              src={image}
              alt={post.title.rendered}
              fill
              sizes="(min-width: 1024px) 800px, 100vw"
              className="blog-post__cover"
              priority
            />
          </div>

          <div
            className="blog-post__content"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />

          {relatedVehicle && (
            <div className="blog-post__related-vehicle">
              <p className="blog-post__related-label">Nämnd i det här inlägget</p>
              <Link
                href={vehicleUrl(relatedVehicle)}
                className="blog-post__related-link"
              >
                {vehicleTitle(relatedVehicle)} →
              </Link>
            </div>
          )}

          {faqItems.length > 0 && (
            <section className="blog-post__faq">
              <h2 className="blog-post__faq-title">Vanliga frågor</h2>
              {faqItems.map((item, i) => (
                <div className="blog-post__faq-item" key={i}>
                  <h3 className="blog-post__faq-question">{item.question}</h3>
                  <p className="blog-post__faq-answer">{item.answer}</p>
                </div>
              ))}
            </section>
          )}
        </article>

        <div className="blog-post__back">
          <Link href="/blogg/">← Tillbaka till bloggen</Link>
        </div>
      </div>
    </main>
  );
}