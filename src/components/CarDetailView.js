'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site-config';
import '@/styles/bilarPage.css';

export default function CarDetailView({ car }) {
  if (!car || !car.title) return null;

  const meta = car.meta || {};

  const blocketUrl = siteConfig.links.blocketShop;
  const isNew         = meta._car_is_new  === 'yes';
  const isSold        = meta._car_is_sold === 'yes';
  const categoryLabel = isNew ? 'Nya husbilar' : 'Begagnade bilar';
  const categoryPath  = isNew ? '/bilar/nytt' : '/bilar/begagnat';

  const mainImage   = meta._car_thumbnail || '/placeholder-car.jpg';
  const galleryUrls = meta._car_gallery_urls
    ? meta._car_gallery_urls.split(',').filter(u => u.length > 0)
    : [];
  const allImages = [mainImage, ...galleryUrls];

  const [activeImage, setActiveImage] = useState(mainImage);

  const price = meta._car_price
    ? `${parseInt(meta._car_price).toLocaleString('sv-SE')} kr`
    : 'Ring för pris';

  return (
    <div className="cdv container mt-4 pt-5 pb-5">

      {/* 1. BREADCRUMBS */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb cdv__breadcrumb">
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
          <li className="breadcrumb-item active text-truncate cdv__breadcrumb-active" aria-current="page">
            <span dangerouslySetInnerHTML={{ __html: car.title.rendered }} />
          </li>
        </ol>
      </nav>

      <div className="row g-5">

        {/* 2. LEFT COLUMN: GALLERY */}
        <div className="col-lg-7">
          <div className="cdv__main-image-wrap card border-0 shadow-sm rounded-4 overflow-hidden mb-3 bg-white">
            <img
              src={activeImage}
              alt={car.title.rendered}
              className={`cdv__main-image w-100 object-fit-cover${isSold ? ' cdv__main-image--sold' : ''}`}
            />
            {isSold && (
              <div className="cdv__sold-overlay">
                <span className="cdv__sold-label">SÅLD</span>
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          <div className="cdv__thumbs custom-scrollbar">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`cdv__thumb-btn${activeImage === img ? ' cdv__thumb-btn--active' : ''}${isSold ? ' cdv__thumb-btn--sold' : ''}`}
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
              <span className={`cdv__badge cdv__badge--${isNew ? 'new' : 'used'}`}>
                {isNew ? 'Nyhet' : 'Begagnad'}
              </span>
              {isSold && (
                <span className="cdv__badge cdv__badge--sold">SÅLD</span>
              )}
            </div>

            <h1
              className={`cdv__title fw-black mb-2 display-5${isSold ? ' cdv__title--sold' : ''}`}
              dangerouslySetInnerHTML={{ __html: car.title.rendered }}
            />
            <h2 className={`cdv__price fw-bold mb-4${isSold ? ' cdv__price--sold' : ''}`}>
              {isSold ? 'Såld' : price}
            </h2>

            <div className="d-grid gap-3 mb-5">
              {isSold ? (
                <div className="cdv__sold-btn">
                  SÅLD — EJ TILLGÄNGLIG
                </div>
              ) : (
                <a
                  href={blocketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cdv__blocket-btn btn btn-lg fw-bold py-3 rounded-4 border-2 btn-warning text-decoration-none d-flex align-items-center justify-content-center"
                >
                  SE BILEN PÅ BLOCKET
                </a>
              )}

              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="btn btn-outline-dark fw-bold py-2 border-0 d-flex align-items-center justify-content-center gap-2"
              >
                <i className="bi bi-telephone" /> Ring oss: {siteConfig.contact.phone}
              </a>
            </div>

            {/* Specs grid */}
            <div className={`cdv__specs row g-3 p-4 bg-white rounded-4 shadow-sm border mx-0${isSold ? ' cdv__specs--sold' : ''}`}>
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

      {/* 4. DESCRIPTION */}
      <div className="row mt-5">
        <div className="col-12">
          <hr className="cdv__divider my-5" />
          <h3 className="cdv__desc-heading fw-black mb-4 text-uppercase">
            Information & Beskrivning
          </h3>
          <div
            className="cdv__desc-content"
            dangerouslySetInnerHTML={{ __html: car.content?.rendered }}
          />
        </div>
      </div>

    </div>
  );
}

function SpecItem({ label, value }) {
  return (
    <div className="col-6 col-md-4">
      <small className="cdv__spec-label d-block text-uppercase fw-bold mb-1">
        {label}
      </small>
      <span className="cdv__spec-value fw-bold">
        {value || '—'}
      </span>
    </div>
  );
}