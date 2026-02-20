import { notFound } from 'next/navigation';
import CarDetailView from '@/components/CarDetailView';
import SimilarVehicles from '@/components/SimilarVehicles';

// Fetch a single car
async function getCar(slug) {
  try {
    const res = await fetch(`https://www.ahlgrens.eu/wp-json/wp/v2/car_listing?slug=${slug}&_embed`, { 
      next: { revalidate: 3600 } 
    });
    if (!res.ok) return null;
    const cars = await res.json();
    return cars?.[0] || null;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

// Fetch similar cars
async function getRelatedCars(categoryId, currentId) {
  if (!categoryId) return [];
  try {
    const res = await fetch(`https://www.ahlgrens.eu/wp-json/wp/v2/car_listing?categories=${categoryId}&exclude=${currentId}&per_page=3&_embed`, { 
      next: { revalidate: 3600 } 
    });
    const cars = await res.json();
    return Array.isArray(cars) ? cars : [];
  } catch (e) {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const car = await getCar(slug);
  if (!car) return { title: 'Bil ej hittad' };
  return {
    title: `${car.title?.rendered} | Ahlgrens Bilar`,
    description: `Se pris och detaljer för ${car.title?.rendered}. Vi erbjuder finansiering och inbyte.`,
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const car = await getCar(slug);

  if (!car) notFound();

  const categoryId = car.categories?.[0];
  const relatedCars = await getRelatedCars(categoryId, car.id);

  return (
    <main className="bg-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-200">
        <CarDetailView car={car} />
      </div>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <SimilarVehicles cars={relatedCars} />
      </div>
    </main>
  );
}