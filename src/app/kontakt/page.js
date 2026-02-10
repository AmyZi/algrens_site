import ContactContent from './ContactContent';

export const metadata = {
  title: 'Kontakta Oss - Ahlgrens Automotive i Borås',
  description: 'Har du frågor om våra husbilar? Kontakta Ahlgrens Automotive för personlig rådgivning, tidsbokning eller värdering. Vi svarar inom 24 timmar.',
};

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "name": "Ahlgrens Automotive",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Borås", // Add specific street if you have one
      "addressLocality": "Borås",
      "postalCode": "50100", // Update with correct zip
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
      "latitude": "57.7210", // Approximate for Borås
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