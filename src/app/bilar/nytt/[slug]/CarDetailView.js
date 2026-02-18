'use client'; // This must be at the very top to allow useState and onClick

import React, { useState } from 'react';

export default function CarDetailView({ car }) {
  // 1. Setup metadata and initial image
  const meta = car.meta || {};
  const isNew = meta._car_is_new === 'yes';
  
  // Get the default featured image
  const initialImage = car._car_thumbnail || '/placeholder-car.jpg';

  // 2. Handle the Gallery URLs from your PHP script
  // Your script saves these as a comma-separated string in '_car_gallery_urls'
  const galleryString = meta._car_gallery_urls || "";
  const galleryUrls = galleryString ? galleryString.split(',') : [];

  // 3. State for the main viewer
  const [activeImage, setActiveImage] = useState(initialImage);

  return (
    <div className="max-w-7xl mx-auto p-6 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* LEFT COLUMN: IMAGES */}
        <div className="space-y-4">
          {/* Main Large Image Viewer */}
          <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-gray-100">
            <img 
              src={activeImage} 
              alt={car.title.rendered} 
              className="w-full object-cover aspect-[4/3] transition-opacity duration-300" 
            />
          </div>

          {/* THUMBNAIL LOOP */}
          {galleryUrls.length > 0 && (
            <div className="grid grid-cols-5 gap-2">
              {galleryUrls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(url)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === url 
                      ? 'border-blue-600 ring-2 ring-blue-100' 
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img 
                    src={url} 
                    className="w-full h-full object-cover" 
                    alt={`View gallery image ${index + 1}`} 
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: VEHICLE INFO */}
        <div className="flex flex-col">
          <div className="mb-4">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              isNew ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
            }`}>
              {isNew ? 'Ny bil' : 'Begagnad'}
            </span>
          </div>

          <h1 
            className="text-4xl font-bold text-gray-900 mb-2" 
            dangerouslySetInnerHTML={{ __html: car.title.rendered }} 
          />
          
          <div className="text-4xl font-extrabold text-blue-700 my-6">
            {meta._car_price 
              ? `${parseInt(meta._car_price).toLocaleString('sv-SE')} kr` 
              : "Pris på begäran"}
          </div>

          {/* SPECS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 bg-gray-50 p-8 rounded-3xl border border-gray-100">
            <SpecItem label="Status" value={isNew ? 'Ny' : 'Begagnad'} />
            <SpecItem label="Modellår" value={meta._car_year} />
            <SpecItem label="Miltal" value={isNew ? '0 mil' : `${meta._car_mileage} mil`} />
            <SpecItem label="Växellåda" value={meta._car_gearbox} />
            <SpecItem label="Drivmedel" value={meta._car_fuel} />
            <SpecItem label="Hästkrafter" value={meta._car_engine_power ? `${meta._car_engine_power} hk` : '-'} />
            <SpecItem label="Färg" value={meta._car_color} />
            <SpecItem label="Reg Nr" value={meta._car_registration} />
            <SpecItem label="Kaross" value={meta._car_body_type} />
          </div>

          {/* DESCRIPTION */}
          <div 
            className="mt-10 prose prose-lg max-w-none text-gray-700" 
            dangerouslySetInnerHTML={{ __html: car.content.rendered }} 
          />
        </div>
      </div>
    </div>
  );
}

// Simple Helper Component for Specs
function SpecItem({ label, value }) {
  return (
    <div>
      <span className="text-gray-400 text-[10px] block uppercase font-black tracking-widest mb-1">
        {label}
      </span>
      <span className="text-gray-900 font-semibold">
        {value || '—'}
      </span>
    </div>
  );
}