import CarCard from './CarCard';

export default function SimilarVehicles({ cars }) {
  if (!cars || cars.length === 0) return null;

  return (
    <section className="mt-20 border-t border-slate-100 pt-16">
      <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
        Liknande fordon som kan passa dig
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
      <div className="text-center mt-12">
        <a href="/bilar" className="text-blue-600 font-semibold hover:underline">
          Se alla bilar i lager →
        </a>
      </div>
    </section>
  );
}