import BilarPage from '../../components/bilarPage';
import { getAllCars } from '@/lib/get-cars';

export default async function Page() {
  const cars = await getAllCars();
  return <BilarPage cars={cars} initialFilter="all" />;
}