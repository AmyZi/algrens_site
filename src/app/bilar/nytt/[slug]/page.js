import CarDetailView from '@/components/CarDetailView';
import { notFound } from 'next/navigation';

/**
 * 1. Tell Next.js which paths to pre-render
 */
export async function generateStaticParams() {
  // We fetch ALL cars (or at least the first 100) to get their slugs
  const res = await fetch('https://www.ahlgrens.eu/wp-json/wp/v2/car_listing?per_page=100');
  const cars = await res.json();

  if (!Array.isArray(cars)) return [];

  return cars.map((car) => ({
    slug: car.slug,
  }));
}

/**
 * 2. Fetch data for a single car
 */
async function getCar(slug) {
  const res = await fetch(`https://www.ahlgrens.eu/wp-json/wp/v2/car_listing?slug=${slug}&_embed`, {
    next: { revalidate: 60 }
  });
  
  const cars = await res.json();
  return cars && cars.length > 0 ? cars[0] : null;
}

/**
 * 3. The Page Component
 */
export default async function Page({ params }) {
  const { slug } = await params; // Note: In newer Next.js versions, params is a Promise
  const car = await getCar(slug);

  if (!car) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white py-10">
      <CarDetailView car={car} />
    </main>
  );
}