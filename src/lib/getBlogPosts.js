const WP_API = process.env.NEXT_PUBLIC_WP_API_URL;

if (!WP_API) {
  throw new Error(
    'NEXT_PUBLIC_WP_API_URL is not set at build time. Check .env.local / ' +
    '.env.production locally, or the workflow YAML env: mapping in CI ' +
    '(secrets.WP_API_URL -> NEXT_PUBLIC_WP_API_URL).'
  );
}

const POST_FIELDS = [
  'id',
  'slug',
  'date',
  'title',
  'excerpt',
  'content',
  'author',
  'featured_media',
  'meta',
  '_links',
  '_embedded',
].join(',');

/**
 * All published blog posts. No try/catch here on purpose: if this fetch
 * fails, generateStaticParams() should throw with the real error rather
 * than silently returning [] — an empty array from generateStaticParams
 * under output: 'export' is a known Next.js bug that gets misreported as
 * "missing generateStaticParams()" instead of showing the real cause.
 */
export async function getAllBlogPosts() {
  const res = await fetch(
    `${WP_API}/posts?per_page=100&_embed`,
    { cache: 'force-cache' }
  );

  if (!res.ok) {
    throw new Error(
      `WP posts fetch failed: ${res.status} ${res.statusText} — URL: ${WP_API}/posts`
    );
  }

  const posts = await res.json();

  if (!Array.isArray(posts)) {
    throw new Error(`WP posts response was not an array — got: ${JSON.stringify(posts).slice(0, 200)}`);
  }

  return posts;
}

export async function getBlogPostBySlug(slug, attempt = 1) {
  const res = await fetch(
    `${WP_API}/posts?slug=${encodeURIComponent(slug)}` +
      `&_embed` +
      `&_fields=${POST_FIELDS}`,
    { cache: 'force-cache' }
  );

  if (!res.ok) {
    throw new Error(
      `WP post-by-slug fetch failed for "${slug}": ${res.status} ${res.statusText}`
    );
  }

  const data = await res.json();
  const post = data?.[0] ?? null;

  if (!post && attempt < 3) {
    await new Promise((r) => setTimeout(r, 3500 * attempt));
    return getBlogPostBySlug(slug, attempt + 1);
  }

  return post;
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

export function getHeroProps(post) {
  if (!post) return null;

  const author = post._embedded?.author?.[0];
  const categories = getPostCategories(post);

  return {
    title: post.title.rendered,
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