import CarCard from '@/components/CarCard';

async function getAllCars() {
  try {
    const res = await fetch('https://www.ahlgrens.eu/wp-json/wp/v2/car_listing?per_page=100&_embed', {
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    const cars = await res.json();
    return Array.isArray(cars) ? cars : [];
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
}

export default async function BilarPage() {
  const cars = await getAllCars();

  return (
    <div className="container py-5 mt-5 pt-5 pb-5">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="fw-bold text-uppercase border-bottom pb-3">Vårt Lager</h1>
        </div>
      </div>
      
      <div className="row g-4">
        {cars.length > 0 ? (
          cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <div className="alert alert-light border">Inga fordon hittades just nu.</div>
          </div>
        )}
      </div>
    </div>
  );
}