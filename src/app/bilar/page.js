import Link from 'next/link';

async function getCars() {
  const res = await fetch('https://www.ahlgrens.eu/wp-json/wp/v2/car_listing?_embed&per_page=100', {
    next: { revalidate: 60 }
  });
  return res.json();
}

export default async function BilarList() {
  const cars = await getCars();

  return (
    <div className="max-w-7xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-8">Vårt Billager</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cars.map((car) => {
          // Determine link based on "New" or "Used"
          const isNew = car.meta?._car_is_new === 'yes';
          const path = isNew ? '/bilar/nytt' : '/bilar/begagnat';
          
          return (
            <Link href={`${path}/${car.slug}`} key={car.id} className="group border rounded-xl overflow-hidden shadow hover:shadow-lg transition">
              <img 
                src={car.meta?._car_thumbnail || '/placeholder.jpg'} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="font-bold text-xl group-hover:text-blue-600 transition" dangerouslySetInnerHTML={{ __html: car.title.rendered }} />
                <p className="text-gray-600">{car.meta?._car_year} | {car.meta?._car_mileage} mil</p>
                <p className="text-blue-700 font-extrabold text-lg mt-2">
                  {parseInt(car.meta?._car_price).toLocaleString('sv-SE')} kr
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}