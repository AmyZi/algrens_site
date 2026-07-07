import HomePage from '@/components/HomePage'; 
import { getAllCars } from '@/lib/get-cars';

export const metadata = {
  title: 'Husbilsmärken - Pilote, Bavaria, Hymer, Laika & Fler | Ahlgrens Husbilar',
  description: 'Vi specialiserar oss på premium fritidsbilar från Pilote, Bavaria, Challenger, Rimor, Laika, Eura Mobil, Dethleffs, Bürstner, Hymer, Carado, Rapido, McLouis, Knaus, Chausson, Adria, Pössl och LMC.',
  openGraph: {
    title: 'Husbilsmärken hos Ahlgrens Husbilar',
    description: 'Auktoriserad återförsäljare av Pilote, Bavaria, Hymer, Laika, Dethleffs, Knaus med flera.',
    type: 'website',
  },
};

export default async function Page() {
  const cars = await getAllCars();
  return <HomePage cars={cars} />;
}