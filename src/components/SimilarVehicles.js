'use client';

import Link from 'next/link';
import '@/styles/bilarPage.css';

export default function SimilarVehicles({ cars }) {
  return (
    <div className="similar-vehicles-grid">
      {cars.map((car) => {
        const meta = car.meta || {};
        const isNew = meta._car_is_new === 'yes';
        const folder = isNew ? 'nytt' : 'begagnat';
        const img = meta._car_thumbnail || '/placeholder-car.jpg';

        return (
          <div key={car.id} className="vehicle-card">
            <Link
              href={`/bilar/${folder}/${car.slug}/`}
              className="vehicle-card__link"
            >
              <div className="vehicle-card__image-wrap">
                <img
                  src={img}
                  alt={car.title.rendered}
                  className="vehicle-card__image"
                />
                <span
                  className={`vehicle-card__badge ${
                    isNew ? 'vehicle-card__badge--new' : 'vehicle-card__badge--used'
                  }`}
                >
                  {isNew ? 'NYHET' : 'BEGAGNAD'}
                </span>
              </div>

              <div className="vehicle-card__body">
                <p className="vehicle-card__meta">
                  {meta._car_make} {meta._car_year}
                </p>

                <h3
                  className="vehicle-card__title"
                  dangerouslySetInnerHTML={{ __html: car.title.rendered }}
                />

                <div className="vehicle-card__footer">
                  <span className="vehicle-card__price">
                    {meta._car_price
                      ? `${parseInt(meta._car_price, 10).toLocaleString('sv-SE')} kr`
                      : 'Ring för pris'}
                  </span>
                  <span className="vehicle-card__cta">Visa</span>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}