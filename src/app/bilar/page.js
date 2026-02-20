// src/app/bilar/[slug]/page.js
import CarDetailView from '@/components/CarDetailView';
import SimilarVehicles from '@/components/SimilarVehicles';
import { notFound } from 'next/navigation';

async function getCar(slug) {
  const res = await fetch(`https://www.ahlgrens.eu/wp-json/wp/v2/car_listing?slug=${slug}&_embed`, { next: { revalidate: 3600 } });
  const cars = await res.json();
  return cars?.[0] || null;
}

async function getRelatedCars(categoryId, currentId) {
  const res = await fetch(`https://www.ahlgrens.eu/wp-json/wp/v2/car_listing?categories=${categoryId}&exclude=${currentId}&per_page=3&_embed`, { next: { revalidate: 3600 } });
  const cars = await res.json();
  return Array.isArray(cars) ? cars : [];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const car = await getCar(slug);
  if (!car) return { title: 'Bil ej hittad' };
  return {
    title: `${car.title.rendered} | Ahlgrens Bilar`,
    description: `Köp ${car.title.rendered} hos oss. Vi erbjuder trygg affär och finansiering. Se detaljer här!`,
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const car = await getCar(slug);
  if (!car) notFound();

  const relatedCars = await getRelatedCars(car.categories?.[0], car.id);

  return (
    <main className="bg-slate-50 pb-20">
      <div className="bg-white border-b border-slate-100">
        <CarDetailView car={car} />
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-16">
        <SimilarVehicles cars={relatedCars} />
      </div>
    </main>
  );
}