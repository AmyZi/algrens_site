import BrandsContent from './BrandsContent';

const BRANDS_DATA = [
  { name: 'Bavaria', country: 'Tyskland', logo: 'bavaria.png' },
  { name: 'Rimor', country: 'Italien', logo: 'rimor.png' },
  { name: 'Carado', country: 'Tyskland', logo: 'carado.png' },
  { name: 'Chausson', country: 'Frankrike', logo: 'chausson.png' },
  { name: 'McLouis', country: 'Italien', logo: 'mclouis.png' },
  { name: 'Adria', country: 'Slovenien', logo: 'adria.png' },
  { name: 'Bürstner', country: 'Tyskland', logo: 'burstner.svg' },
  { name: 'Pilote', country: 'Frankrike', logo: 'pilote.png' },
  { name: 'Challenger', country: 'Frankrike', logo: 'challenger.png' },
  { name: 'Laika', country: 'Italien', logo: 'laika.png' },
  { name: 'Eura Mobil', country: 'Tyskland', logo: 'euramobil.png' },
  { name: 'Dethleffs', country: 'Tyskland', logo: 'dethleffs.svg' },
  { name: 'Hymer', country: 'Tyskland', logo: 'hymer.png' },
  { name: 'Rapido', country: 'Frankrike', logo: 'rapido.png' },
  { name: 'Knaus', country: 'Tyskland', logo: 'knaus.png' },
  { name: 'Pössl', country: 'Tyskland', logo: 'possl.png' },
  { name: 'LMC', country: 'Tyskland', logo: 'lmc.svg' },
];

export const metadata = {
  title: 'Husbilsmärken - Pilote, Bavaria, Hymer, Laika & Fler | Ahlgrens Husbilar',
  description: 'Vi specialiserar oss på premium fritidsbilar från Pilote, Bavaria, Challenger, Rimor, Laika, Eura Mobil, Dethleffs, Bürstner, Hymer, Carado, Rapido, McLouis, Knaus, Chausson, Adria, Pössl och LMC.',
  openGraph: {
    title: 'Husbilsmärken hos Ahlgrens Husbilar',
    description: 'Auktoriserad återförsäljare av Pilote, Bavaria, Hymer, Laika, Dethleffs, Knaus med flera.',
    type: 'website',
  },
};

export default function BrandsPage() {
  const wpBaseUrl = process.env.NEXT_PUBLIC_WP_API_URL?.replace('/wp-json/wp/v2', '') || 'http://localhost/web';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "name": "Ahlgrens Husbilar",
    "description": "Premium motorhome dealer in Sweden.",
    "brand": BRANDS_DATA.map(brand => ({
      "@type": "Brand",
      "name": brand.name
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <BrandsContent wpBaseUrl={wpBaseUrl} brands={BRANDS_DATA} />
    </>
  );
}