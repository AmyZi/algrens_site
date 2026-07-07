import ContactContent from './ContactContent';

export const metadata = {
  title: 'Kontakta Oss - Ahlgrens Husbilar i Borås',
  description: 'Har du frågor om våra husbilar? Kontakta Ahlgrens Husbilar för personlig rådgivning, tidsbokning eller värdering. Vi svarar inom 24 timmar.',
};

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "name": "Ahlgrens Husbilar",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Gånghestervägen 129",
      "addressLocality": "Borås",
      "postalCode": "50100",
      "addressCountry": "SE"
    },
    "telephone": "+4633103011",
    "email": "jonas@ahlgrens.eu",
    "url": "https://ahlgrens.eu/kontakt",
    "openingHours": [
      "Mo-Fr 09:00-17:00",
      "Sa 10:00-14:00"
    ],
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "57.7210",
      "longitude": "12.9400"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactContent />
    </>
  );
}