import Link from 'next/link';

export default function CarCard({ car }) {
  const { price, year, mileage, condition } = car.acf || {};
  const image = car._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/placeholder-car.jpg';

  return (
    <Link href={`/bilar/${car.slug}`} className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 border border-slate-100">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img 
          src={image} 
          alt={car.title.rendered} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Dynamic Badge */}
        {condition && (
          <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
            condition.toLowerCase() === 'nytt' ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'
          }`}>
            {condition}
          </span>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
          {car.title.rendered}
        </h3>
        <div className="flex justify-between items-center mb-4 text-slate-500 text-sm">
          <span>{year}</span>
          <span>•</span>
          <span>{mileage} mil</span>
        </div>
        <p className="text-2xl font-black text-slate-900">
          {price ? `${Number(price).toLocaleString('sv-SE')} kr` : "Ring för pris"}
        </p>
      </div>
    </Link>
  );
}