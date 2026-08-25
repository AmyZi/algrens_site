const WP_API = process.env.NEXT_PUBLIC_WP_API_URL;

// _fields trims Astra's REST bloat on the single-post fetch.
// _embedded must be listed explicitly or the embed data (author,
// featured image, terms) gets stripped back out by the _fields filter.
const POST_FIELDS = [
  'id',
  'slug',
  'date',
  'modified',
  'title',
  'excerpt',
  'content',
  'author',
  'featured_media',
  'meta',
  '_embedded',
].join(',');

export async function getAllBlogPosts() {
  try {
    const res = await fetch(
      `${WP_API}/posts?per_page=100&_embed`,
      { cache: 'force-cache' }
    );
    if (!res.ok) return [];
    const posts = await res.json();
    return Array.isArray(posts) ? posts : [];
  } catch (err) {
    console.error('getAllBlogPosts:', err);
    return [];
  }
}

// Single source of truth for fetching one post by slug.
// Used by both the page's content render and getHeroProps() below.
export async function getBlogPostBySlug(slug) {
  try {
    const res = await fetch(
      `${WP_API}/posts?slug=${encodeURIComponent(slug)}` +
        `&_embed=author,wp:featuredmedia,wp:term` +
        `&_fields=${POST_FIELDS}`,
      { cache: 'force-cache' }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.[0] ?? null;
  } catch {
    return null;
  }
}

export async function getRelatedVehicle(vehicleId) {
  if (!vehicleId) return null;
  try {
    const res = await fetch(
      `${WP_API}/car_listing/${vehicleId}`,
      { cache: 'force-cache' }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export function getFeaturedImageUrl(post) {
  return (
    post?._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    '/images/og-image.jpg'
  );
}

export function getPostCategories(post) {
  const terms = post?._embedded?.['wp:term']?.[0] || [];
  return terms.map(t => t.name);
}

export function getReadingTime(htmlContent = '') {
  const text = htmlContent.replace(/<[^>]+>/g, ' ');
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(wordCount / 200));
  return `${minutes} min läsning`;
}

export function getFaqItems(post) {
  const raw = post?.meta?._faq_items;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Blog-equivalent of vehicleUrl() in seo.js — keep both in sync.
export function blogPostUrl(post) {
  return `https://www.ahlgrens.eu/blogg/${post.slug}/`;
}

// Shapes a fetched post into BlogHero props. Pure function, no fetch —
// reuses getFeaturedImageUrl / getReadingTime / getPostCategories above,
// so formatting stays in one place per concern.
//
// _hero_link_url / _hero_link_label: optional, separate from the author
// byline (matches the rvproseal.ca reference — plain "Author · Date",
// no link on the name). Empty meta -> linkUrl is null -> BlogHero hides it.
//
// dateISO is passed through raw; BlogHero.jsx does the sv-SE formatting,
// so it isn't duplicated here.
export function getHeroProps(post) {
  if (!post) return null;

  const author = post._embedded?.author?.[0];
  const categories = getPostCategories(post);

  return {
    title: post.title?.rendered || '',
    imageUrl: getFeaturedImageUrl(post),
    eyebrow: categories[0] ?? null,
    authorName: author?.name ?? 'Ahlgrens Husbilar',
    authorAvatarUrl: author?.avatar_urls?.['96'] ?? null,
    dateISO: post.date,
    readTime: getReadingTime(post.content?.rendered),
    linkUrl: post.meta?._hero_link_url || null,
    linkLabel: post.meta?._hero_link_label || 'Läs mer',
  };
}