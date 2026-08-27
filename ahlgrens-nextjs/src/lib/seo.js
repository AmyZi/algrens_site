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