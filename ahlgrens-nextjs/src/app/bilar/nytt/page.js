import BilarPage from '@/components/bilarPage';
import { getAllCars } from '@/lib/get-cars';

export const metadata = {
  title: 'Nya husbilar till salu i Borås',
  description: 'Utforska nya husbilar hos Ahlgrens Husbilar i Borås. Premium märken, garanti, finansiering och rådgivning inför ditt nästa fritidsfordon.',
  alternates: { canonical: '/bilar/nytt/' },
};

export default async function Page() {
  const cars = await getAllCars();
  const newCars = cars.filter(c => c.meta?._car_is_new === 'yes');
  return <BilarPage cars={newCars} initialFilter="new" />;
}