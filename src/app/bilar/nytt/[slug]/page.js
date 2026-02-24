import { notFound } from 'next/navigation';
import CarDetailView from '@/components/CarDetailView';
import SimilarVehicles from '@/components/SimilarVehicles';

export async function generateStaticParams() {
  try {
    const res = await fetch('https://www.ahlgrens.eu/wp-json/wp/v2/car_listing?per_page=100');
    const cars = await res.json();
    return Array.isArray(cars)
      ? cars
          .filter(car => car.meta?._car_is_new === 'yes')
          .map((car) => ({ slug: car.slug }))
      : [];
  } catch (error) {
    console.error('Build Error fetching params:', error);
    return [];
  }
}

async function getCarData(slug) {
  const res = await fetch(
    `https://www.ahlgrens.eu/wp-json/wp/v2/car_listing?slug=${slug}&_embed`,
    { cache: 'force-cache' }
  );
  const data = await res.json();
  return data?.[0] || null;
}

async function getSimilarCars(currentCar) {
  const res = await fetch(
    `https://www.ahlgrens.eu/wp-json/wp/v2/car_listing?per_page=100`,
    { cache: 'force-cache' }
  );
  const data = await res.json();
  if (!Array.isArray(data)) return [];

  const bodyType = currentCar.meta?._car_body_type?.trim().toLowerCase();
  const currentId = currentCar.id;

  // Match by body type
  let similar = data.filter(c =>
    c.id !== currentId &&
    c.meta?._car_body_type?.trim().toLowerCase() === bodyType
  );

  // Fallback: if fewer than 3 matches, fill up with any other cars
  if (similar.length < 3) {
    const ids = new Set(similar.map(c => c.id));
    const extras = data.filter(c => c.id !== currentId && !ids.has(c.id));
    similar = [...similar, ...extras];
  }

  return similar.slice(0, 3);
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