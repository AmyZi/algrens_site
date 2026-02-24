export async function getAllCars() {
  const res = await fetch('https://www.ahlgrens.eu/wp-json/wp/v2/car_listing?per_page=100&_embed', {
    cache: 'force-cache'
  });
  if (!res.ok) return [];
  const cars = await res.json();
  return Array.isArray(cars) ? cars : [];
}