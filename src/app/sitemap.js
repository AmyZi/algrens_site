const BASE_URL = 'https://ahlgrens.eu';
const WP_API = process.env.NEXT_PUBLIC_WP_API_URL || 'https://ahlgrens.eu/wp-json/wp/v2';

async function fetchAllVehicleSlugs() {
  const slugs = [];
  let page = 1;

  while (true) {
    try {
      const res = await fetch(
        `${WP_API}/bilar?per_page=100&page=${page}&_fields=slug,modified,meta`,
        { cache: 'force-cache' }
      );
      if (!res.ok) break;

      const cars = await res.json();
      if (!cars.length) break;

      cars.forEach(car => {
        const isNew = car.meta?._car_is_new === 'yes';
        slugs.push({
          slug: car.slug,
          path: isNew ? `/nytt/${car.slug}/` : `/begagnade/${car.slug}/`,
          lastModified: car.modified || new Date().toISOString(),
        });
      });

      const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1');
      if (page >= totalPages) break;
      page++;
    } catch (err) {
      console.error('sitemap: failed to fetch vehicles', err);
      break;
    }
  }

  return slugs;
}

async function fetchAllBlogSlugs() {
  const slugs = [];
  let page = 1;

  while (true) {
    try {
      const res = await fetch(
        `${WP_API}/posts?per_page=100&page=${page}&_fields=slug,modified`,
        { cache: 'force-cache' }
      );
      if (!res.ok) break;

      const posts = await res.json();
      if (!posts.length) break;

      posts.forEach(post => {
        slugs.push({
          slug: post.slug,
          path: `/blogg/${post.slug}/`,
          lastModified: post.modified || new Date().toISOString(),
        });
      });

      const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1');
      if (page >= totalPages) break;
      page++;
    } catch (err) {
      console.error('sitemap: failed to fetch blog posts', err);
      break;
    }
  }

  return slugs;
}

export default async function sitemap() {
  const now = new Date().toISOString();

  // ── Static pages ──────────────────────────────────────────────
  const staticPages = [
    { url: `${BASE_URL}/`,                              lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE_URL}/bilar/`,                         lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE_URL}/boras-husbilar-husvagnar/`,      lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/om-oss/`,                        lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/kontakt/`,                       lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/marken/`,                        lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/garage/`,                        lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  // ── Dynamic vehicle pages ────────────────────────────────────
  const vehicles = await fetchAllVehicleSlugs();
  const vehiclePages = vehicles.map(v => ({
    url: `${BASE_URL}${v.path}`,
    lastModified: v.lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // ── Dynamic blog pages ───────────────────────────────────────
  const posts = await fetchAllBlogSlugs();
  const blogPages = posts.map(p => ({
    url: `${BASE_URL}${p.path}`,
    lastModified: p.lastModified,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...vehiclePages, ...blogPages];
}