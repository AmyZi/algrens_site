'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site-config';

export default function CarDetailView({ car }) {
  if (!car || !car.title) return null;

  const meta = car.meta || {};

  const blocketUrl = meta._car_blocket_url || siteConfig.links.blocketShop;

  const isNew         = meta._car_is_new === 'yes';
  const isSold        = meta._car_is_sold === 'yes';
  const categoryLabel = isNew ? 'Nya husbilar' : 'Begagnade bilar';
  const categoryPath  = isNew ? '/bilar/nytt' : '/bilar/begagnat';

  const mainImage    = meta._car_thumbnail || '/placeholder-car.jpg';
  const galleryUrls  = meta._car_gallery_urls
    ? meta._car_gallery_urls.split(',').filter(u => u.length > 0)
    : [];
  const allImages = [mainImage, ...galleryUrls];

  const [activeImage, setActiveImage] = useState(mainImage);

  const price = meta._car_price
    ? `${parseInt(meta._car_price).toLocaleString('sv-SE')} kr`
    : 'Ring för pris';

  return (
    <div className="container mt-4 pt-5 pb-5" style={{ color: 'var(--charcoal)' }}>

      {/* 1. BREADCRUMBS */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>
          <li className="breadcrumb-item">
            <Link href="/" className="text-decoration-none text-muted">Hem</Link>
          </li>
          <li className="breadcrumb-item">
            <Link href="/bilar" className="text-decoration-none text-muted">Lager</Link>
          </li>
          <li className="breadcrumb-item">
            <Link href={categoryPath} className="text-decoration-none text-muted">
              {categoryLabel}
            </Link>
          </li>
          <li className="breadcrumb-item active text-truncate" aria-current="page" style={{ color: 'var(--charcoal)', fontWeight: '700' }}>
            <span dangerouslySetInnerHTML={{ __html: car.title.rendered }} />
          </li>
        </ol>
      </nav>

      <div className="row g-5">

        {/* 2. LEFT COLUMN: GALLERY */}
        <div className="col-lg-7">
          {/* Main image — greyed out with SÅLD overlay if sold */}
          <div
            className="card border-0 shadow-sm rounded-4 overflow-hidden mb-3 bg-white"
            style={{ position: 'relative' }}
          >
            <img
              src={activeImage}
              alt={car.title.rendered}
              className="w-100 object-fit-cover"
              style={{
                aspectRatio: '16/10',
                transition: '0.3s ease-in-out',
                filter: isSold ? 'grayscale(100%) brightness(0.6)' : 'none',
              }}
            />
            {isSold && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                <span
                  style={{
                    background: 'rgba(0,0,0,0.75)',
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: 'clamp(1.5rem, 6vw, 3rem)',
                    letterSpacing: '0.15em',
                    padding: '0.3em 0.8em',
                    textTransform: 'uppercase',
                    border: '3px solid #fff',
                  }}
                >
                  SÅLD
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          <div className="d-flex gap-2 overflow-auto pb-2 custom-scrollbar" style={{ whiteSpace: 'nowrap' }}>
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className="btn p-0 border-2 rounded-3 overflow-hidden flex-shrink-0"
                style={{
                  width: '100px',
                  height: '70px',
                  borderColor: activeImage === img ? 'var(--sage)' : 'transparent',
                  transition: '0.2s',
                  filter: isSold ? 'grayscale(100%) brightness(0.6)' : 'none',
                }}
              >
                <img src={img} className="w-100 h-100 object-fit-cover" alt={`Galleri bild ${idx + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* 3. RIGHT COLUMN: INFO & CTA */}
        <div className="col-lg-5">
          <div className="ps-lg-4">

            {/* Status badges */}
            <div className="d-flex gap-2 mb-3 flex-wrap">
              <span
                className="badge rounded-pill text-uppercase fw-bold"
                style={{
                  backgroundColor: isNew ? 'var(--sage)' : 'var(--slate)',
                  padding: '10px 20px',
                  fontSize: '0.75rem',
                  letterSpacing: '1px',
                }}
              >
                {isNew ? 'Nyhet' : 'Begagnad'}
              </span>
              {isSold && (
                <span
                  className="badge rounded-pill text-uppercase fw-bold"
                  style={{
                    backgroundColor: '#111',
                    color: '#fff',
                    padding: '10px 20px',
                    fontSize: '0.75rem',
                    letterSpacing: '1px',
                  }}
                >
                  SÅLD
                </span>
              )}
            </div>

            <h1
              className="fw-black mb-2 display-5"
              style={{ lineHeight: '1.1', opacity: isSold ? 0.5 : 1 }}
              dangerouslySetInnerHTML={{ __html: car.title.rendered }}
            />
            <h2 className="fw-bold mb-4" style={{ color: 'var(--slate)', opacity: isSold ? 0.5 : 1 }}>
              {isSold ? 'Såld' : price}
            </h2>

            <div className="d-grid gap-3 mb-5">
              {isSold ? (
                <div
                  className="btn btn-lg fw-bold py-3 rounded-4 border-2 d-flex align-items-center justify-content-center"
                  style={{
                    background: '#e0e0e0',
                    color: '#999',
                    borderColor: '#ccc',
                    fontSize: '1.1rem',
                    cursor: 'not-allowed',
                  }}
                >
                  SÅLD — EJ TILLGÄNGLIG
                </div>
              ) : (
                <a
                  href={blocketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-lg fw-bold py-3 rounded-4 border-2 btn-warning text-decoration-none d-flex align-items-center justify-content-center"
                  style={{ color: 'var(--charcoal)', borderColor: 'var(--charcoal)', fontSize: '1.1rem' }}
                >
                  SE BILEN PÅ BLOCKET
                </a>
              )}

              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="btn btn-outline-dark fw-bold py-2 border-0 d-flex align-items-center justify-content-center gap-2"
              >
                <i className="bi bi-telephone"></i> Ring oss: {siteConfig.contact.phone}
              </a>
            </div>

            {/* SPECS GRID */}
            <div className="row g-3 p-4 bg-white rounded-4 shadow-sm border mx-0" style={{ opacity: isSold ? 0.5 : 1 }}>
              <SpecItem label="Modellår"  value={meta._car_year} />
              <SpecItem label="Miltal"    value={meta._car_mileage ? `${meta._car_mileage} mil` : '0'} />
              <SpecItem label="Växellåda" value={meta._car_gearbox} />
              <SpecItem label="Drivmedel" value={meta._car_fuel} />
              <SpecItem label="Färg"      value={meta._car_color} />
              <SpecItem label="Reg Nr"    value={meta._car_registration} />
            </div>
          </div>
        </div>
      </div>

      {/* 4. DESCRIPTION SECTION */}
      <div className="row mt-5">
        <div className="col-12">
          <hr className="my-5" style={{ opacity: 0.1 }} />
          <h3 className="fw-black mb-4 text-uppercase" style={{ color: 'var(--slate)', letterSpacing: '1px' }}>
            Information & Beskrivning
          </h3>
          <div
            className="description-content"
            style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--charcoal)', maxWidth: '900px' }}
            dangerouslySetInnerHTML={{ __html: car.content?.rendered }}
          />
        </div>
      </div>

      <style jsx>{`
        .breadcrumb-item + .breadcrumb-item::before {
          content: "›" !important;
          color: var(--slate);
          font-weight: bold;
        }
        .description-content :global(p) { margin-bottom: 1.5rem; }
        .description-content :global(ul) { margin-bottom: 1.5rem; }
        .fw-black { font-weight: 900 !important; }

        .custom-scrollbar::-webkit-scrollbar        { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track  { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb  { background: var(--sage); border-radius: 10px; }
      `}</style>
    </div>
  );
}

function SpecItem({ label, value }) {
  return (
    <div className="col-6 col-md-4">
      <small className="d-block text-uppercase fw-bold mb-1" style={{ fontSize: '0.65rem', color: 'var(--slate)', opacity: 0.8, letterSpacing: '0.5px' }}>
        {label}
      </small>
      <span className="fw-bold" style={{ color: 'var(--charcoal)', fontSize: '0.95rem' }}>
        {value || '—'}
      </span>
    </div>
  );
}