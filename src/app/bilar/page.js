import BilarPage from '@/components/bilarPage';
import '@/styles/bilarPage.css';
import { getAllCars } from '@/lib/get-cars';

export default async function Page() {
  const cars = await getAllCars();
  return <BilarPage cars={cars} initialFilter="all" />;
}