export const dynamic = 'force-static';

const BASE_URL = 'https://ahlgrens.eu';
const WP_API = process.env.NEXT_PUBLIC_WP_API_URL || 'https://ahlgrens.eu/wp-json/wp/v2';

async function safeFetchJson(url) {
  try {
    const res = await fetch(url, { cache: 'force-cache' });
    if (!res.ok) {
      console.error(`sitemap: ${url} returned ${res.status}`);
      return { data: [], totalPages: 0 };
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
      console.error(`sitemap: ${url} did not return an array`);
      return { data: [], totalPages: 0 };
    }
    const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10) || 1;
    return { data, totalPages };
  } catch (err) {
    console.error(`sitemap: fetch failed for ${url}`, err.message);
    return { data: [], totalPages: 0 };
  }
}

async function fetchAllVehicleSlugs() {
  const slugs = [];
  let page = 1;
  let totalPages = 1;

  do {
    const url = `${WP_API}/bilar?per_page=100&page=${page}&_fields=slug,modified,meta`;
    const { data, totalPages: tp } = await safeFetchJson(url);
    if (!data.length) break;
    totalPages = tp;

    data.forEach(car => {
      if (!car?.slug) return;
      slugs.push({
        url: vehicleUrl(car), 
        lastModified: car.modified || new Date().toISOString(),
      });
    });

    page++;
  } while (page <= totalPages);

  return slugs;
}

async function fetchAllBlogSlugs() {
  const slugs = [];
  let page = 1;
  let totalPages = 1;

  do {
    const url = `${WP_API}/posts?per_page=100&page=${page}&_fields=slug,modified`;
    const { data, totalPages: tp } = await safeFetchJson(url);
    if (!data.length) break;
    totalPages = tp;

    data.forEach(post => {
      if (!post?.slug) return;
      slugs.push({
        path: `/blogg/${post.slug}/`,
        lastModified: post.modified || new Date().toISOString(),
      });
    });

    page++;
  } while (page <= totalPages);

  return slugs;
}

export default async function sitemap() {
  const now = new Date().toISOString();

  const staticPages = [
    { url: `${BASE_URL}/`,                         lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE_URL}/bilar/`,                    lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE_URL}/boras-husbilar-husvagnar/`, lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/om-oss/`,                   lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/kontakt/`,                  lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/marken/`,                   lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/garage/`,                   lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/blogg/`,                    lastModified: now, changeFrequency: 'weekly',  priority: 0.5 },
    { url: `${BASE_URL}/mopedbil/`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ];

  let vehiclePages = [];
  let blogPages = [];

  try {
    const vehicles = await fetchAllVehicleSlugs();
    vehiclePages = vehicles.map(v => ({
      url: v.url,
      lastModified: v.lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (err) {
    console.error('sitemap: vehicle fetch block failed', err.message);
  }

  try {
    const posts = await fetchAllBlogSlugs();
    blogPages = posts.map(p => ({
      url: `${BASE_URL}${p.path}`,
      lastModified: p.lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    }));
  } catch (err) {
    console.error('sitemap: blog fetch block failed', err.message);
  }

  return [...staticPages, ...vehiclePages, ...blogPages];
}