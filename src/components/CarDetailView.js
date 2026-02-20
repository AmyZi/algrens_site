// src/components/CarDetailView.js
import Link from 'next/link';

export default function CarDetailView({ car }) {
  // Grab the ACF data safely
  const acf = car.acf || {};
  const blocketUrl = acf.blocket_url || "https://www.blocket.se/butik/ahlgrens-bilar";
  const price = acf.price ? `${acf.price} kr` : "Ring för pris";
  const featuredImage = car._embedded?.['wp:featuredmedia']?.[0]?.source_url;

  // SEO: Schema.org Product Data for Google
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    "name": car.title.rendered,
    "image": featuredImage,
    "description": car.excerpt?.rendered.replace(/<[^>]*>/g, ''),
    "offers": {
      "@type": "Offer",
      "price": acf.price || "0",
      "priceCurrency": "SEK",
      "url": `https://www.ahlgrens.eu/bilar/${car.slug}`
    }
  };

  return (
    <article className="max-w-7xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Main Image */}
        <div className="overflow-hidden rounded-2xl shadow-xl bg-slate-100">
          <img src={featuredImage} alt={car.title.rendered} className="w-full h-auto object-cover" />
        </div>

        {/* Right: Pricing & CTA */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{car.title.rendered}</h1>
          <p className="text-3xl font-bold text-blue-600 mb-8">{price}</p>
          
          <div className="space-y-4">
            <a 
              href={blocketUrl} 
              target="_blank" 
              className="block w-full text-center bg-[#ff5c39] hover:bg-[#e04a2a] text-white font-bold py-5 rounded-xl text-xl transition-all shadow-lg hover:scale-[1.02]"
            >
              Köp nu på Blocket
            </a>
            
            <Link 
              href="/kontakt" 
              className="block w-full text-center border-2 border-slate-200 hover:border-blue-600 py-4 rounded-xl font-semibold transition-colors"
            >
              Fråga oss om bilen
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}