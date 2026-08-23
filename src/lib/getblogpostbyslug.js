// Custom blog post header.
// Uses _embed=author,wp:featuredmedia to pull in the real author (name +
// avatar) instead of just the author ID. _fields is trimmed to fight Astra's
// REST bloat — note _embedded has to be listed explicitly or the embed data
// gets stripped back out by the _fields filter.

const HERO_FIELDS = [
  'id',
  'slug',
  'date',
  'title',
  'content',
  'author',
  'featured_media',
  'meta',
  '_embedded',
].join(',');

export async function getBlogPostBySlug(slug) {
  const url =
    `${process.env.NEXT_PUBLIC_WP_API_URL}/posts` +
    `?slug=${encodeURIComponent(slug)}` +
    `&_embed=author,wp:featuredmedia` +
    `&_fields=${HERO_FIELDS}`;

  const res = await fetch(url, { cache: 'force-cache' });
  if (!res.ok) return null;

  const [post] = await res.json();
  if (!post) return null;

  const author = post._embedded?.author?.[0];
  const media = post._embedded?.['wp:featuredmedia']?.[0];

  const plainText = post.content.rendered.replace(/<[^>]+>/g, ' ');
  const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;
  const readTime = `${Math.max(1, Math.round(wordCount / 200))} min läsning`;

  return {
    ...post,
    hero: {
      title: post.title.rendered,
      imageUrl: media?.source_url ?? null,
      authorName: author?.name ?? 'Ahlgrens Husbilar',
      authorAvatarUrl: author?.avatar_urls?.['96'] ?? null,
      dateISO: post.date,
      readTime,
      linkUrl: post.meta?._hero_link_url || null,
      linkLabel: post.meta?._hero_link_label || 'Läs mer',
    },
  };
}