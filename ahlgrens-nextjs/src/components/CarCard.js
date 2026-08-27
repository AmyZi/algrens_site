'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import '@/styles/bilarPage.css';
import { EffectFade, EffectCube, Autoplay, Pagination } from 'swiper/modules';

const BODY_TYPE_LABELS = {
  'Husbil-halvintegrerad':     'Halvintegrerad',
  'Husbil-integrerad':         'Integrerad',
  'Husbil-alkov':              'Alkov',
  'Husvagn, 1-axl':            'Enkelaxlad',
  'Husvagn, 2-axl':            'Dubbelaxlad',
  'Husvagn-övrigt':            'Övrig husvagn',
  'Caravan other':             'Övrig husvagn',
  'Motorhome semi-integrated': 'Halvintegrerad',
  'Motorhome integrated':      'Integrerad',
  'Motorhome alcove':          'Alkov',
};

const CONDITION_LABEL = {
  sold: 'SÅLD',
  new:  'NYHET',
  used: 'BEGAGNAD',
};

function getImages(meta) {
  const gallery = meta._car_gallery_urls;
  if (gallery) {
    const urls = gallery.split(',').map(u => u.trim()).filter(Boolean);
    if (urls.length > 0) return urls;
  }
  const thumb = meta._car_thumbnail;
  if (thumb) return [thumb];
  return ['/placeholder-car.jpg'];
}

function CardImages({ images, title }) {
  return (
    <img
      src={images[0]}
      alt={title ?? 'Fordon'}
      className="vehicle-card__image"
      loading="eager"
    />
  );
}

export default function CarCard({ car, viewMode = 'grid' }) {
  if (!car || !car.meta) return null;

  const meta      = car.meta;
  const isNew     = meta._car_is_new  === 'yes';
  const isSold    = meta._car_is_sold === 'yes';
  const folder    = isNew ? 'nytt' : 'begagnat';
  const images    = getImages(meta);
  const title     = car.title?.rendered ?? 'Fordon';
  const bodyLabel = BODY_TYPE_LABELS[meta._car_body_type] ?? null;
  const condition = isSold ? 'sold' : isNew ? 'new' : 'used';
  const price     = meta._car_price
    ? `${parseInt(meta._car_price).toLocaleString('sv-SE')} kr`
    : 'Ring för pris';

  return (
    <div className={`vehicle-card${isSold ? ' vehicle-card--sold' : ''}${viewMode === 'list' ? ' vehicle-card--list' : ''}`}>

      <div className="vehicle-card__image-wrap">
        <CardImages images={images} title={title} />
        <span className={`vehicle-card__badge vehicle-card__badge--${condition}`}>
          {CONDITION_LABEL[condition]}
        </span>
        {isSold && <div className="vehicle-card__sold-overlay">SÅLD</div>}
      </div>

      <Link href={`/bilar/${folder}/${car.slug}/`} className="vehicle-card__link vehicle-card__link--body">
        <div className="vehicle-card__body">
          <p className="vehicle-card__meta">
            {meta._car_make} {meta._car_year}
          </p>
          <h5
            className="vehicle-card__title"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <div className="vehicle-card__specs">
            {bodyLabel              && <span className="spec-pill">{bodyLabel}</span>}
            {meta._car_fuel         && <span className="spec-pill">{meta._car_fuel}</span>}
            {meta._car_gearbox      && <span className="spec-pill">{meta._car_gearbox}</span>}
            {meta._car_mileage      && <span className="spec-pill">{parseInt(meta._car_mileage).toLocaleString('sv-SE')} mil</span>}
            {meta._car_total_weight && <span className="spec-pill">{parseInt(meta._car_total_weight).toLocaleString('sv-SE')} kg</span>}
          </div>
          <div className="vehicle-card__footer">
            <span className="vehicle-card__price">{price}</span>
            <span className="vehicle-card__cta">Visa mer</span>
          </div>
        </div>
      </Link>

    </div>
  );
}