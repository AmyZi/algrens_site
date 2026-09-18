export const siteUrl = 'https://www.ahlgrens.eu';
export const businessName = 'Ahlgrens Husbilar';
export const businessPhone = '+4633103011';
export const businessEmail = 'jonas@ahlgrens.eu';
export const businessAddress = {
  streetAddress: 'Gånghestervägen 129',
  addressLocality: 'Borås',
  postalCode: '507 65',
  addressCountry: 'SE',
};

export function absoluteUrl(path = '/') {
  return new URL(path, siteUrl).toString();
}

export function stripHtml(value = '') {
  return String(value).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

export function truncateDescription(value, maxLength = 155) {
  const clean = stripHtml(value);
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 1).trim()}…`;
}

export function vehicleTitle(car, fallback = 'Husbil till salu') {
  const title = stripHtml(car?.title?.rendered || fallback);
  const year = car?.meta?._car_year;
  return year && !title.includes(year) ? `${title} ${year}` : title;
}

export function vehicleUrl(car) {
  const isNew = car?.meta?._car_is_new === 'yes';
  const folder = isNew ? 'nytt' : 'begagnat';
  return absoluteUrl(`/bilar/${folder}/${car?.slug}/`);
}

/**
 * Strips a featured image that's been duplicated inside post content —
 * either the Gutenberg core "Post Featured Image" block (always renders
 * whatever image is set as featured), or a manually re-inserted Image
 * block using the exact same URL at the very start of the content.
 */
export function stripDuplicateFeaturedImage(contentHtml, featuredImageUrl) {
  if (!contentHtml) return contentHtml;

  let result = contentHtml;

  // 1. The dynamic Post Featured Image block, wherever it appears.
  result = result.replace(
    /<figure[^>]*class="[^"]*wp-block-post-featured-image[^"]*"[^>]*>[\s\S]*?<\/figure>/gi,
    ''
  );

  // 2. A leading manually-duplicated image matching the exact featured URL.
  if (featuredImageUrl) {
    const escaped = featuredImageUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const leadingImageRegex = new RegExp(
      `^\\s*(<figure[^>]*>\\s*)?<img[^>]*src="${escaped}"[^>]*>(\\s*</figure>)?`,
      'i'
    );
    result = result.replace(leadingImageRegex, '');
  }

  return result.trim();
}

/**
 * Finds every <h2> in post content, injects a URL-safe id into it, and
 * returns both the transformed HTML and the {id, label} list for a TOC nav.
 * One pass, single source of truth — the ids used for href="#..." are the
 * exact same ids injected into the headings, so they can't drift apart.
 */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function addHeadingAnchors(html) {
  if (!html) return { html, headings: [] };

  const headings = [];
  const seenSlugs = new Map();

  const transformed = html.replace(
    /<h2([^>]*)>([\s\S]*?)<\/h2>/gi,
    (match, attrs, innerHtml) => {
      const label = innerHtml.replace(/<[^>]+>/g, '').trim();
      let slug = slugify(label) || 'sektion';

      const count = seenSlugs.get(slug) || 0;
      seenSlugs.set(slug, count + 1);
      if (count > 0) slug = `${slug}-${count + 1}`; // de-dupe identical headings

      headings.push({ id: slug, label });

      const hasId = /\sid=/.test(attrs);
      const newAttrs = hasId ? attrs : `${attrs} id="${slug}"`;

      return `<h2${newAttrs}>${innerHtml}</h2>`;
    }
  );

  return { html: transformed, headings };
}

export function autoDealerJsonLd({ url = siteUrl, description = 'Husbilar och husvagnar i Borås.' } = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    '@id': `${siteUrl}/#autodealer`,
    name: businessName,
    url,
    description,
    telephone: businessPhone,
    email: businessEmail,
    image: absoluteUrl('/images/og-image.jpg'),
    address: {
      '@type': 'PostalAddress',
      ...businessAddress,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 57.721,
      longitude: 12.9401,
    },
    sameAs: [
      'https://www.facebook.com/p/Ahlgrens-husbilar-61577980988245/',
    ],

    areaServed: ['Borås', 'Västra Götaland', 'Sverige'],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '10:00',
        closes: '17:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '14:00',
      },
    ],
  };
}