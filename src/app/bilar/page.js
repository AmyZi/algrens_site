import BilarPage from '@/components/bilarPage';
import '@/styles/bilarPage.css';
import { getAllCars } from '@/lib/get-cars';

export const metadata = {
  title: 'Husbilar & Husvagnar till salu | Ahlgrens Husbilar',
  description: 'Vi säljer nya och begagnade husbilar och husvagnar. Halvintegrerade, integrerade och alkover. Besök oss eller bläddra bland vårt sortiment online.',
  openGraph: {
    title: 'Husbilar & Husvagnar till salu | Ahlgrens Husbilar',
    description: 'Köp husbil eller husvagn hos Ahlgrens. Brett sortiment av nya och begagnade fordon.',
    url: 'https://ahlgrens.eu/bilar',
  },
};

export default async function Page() {
  const cars = await getAllCars();
  return <BilarPage cars={cars} initialFilter="all" />;
}