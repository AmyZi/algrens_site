import { notFound } from 'next/navigation';
import CarDetailView from '@/components/CarDetailView';
import SimilarVehicles from '@/components/SimilarVehicles';
import { absoluteUrl, stripHtml, truncateDescription, vehicleTitle, vehicleUrl } from '@/lib/seo';

export async function generateStaticParams() {
  try {
    const res = await fetch(
      'https://www.ahlgrens.eu/wp-json/wp/v2/car_listing?per_page=100&_fields=slug,meta',
      { cache: 'force-cache' }
    );
    if (!res.ok) return [];
    const cars = await res.json();
    if (!Array.isArray(cars)) return [];
    return cars
      .filter(car => car.meta?._car_is_new === 'yes')
      .map(car => ({ slug: car.slug }));
  } catch (err) {
    console.error('generateStaticParams /nytt/[slug]:', err);
    return [];
  }
}

export const dynamicParams = false;

async function getCarData(slug) {
  try {
    const res = await fetch(
      `https://www.ahlgrens.eu/wp-json/wp/v2/car_listing?slug=${slug}&_embed`,
      { cache: 'force-cache' }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.[0] ?? null;
  } catch {
    return null;
  }
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const car = await getCarData(slug);
  if (!car) {
    return {
      title: 'Ny husbil till salu',
      robots: { index: false, follow: true },
    };
  }

  const meta = car.meta || {};
  const title = `${vehicleTitle(car)} - ny husbil till salu`;
  const price = meta._car_price ? `${parseInt(meta._car_price, 10).toLocaleString('sv-SE')} kr` : 'Ring för pris';
  const description = truncateDescription(
    `${vehicleTitle(car)} hos Ahlgrens Husbilar i Borås. Pris: ${price}. ${meta._car_mileage ? `${parseInt(meta._car_mileage, 10).toLocaleString('sv-SE')} mil. ` : ''}Kontakta oss för visning, finansiering och garanti.`
  );
  const image = meta._car_thumbnail || meta._car_gallery_urls?.split(',')?.[0]?.trim() || '/images/og-image.jpg';

  return {
    title,
    description,
    alternates: { canonical: vehicleUrl(car) },
    openGraph: {
      title,
      description,
      url: vehicleUrl(car),
      type: 'website',
      images: [{ url: image }],
    },
  };
}


async function getSimilarCars(currentCar) {
  try {
    const res = await fetch(
      'https://www.ahlgrens.eu/wp-json/wp/v2/car_listing?per_page=100',
      { cache: 'force-cache' }
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    const bodyType  = currentCar.meta?._car_body_type?.trim().toLowerCase();
    const currentId = currentCar.id;

    let similar = data.filter(c =>
      c.id !== currentId &&
      c.meta?._car_body_type?.trim().toLowerCase() === bodyType
    );

    if (similar.length < 3) {
      const ids    = new Set(similar.map(c => c.id));
      const extras = data.filter(c => c.id !== currentId && !ids.has(c.id));
      similar = [...similar, ...extras];
    }

    return similar.slice(0, 3);
  } catch {
    return [];
  }
}

export default async function Page({ params }) {
  const { slug } = await params;
  const car = await getCarData(slug);
  if (!car) notFound();

  const similarCars = await getSimilarCars(car);
  const meta = car.meta || {};
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: vehicleTitle(car),
    url: vehicleUrl(car),
    image: meta._car_thumbnail || meta._car_gallery_urls?.split(',')?.[0]?.trim() || absoluteUrl('/images/og-image.jpg'),
    brand: meta._car_make ? { '@type': 'Brand', name: meta._car_make } : undefined,
    vehicleModelDate: meta._car_year,
    mileageFromOdometer: meta._car_mileage
      ? {
          '@type': 'QuantitativeValue',
          value: parseInt(meta._car_mileage, 10) * 10,
          unitCode: 'KMT',
        }
      : undefined,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'SEK',
      price: meta._car_price || undefined,
      availability: meta._car_is_sold === 'yes' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
      seller: { '@id': 'https://ahlgrens.eu/#autodealer' },
    },
    description: stripHtml(car.excerpt?.rendered || car.content?.rendered || ''),
  };


  return (
    <main className="bg-light min-vh-100 pb-5 mt-5 pt-5">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CarDetailView car={car} />
      {similarCars.length > 0 && (
        <div className="container">
          <hr className="my-5" />
          <h3 className="fw-bold mb-4">LIKNANDE FORDON</h3>
          <SimilarVehicles cars={similarCars} />
        </div>
      )}
    </main>
  );
}