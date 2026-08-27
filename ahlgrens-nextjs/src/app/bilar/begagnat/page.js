import BilarPage from '@/components/bilarPage';
import { getAllCars } from '@/lib/get-cars';

export const metadata = {
  title: 'Begagnade husbilar till salu i Borås',
  description: 'Se begagnade husbilar och husvagnar hos Ahlgrens Husbilar i Borås. Handplockade fordon, trygg affär, service och personlig rådgivning.',
  alternates: { canonical: '/bilar/begagnat/' },
};

export default async function Page() {
  const cars = await getAllCars();
  const usedCars = cars.filter(c => c.meta?._car_is_new !== 'yes');
  return <BilarPage cars={usedCars} initialFilter="used" />;
}