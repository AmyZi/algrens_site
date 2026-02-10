import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/custom.scss';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import MajblommanAnimation from '@/components/MajblommanAnimation';

export const metadata = {
  title: {
    default: 'Ahlgrens Automotive | Premium Husbilar i Borås',
    template: '%s | Ahlgrens Husbilar'
  },
  description: 'Handplockade husbilar från Europas bästa tillverkare. 25 års erfarenhet, över 3000 nöjda kunder, fullständig service och garanti.',
  keywords: ['husbilar Borås', 'köpa husbil', 'Bavaria husbilar', 'Pilote', 'Hymer', 'Laika', 'fritidsbilar', 'husbil begagnad'],
  authors: [{ name: 'Ahlgrens Automotive' }],
  openGraph: {
    title: 'Ahlgrens Automotive | Premium Husbilar i Borås',
    description: 'Handplockade husbilar från Europas bästa tillverkare. 25 års erfarenhet, fullständig service.',
    url: 'https://yourdomain.com',
    siteName: 'Ahlgrens Husbilar',
    locale: 'sv_SE',
    type: 'website',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ahlgrens Husbilar - Premium Husbilar',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="d-flex flex-column min-vh-100">
        <MajblommanAnimation />
        <Navigation />
        
        <main className="flex-grow-1">
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}
