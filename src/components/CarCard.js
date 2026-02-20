// src/components/CarCard.js
import Link from 'next/link';

export default function CarCard({ car }) {
  // If the car object is broken, return nothing to avoid crashing the build
  if (!car || !car.meta) return null;

  const meta = car.meta;
  const isNew = meta._car_is_new === 'yes';
  const price = meta._car_price ? `${parseInt(meta._car_price).toLocaleString('sv-SE')} kr` : "Ring för pris";
  const thumbnail = car._car_thumbnail || '/placeholder-car.jpg';

  return (
    <Link href={`/bilar/${car.slug}`} className="group block bg-white rounded-2xl shadow hover:shadow-xl transition-all overflow-hidden border border-slate-100">
      <div className="relative aspect-[16/10]">
        <img src={thumbnail} alt={car.title?.rendered || 'Bil'} className="w-full h-full object-cover" />
        <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase ${isNew ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'}`}>
          {isNew ? 'Ny' : 'Begagnad'}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg mb-1" dangerouslySetInnerHTML={{ __html: car.title?.rendered }} />
        <p className="text-blue-600 font-black text-xl">{price}</p>
        <div className="flex gap-3 mt-3 text-xs text-gray-400">
          <span>{meta._car_year}</span>
          <span>•</span>
          <span>{meta._car_mileage} mil</span>
        </div>
      </div>
    </Link>
  );
}