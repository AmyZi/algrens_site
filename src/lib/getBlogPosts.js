import { cache } from 'react';

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
 * Throttles ALL WP requests to a fixed minimum spacing, regardless of
 * caching or retries. This is prevention, not cleanup — a per-minute
 * rate limit doesn't care how well-behaved retries are AFTER a request
 * fires; it cares how many requests land in the window. Sequential
 * single-worker build (per your log) means a simple last-request
 * timestamp is enough — no queue library needed.
 */
let lastRequestAt = 0;
const MIN_REQUEST_SPACING_MS = 300;

async function throttle() {
  const wait = lastRequestAt + MIN_REQUEST_SPACING_MS - Date.now();
  if (wait > 0) {
    await new Promise((resolve) => setTimeout(resolve, wait));
  }
  lastRequestAt = Date.now();
}

/**
 * Wraps fetch with spacing + retry-on-429 (longer backoff than before —
 * 2s/4s/8s/16s — since a 7s total window clearly wasn't surviving
 * whatever cooldown the host's rate limiter enforces). Deliberately
 * does NOT cache responses — some callers (getBlogPostBySlug) need a
 * genuine re-fetch on retry, not a cached empty result.
 */
async function fetchWithRetry(url, options = {}, { retries = 4, baseDelayMs = 2000 } = {}) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    await throttle();
    const res = await fetch(url, options);

    if (res.status === 429 && attempt < retries) {
      const delay = baseDelayMs * 2 ** attempt; // 2s, 4s, 8s, 16s
      await new Promise((resolve) => setTimeout(resolve, delay));
      continue;
    }

    return res;
  }
}

/**
 * All published blog posts. No try/catch here on purpose: if this fetch
 * fails, generateStaticParams() should throw with the real error rather
 * than silently returning [] — an empty array from generateStaticParams
 * under output: 'export' is a known Next.js bug that gets misreported as
 * "missing generateStaticParams()" instead of showing the real cause.
 */
export async function getAllBlogPosts() {
  const res = await fetchWithRetry(
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

export const getBlogPostBySlug = cache(async function getBlogPostBySlug(slug, attempt = 1) {
  const res = await fetchWithRetry(
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
    await new Promise((r) => setTimeout(r, 1500 * attempt));
    return getBlogPostBySlug(slug, attempt + 1);
  }

  return post;
});

export async function getRelatedVehicle(vehicleId) {
  if (!vehicleId) return null;
  try {
    const res = await fetchWithRetry(
      `${WP_API}/car_listing/${vehicleId}`,
      { cache: 'force-cache' }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

const CAR_FIELDS = ['id', 'slug', 'date', 'title', 'meta'].join(',');

/**
 * Every post with a related vehicle triggers this — without caching,
 * that's a full re-fetch of all 100 car_listing posts per post, which
 * is the main volume driver behind the 429s. Safe to cache in full
 * (unlike getBlogPostBySlug): there's no "might need a fresh look"
 * requirement here, and the build runs in a single Node process
 * ("Generating static pages using 1 worker"), so this module-level
 * variable persists across every page built.
 *
 * allCarsPromise (not just the resolved value) is cached so that if
 * two pages happen to call this before the first fetch resolves, they
 * share the same in-flight request instead of firing two.
 */
let allCarsPromise = null;

async function getAllCarListings() {
  if (!allCarsPromise) {
    allCarsPromise = (async () => {
      const res = await fetchWithRetry(
        `${WP_API}/car_listing?per_page=100&_fields=${CAR_FIELDS}`,
        { cache: 'force-cache' }
      );
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    })();
  }
  return allCarsPromise;
}

export async function getSimilarVehicles(relatedVehicle, { limit = 4 } = {}) {
  if (!relatedVehicle) return [];

  const vehicleType = relatedVehicle.meta?._car_vehicle_type;
  if (!vehicleType) return [];

  try {
    const allCars = await getAllCarListings();

    return allCars
      .filter(car => car.id !== relatedVehicle.id)
      .filter(car => car.meta?._car_vehicle_type === vehicleType)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  } catch {
    return [];
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