import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  getRelatedVehicle,
  getFeaturedImageUrl,
  getReadingTime,
  getPostCategories,
  getFaqItems,
  getHeroProps,
  blogPostUrl,
  getSimilarVehicles,
} from '@/lib/getBlogPosts';

import { stripHtml,
  truncateDescription,
  vehicleTitle,
  vehicleUrl,
  addHeadingAnchors,
  stripDuplicateFeaturedImage, } from '@/lib/seo';
import '@/styles/blogPage.css';
import SimilarVehicles from '@/components/SimilarVehicles';
import FaqAccordion from '@/components/Faqaccordion';
import Breadcrumb from '@/components/Breadcrumb';
import BlogHero from '@/components/blog/BlogHero';
import TocScrollNav from '@/components/TocScrollNav';


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
  const similarVehicles = relatedVehicle
    ? await getSimilarVehicles(relatedVehicle)
    : [];

  // Injects ids into the post's <h2>s and returns the {id, label} list
  // TocScrollNav needs — single pass, so the anchors and the nav's
  // hrefs can never drift out of sync with each other.
  const { html: contentHtml, headings } = addHeadingAnchors(
    stripDuplicateFeaturedImage(post.content.rendered, image)
  );

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

      <BlogHero {...getHeroProps(post)} />

      <Breadcrumb
        items={[
          { label: 'Hem', href: '/' },
          { label: 'Blogg', href: '/blogg/' },
          { label: stripHtml(post.title.rendered) },
        ]}
        className="blog-post__breadcrumb"
      />
      <TocScrollNav headings={headings} />

      <div className="container">
        <article className="blog-post__article">
          <div
            className="blog-post__content"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
          {faqItems.length > 0 && <FaqAccordion items={faqItems} />}
        </article>
        {similarVehicles.length > 0 && <SimilarVehicles cars={similarVehicles} />}

        <div className="blog-post__back">
          <Link href="/blogg/">← Tillbaka till bloggen</Link>
        </div>
      </div>
    </main>
  );
}