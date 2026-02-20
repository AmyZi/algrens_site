'use client';

import React, { useState } from 'react';

/**
 * CarDetailView Component
 * - Displays car details, image gallery, and Blocket conversion button.
 * - Optimized for SEO with JSON-LD and semantic HTML.
 * - Build-safe: Handles potentially missing metadata.
 */
export default function CarDetailView({ car }) {
  // 1. Build-safe data check
  if (!car) return null;

  // Setup metadata with fallbacks to prevent "undefined" crashes during build
  const meta = car.meta || {};
  const isNew = meta._car_is_new === 'yes';
  
  // Use car thumbnail or a placeholder
  const initialImage = car._car_thumbnail || '/placeholder-car.jpg';

  // 2. Handle the Gallery URLs
  const galleryString = meta._car_gallery_urls || "";
  const galleryUrls = galleryString ? galleryString.split(',') : [];

  // 3. State for the main image viewer
  // This must remain inside 'use client'
  const [activeImage, setActiveImage] = useState(initialImage);

  // 4. SEO: Structured Data (JSON-LD) for Google "Car" Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    "name": car.title?.rendered || "Fordon",
    "description": car.excerpt?.rendered?.replace(/<[^>]*>/g, '') || car.title?.rendered,
    "image": initialImage,
    "brand": { "@type": "Brand", "name": "Ahlgrens Bilar" },
    "modelDate": meta._car_year || "",
    "mileageFromOdometer": {
      "@type": "QuantitativeValue",
      "value": meta._car_mileage || 0,
      "unitCode": "KMT"
    },
    "offers": {
      "@type": "Offer",
      "price": meta._car_price || "0",
      "priceCurrency": "SEK",
      "availability": "https://schema.org/InStock",
      "url": `https://www.ahlgrens.eu/bilar/${car.slug}`
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 font-sans bg-white">
      {/* Google SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* LEFT COLUMN: IMAGES */}
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-gray-50">
            <img 
              src={activeImage} 
              alt={car.title?.rendered} 
              className="w-full object-cover aspect-[4/3] transition-all duration-500" 
            />
          </div>

          {galleryUrls.length > 0 && (
            <div className="grid grid-cols-5 gap-3">
              {galleryUrls.slice(0, 10).map((url, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(url)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === url 
                      ? 'border-blue-600 scale-95 shadow-inner' 
                      : 'border-transparent hover:border-gray-300 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={url} className="w-full h-full object-cover" alt={`Galleri bild ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: VEHICLE INFO */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-4 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest ${
              isNew ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {isNew ? 'Nyhet' : 'Begagnad'}
            </span>
            <span className="text-gray-400 text-xs font-medium">Ref: {meta._car_registration || '—'}</span>
          </div>

          <h1 
            className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 leading-tight" 
            dangerouslySetInnerHTML={{ __html: car.title?.rendered }} 
          />
          
          <div className="text-4xl font-black text-blue-700 mb-8">
            {meta._car_price 
              ? `${parseInt(meta._car_price).toLocaleString('sv-SE')} kr` 
              : "Ring för pris"}
          </div>

          {/* CONVERSION BUTTONS */}
          <div className="grid grid-cols-1 gap-4 mb-10">
            <a 
              href={meta._car_blocket_url || "https://www.blocket.se/butik/ahlgrens-bilar"} 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-[#ff5c39] hover:bg-[#e04a2d] text-white py-5 rounded-2xl font-black text-xl shadow-[0_10px_25px_rgba(255,92,57,0.3)] transition-all hover:-translate-y-1"
            >
              KÖP NU PÅ BLOCKET
            </a>
            <a 
              href="mailto:info@ahlgrens.eu?subject=Intresseanmälan: %20"
              className="flex items-center justify-center bg-white border-2 border-gray-200 hover:border-blue-600 text-gray-900 py-4 rounded-2xl font-bold transition-all"
            >
              Intresseanmälan / Byt in din bil
            </a>
          </div>

          {/* SPECS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-8 gap-x-4 bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
            <SpecItem label="Modellår" value={meta._car_year} />
            <SpecItem label="Miltal" value={isNew ? '0 mil' : `${meta._car_mileage} mil`} />
            <SpecItem label="Växellåda" value={meta._car_gearbox} />
            <SpecItem label="Drivmedel" value={meta._car_fuel} />
            <SpecItem label="Färg" value={meta._car_color} />
            <SpecItem label="Reg Nr" value={meta._car_registration} />
          </div>

          <div 
            className="mt-12 text-gray-600 leading-relaxed text-lg border-t border-gray-100 pt-8 prose prose-slate max-w-none" 
            dangerouslySetInnerHTML={{ __html: car.content?.rendered || "" }} 
          />
        </div>
      </div>
    </div>
  );
}

/**
 * SpecItem Helper Component
 */
function SpecItem({ label, value }) {
  return (
    <div className="group">
      <span className="text-gray-400 text-[10px] block uppercase font-black tracking-[0.15em] mb-1">
        {label}
      </span>
      <span className="text-gray-900 font-bold text-lg group-hover:text-blue-600 transition-colors">
        {value || '—'}
      </span>
    </div>
  );
}