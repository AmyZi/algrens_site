import { notFound } from 'next/navigation';
import CarDetailView from '@/components/CarDetailView';
import SimilarVehicles from '@/components/SimilarVehicles';

// 1. GENERATE STATIC PARAMS (Prevents 404s)
// This tells Next.js exactly which pages to build at compile time
export async function generateStaticParams() {
  try {
    const res = await fetch('https://www.ahlgrens.eu/wp-json/wp/v2/car_listing?per_page=100');
    if (!res.ok) return [];
    const cars = await res.json();

    return cars.map((car) => ({
      slug: car.slug,
    }));
  } catch (error) {
    console.error("Build Error: Failed to fetch slugs for static generation", error);
    return [];
  }
}

// 2. FETCH DATA
async function getCar(slug) {
  try {
    const res = await fetch(`https://www.ahlgrens.eu/wp-json/wp/v2/car_listing?slug=${slug}&_embed`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return null;
    const cars = await res.json();
    return cars?.[0] || null;
  } catch (e) {
    return null;
  }
}

async function getRelatedCars(categoryId, currentId) {
  if (!categoryId) return [];
  try {
    const res = await fetch(
      `https://www.ahlgrens.eu/wp-json/wp/v2/car_listing?categories=${categoryId}&exclude=${currentId}&per_page=3&_embed`,
      { next: { revalidate: 3600 } }
    );
    const cars = await res.json();
    return Array.isArray(cars) ? cars : [];
  } catch (e) {
    return [];
  }
}

// 3. SEO METADATA
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const car = await getCar(slug);
  if (!car) return { title: 'Bil hittades ej' };

  return {
    title: `${car.title?.rendered} | Ahlgrens Bilar`,
    description: `Se specifikationer och pris för ${car.title?.rendered}. Vi hjälper dig med finansiering och inbyte.`,
  };
}

// 4. PAGE COMPONENT
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