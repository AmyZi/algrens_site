import 'bootstrap/dist/css/bootstrap.min.css';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '@/styles/custom.scss';
import '@/styles/homePage.css';
import '@/styles/bilarPage.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { autoDealerJsonLd, siteUrl } from '@/lib/seo';
import { getPsaAnnouncements } from '@/lib/getPsaAnnouncements';
import PsaBar from '@/components/PsaBar';
import '@/styles/psaBar.css';
import MajblommanAnimation from '@/components/MajblommanAnimation';

export const metadata = {
  title: {
    default: 'Husbilar i Borås - Nya & Begagnade | Ahlgrens Husbilar',
    template: '%s | Ahlgrens Husbilar'
  },
  description: 'Handplockade husbilar från Europas bästa tillverkare. 25 års erfarenhet, över 3000 nöjda kunder, fullständig service och garanti.',
  keywords: ['husbilar Borås', 'köpa husbil', 'Bavaria husbilar', 'Pilote', 'Hymer', 'Laika', 'fritidsbilar', 'husbil begagnad'],
  authors: [{ name: 'Ahlgrens Husbilar' }],
  openGraph: {
    title: 'Husbilar i Borås - Nya & Begagnade | Ahlgrens Husbilar',
    description: 'Köp nya och begagnade husbilar i Borås hos Ahlgrens Husbilar. Service, garanti och personlig rådgivning.',
    url: 'https://ahlgrens.eu',
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
  alternates: {
    canonical: '/',
  },
  verification: {
    google: 'G-62S3QXZSL8',
    ahrefs: 'WTP17tFJXEda02ltApz4g',
  },
};

export default async function RootLayout({ children }) {
  const jsonLd = autoDealerJsonLd();
  const announcements = await getPsaAnnouncements();
  return (
    <html lang="sv">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="d-flex flex-column min-vh-100">
         <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <MajblommanAnimation />
        <PsaBar announcements={announcements} />
        <Navigation />
        <main className="flex-grow-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}