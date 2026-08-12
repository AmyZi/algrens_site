
const WP_API = process.env.NEXT_PUBLIC_WP_API_URL;

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

export async function getBlogPostBySlug(slug) {
  try {
    const res = await fetch(
      `${WP_API}/posts?slug=${slug}&_embed`,
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