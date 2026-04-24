import BilarPage from '../../../components/bilarPage';
import { getAllCars } from '@/lib/get-cars';

export default async function Page() {
  const cars = await getAllCars();
  const newCars = cars.filter(c => c.meta?._car_is_new === 'yes');
  return <BilarPage cars={newCars} initialFilter="new" />;
}