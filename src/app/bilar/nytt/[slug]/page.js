import { notFound } from 'next/navigation';
import CarDetailView from '@/components/CarDetailView';
import SimilarVehicles from '@/components/SimilarVehicles';

export async function generateStaticParams() {
  try {
    const res = await fetch(
      'https://www.ahlgrens.eu/wp-json/wp/v2/car_listing?per_page=100',
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

  return (
    <main className="bg-light min-vh-100 pb-5 mt-5 pt-5">
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