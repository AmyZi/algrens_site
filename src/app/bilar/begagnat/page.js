import BilarPage from '../bilarPage';

async function getAllCars() {
  try {
    const res = await fetch('https://www.ahlgrens.eu/wp-json/wp/v2/car_listing?per_page=100&_embed', {
      cache: 'force-cache'
    });
    if (!res.ok) return [];
    const cars = await res.json();
    return Array.isArray(cars) ? cars : [];
  } catch (error) {
    return [];
  }
}

export default async function Page() {
  const cars = await getAllCars();
  return <BilarPage cars={cars} initialFilter="used" />;
}