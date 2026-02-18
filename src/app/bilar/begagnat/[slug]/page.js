import CarDetailView from '../../../components/CarDetailView';
import { notFound } from 'next/navigation';

async function getCar(slug) {
  // Replace with your actual WordPress URL
  const res = await fetch(`https://www.ahlgrens.eu/wp-json/wp/v2/car_listing?slug=${slug}&_embed`, {
    next: { revalidate: 60 } // Refresh data every minute
  });
  
  const cars = await res.json();
  
  if (!cars || cars.length === 0) {
    return null;
  }
  
  return cars[0];
}

export default async function Page({ params }) {
  const { slug } = params;
  const car = await getCar(slug);

  if (!car) {
    notFound(); // Triggers the Next.js 404 page if car isn't found
  }

  return (
    <main className="min-h-screen bg-white py-10">
      <CarDetailView car={car} />
    </main>
  );
}