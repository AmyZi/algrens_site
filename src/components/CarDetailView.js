'use client';
import React, { useState } from 'react';

export default function CarDetailView({ car }) {
  // CRITICAL FIX: Ensure car and meta exist before rendering
  if (!car || !car.title) return null;
  const meta = car.meta || {};
  
  const isNew = meta._car_is_new === 'yes';
  const initialImage = car._car_thumbnail || '/placeholder-car.jpg';
  const galleryString = meta._car_gallery_urls || "";
  const galleryUrls = galleryString ? galleryString.split(',') : [];

  const [activeImage, setActiveImage] = useState(initialImage);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* GALLERY SECTION */}
        <div className="space-y-4">
          <div className="rounded-3xl overflow-hidden shadow-2xl bg-gray-100 border border-gray-100">
            <img 
              src={activeImage} 
              alt={car.title?.rendered} 
              className="w-full object-cover aspect-[4/3] transition-all duration-500" 
            />
          </div>
          {galleryUrls.length > 0 && (
            <div className="grid grid-cols-5 gap-3">
              {galleryUrls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(url)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === url ? 'border-blue-600 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} className="w-full h-full object-cover" alt="Galleri" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* INFO SECTION */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-widest ${
              isNew ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'
            }`}>
              {isNew ? 'Nyhet' : 'Begagnad'}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 leading-tight" 
              dangerouslySetInnerHTML={{ __html: car.title?.rendered }} />
          
          <div className="text-4xl font-black text-blue-700 mb-8">
            {meta._car_price ? `${parseInt(meta._car_price).toLocaleString('sv-SE')} kr` : "Ring för pris"}
          </div>

          {/* CTA BUTTONS */}
          <div className="flex flex-col gap-4 mb-10">
            <a href={meta._car_blocket_url || "https://www.blocket.se/butik/ahlgrens-bilar"} 
               target="_blank" rel="noopener noreferrer"
               className="bg-[#ff5c39] hover:bg-[#e04a2d] text-white py-5 rounded-2xl font-black text-center text-xl shadow-lg transition-transform hover:-translate-y-1">
              KÖP NU PÅ BLOCKET
            </a>
          </div>

          {/* SPECS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
            <SpecItem label="År" value={meta._car_year} />
            <SpecItem label="Mil" value={isNew ? '0' : meta._car_mileage} />
            <SpecItem label="Växel" value={meta._car_gearbox} />
            <SpecItem label="Bränsle" value={meta._car_fuel} />
            <SpecItem label="Färg" value={meta._car_color} />
            <SpecItem label="Reg Nr" value={meta._car_registration} />
          </div>
        </div>
      </div>
      
      {/* FULL DESCRIPTION */}
      <div className="mt-16 prose prose-slate max-w-none border-t pt-10" 
           dangerouslySetInnerHTML={{ __html: car.content?.rendered }} />
    </div>
  );
}

function SpecItem({ label, value }) {
  return (
    <div>
      <span className="text-gray-400 text-[10px] block uppercase font-black tracking-widest mb-1">{label}</span>
      <span className="text-gray-900 font-bold">{value || '—'}</span>
    </div>
  );
}