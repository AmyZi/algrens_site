import AboutContent from './AboutContent';

export const metadata = {
  title: 'Om Oss - Vår Historia sedan 1973 | Ahlgrens Husbilar',
  description: 'Möt Ahlgrens Husbilar i Borås. Från barndomsminnen 1973 till 25 års erfarenhet och 3 000 nöjda kunder. Vi satsar på kvalitet och handplockade husbilar.',
  openGraph: {
    title: 'Om Oss - Ahlgrens Husbilar',
    description: 'En passion som började sommaren 1973. Läs vår historia.',
    images: ['/web/wp-content/uploads/2026/02/Algrens_CEO.jpeg'], 
  },
};

export default function Page() {
  return <AboutContent />;
}