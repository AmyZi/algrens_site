import HomePage from '@/components/HomePage'; // This will now find the file!
import { getAllCars } from '@/lib/get-cars';

export default async function Page() {
  const cars = await getAllCars();
  return <HomePage cars={cars} />;
}