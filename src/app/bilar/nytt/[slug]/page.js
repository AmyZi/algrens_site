import { notFound } from 'next/navigation';
import CarDetailView from '@/components/CarDetailView';
import SimilarVehicles from '@/components/SimilarVehicles';

// --- THIS IS THE MISSING FUNCTION ---
export async function generateStaticParams() {
  try {
    const res = await fetch('https://www.ahlgrens.eu/wp-json/wp/v2/car_listing?per_page=100');
    const cars = await res.json();
    
    // We only generate paths for USED cars in this folder
    return Array.isArray(cars) 
      ? cars
          .filter(car => car.meta?._car_is_new !== 'yes') 
          .map((car) => ({ slug: car.slug }))
      : [];
  } catch (error) {
    console.error("Build Error fetching params:", error);
    return [];
  }
}

async function getCarData(slug) {
  const res = await fetch(`https://www.ahlgrens.eu/wp-json/wp/v2/car_listing?slug=${slug}&_embed`);
  const data = await res.json();
  return data?.[0] || null;
}

async function getSimilarCars(categoryId, currentId) {
  if (!categoryId) return [];
  const res = await fetch(`https://www.ahlgrens.eu/wp-json/wp/v2/car_listing?categories=${categoryId}&exclude=${currentId}&per_page=3&_embed`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export default async function Page({ params }) {
  const { slug } = await params;
  const car = await getCarData(slug);

  if (!car) notFound();

  const similarCars = await getSimilarCars(car.categories?.[0], car.id);

  return (
    <main className="bg-light min-vh-100 pb-5">
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