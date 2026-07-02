import BorasContent from './BorasContent';

const WP_API = process.env.NEXT_PUBLIC_WP_API_URL || 'https://ahlgrens.eu/wp-json/wp/v2';

async function fetchBorasCars() {
  try {
    const allCars = [];
    let page = 1;

    while (true) {
      const res = await fetch(
        `${WP_API}/bilar?per_page=100&page=${page}&_fields=id,slug,title,meta&cache=force-cache`,
        { cache: 'force-cache' }
      );
      if (!res.ok) break;

      const cars = await res.json();
      if (!cars.length) break;

      allCars.push(...cars);

      const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1');
      if (page >= totalPages) break;
      page++;
    }

    // Return only unsold vehicles
    return allCars.filter(car => car.meta?._car_is_sold !== 'yes');
  } catch (err) {
    console.error('fetchBorasCars error:', err);
    return [];
  }
}

export const metadata = {
  title: 'Husbilar & Husvagnar i Borås | Ahlgrens Husbilar',
  description:
    'Köp husbilar och husvagnar i Borås hos Ahlgrens. Vi är din lokala återförsäljare i Borås med ett brett sortiment av begagnade och nya husbilar och husvagnar. Välkommen!',
};

export default async function BorasPage() {
  const cars = await fetchBorasCars();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: 'Ahlgrens Husbilar',
    description: 'Husbilar och husvagnar i Borås',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Gånghestervägen 129',   // update if different
      addressLocality: 'Borås',
      addressCountry: 'SE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 57.7210,
      longitude: 12.9401,
    },
    url: 'https://ahlgrens.eu/boras-husbilar-husvagnar',
    areaServed: 'Borås',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BorasContent cars={cars} />
    </>
  );
}