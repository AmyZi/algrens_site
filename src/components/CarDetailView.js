'use client';
import React, { useState } from 'react';

export default function CarDetailView({ car }) {
  if (!car || !car.title) return null;

  const meta = car.meta || {};
  const isNew = meta._car_is_new === 'yes';
  
  const mainImage = meta._car_thumbnail || '/placeholder-car.jpg';
  const galleryString = meta._car_gallery_urls || "";
  const galleryUrls = galleryString ? galleryString.split(',').filter(u => u.length > 0) : [];
  const allImages = [mainImage, ...galleryUrls];

  const [activeImage, setActiveImage] = useState(mainImage);

  // Link to the Blocket ad from ACF
  const blocketUrl = meta.blocket_url || meta._car_blocket_url || "#";

  const price = meta._car_price 
    ? `${parseInt(meta._car_price).toLocaleString('sv-SE')} kr` 
    : "Ring för pris";

  return (
    <div className="container mt-5 pt-5 pb-5" style={{ color: 'var(--charcoal)' }}>
      <div className="row g-5">
        
        {/* LEFT COLUMN: GALLERY */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-3">
            <img 
              src={activeImage} 
              alt={car.title.rendered} 
              className="w-100 object-fit-cover" 
              style={{ aspectRatio: '16/10' }}
            />
          </div>
          
          <div className="d-flex gap-2 overflow-auto pb-2" style={{ whiteSpace: 'nowrap' }}>
            {allImages.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(img)}
                className="btn p-0 border-2 rounded-3 overflow-hidden flex-shrink-0"
                style={{ 
                  width: '100px', 
                  height: '70px',
                  borderColor: activeImage === img ? 'var(--sage)' : 'transparent' 
                }}
              >
                <img src={img} className="w-100 h-100 object-fit-cover" alt="Galleri" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: INFO & SPECS */}
        <div className="col-lg-5">
          <div className="ps-lg-4">
            {/* BRANDED BADGE */}
            <span 
                className="badge rounded-pill mb-3" 
                style={{ 
                    backgroundColor: isNew ? 'var(--sage)' : 'var(--slate)',
                    padding: '8px 16px',
                    fontSize: '0.7rem',
                    letterSpacing: '1px'
                }}
            >
              {isNew ? 'NYHET' : 'BEGAGNAD'}
            </span>
            
            <h1 className="fw-black mb-2" style={{ fontSize: '2.8rem', color: 'var(--charcoal)' }} dangerouslySetInnerHTML={{ __html: car.title.rendered }} />
            <h2 className="fw-bold mb-4" style={{ color: 'var(--slate)' }}>{price}</h2>

            <div className="d-grid gap-3 mb-5">
              {/* CONTACT BUTTON - Links to Blocket URL */}
              <a 
                href={blocketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-lg fw-bold py-3 rounded-4 border-2 btn-warning text-decoration-none d-flex align-items-center justify-content-center"
                style={{ color: 'var(--charcoal)', borderColor: 'var(--charcoal)' }}
              >
                KONTAKTA SÄLJARE
              </a>
            </div>

            {/* SPECS GRID */}
            <div className="row g-3 p-4 bg-white rounded-4 shadow-sm border mx-0">
              <SpecItem label="Modellår" value={meta._car_year} />
              <SpecItem label="Miltal" value={meta._car_mileage ? `${meta._car_mileage} mil` : '0'} />
              <SpecItem label="Växellåda" value={meta._car_gearbox} />
              <SpecItem label="Drivmedel" value={meta._car_fuel} />
              <SpecItem label="Färg" value={meta._car_color} />
              <SpecItem label="Reg Nr" value={meta._car_registration} />
            </div>
          </div>
        </div>
      </div>

      {/* DESCRIPTION SECTION */}
      <div className="row mt-5">
        <div className="col-12 text-charcoal">
          <hr className="my-5" style={{ opacity: 0.1 }} />
          <h3 className="fw-black mb-4 text-uppercase" style={{ color: 'var(--slate)' }}>Beskrivning</h3>
          
          <div 
            className="description-content" 
            style={{ 
              fontSize: '1.1rem', 
              lineHeight: '1.9',
              color: 'var(--charcoal)',
              fontFamily: 'Inter, -apple-system, sans-serif'
            }}
            dangerouslySetInnerHTML={{ __html: car.content?.rendered }} 
          />
        </div>
      </div>

      <style jsx>{`
        .description-content :global(p) {
          margin-bottom: 1.5rem;
          font-family: inherit !important;
        }
        .fw-black {
          font-weight: 900 !important;
        }
      `}</style>
    </div>
  );
}

function SpecItem({ label, value }) {
  return (
    <div className="col-6 col-md-4">
      <small className="d-block text-uppercase fw-bold mb-1" style={{ fontSize: '0.6rem', color: 'var(--slate)', opacity: 0.7, letterSpacing: '1px' }}>
        {label}
      </small>
      <span className="fw-bold" style={{ color: 'var(--charcoal)', fontSize: '0.95rem' }}>{value || '—'}</span>
    </div>
  );
}