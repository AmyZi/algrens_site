// Custom blog post header.
// Uses _embed=author,wp:featuredmedia to pull in the real author (name +
// avatar) instead of just the author ID. _fields is trimmed to fight Astra's
// REST bloat — note _embedded has to be listed explicitly or the embed data
// gets stripped back out by the _fields filter.

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
  'categories',
  'meta',
  '_links',
  '_embedded',
].join(',');

export async function getBlogPostBySlug(slug) {
  const url =
    `${process.env.NEXT_PUBLIC_WP_API_URL}/posts` +
    `?slug=${encodeURIComponent(slug)}` +
    `&_embed=author,wp:featuredmedia,wp:term` +
    `&_fields=${POST_FIELDS}`;

  const res = await fetch(url, { cache: 'force-cache' });
  if (!res.ok) return null;

  const [post] = await res.json();
  if (!post) return null;

  const author = post._embedded?.author?.[0];

  return {
    ...post,
    hero: {
      title: post.title.rendered,
      imageUrl: getFeaturedImageUrl(post),
      authorName: author?.name ?? 'Ahlgrens Husbilar',
      authorAvatarUrl: author?.avatar_urls?.['96'] ?? null,
      dateISO: post.date,
      readTime: getReadingTime(post.content.rendered),
      linkUrl: post.meta?._hero_link_url || null,
      linkLabel: post.meta?._hero_link_label || 'Läs mer',
    },
  };
}