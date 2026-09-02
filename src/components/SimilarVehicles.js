'use client';

import Link from 'next/link';
import '@/styles/similarVehicles.css';

export default function SimilarVehicles({ cars }) {
  return (
    <div className="similar-vehicles">
      {cars.map((car) => {
        const meta = car.meta || {};
        const isNew = meta._car_is_new === 'yes';
        const folder = isNew ? 'nytt' : 'begagnat';
        const img = meta._car_thumbnail || '/placeholder-car.jpg';

        return (
          <Link
            key={car.id}
            href={`/bilar/${folder}/${car.slug}/`}
            className="similar-vehicles__card"
          >
            <div className="similar-vehicles__image-wrap">
              <img
                src={img}
                alt={car.title.rendered}
                className="similar-vehicles__image"
              />
              <span
                className={`similar-vehicles__badge ${
                  isNew
                    ? 'similar-vehicles__badge--new'
                    : 'similar-vehicles__badge--used'
                }`}
              >
                {isNew ? 'NYHET' : 'BEGAGNAD'}
              </span>
            </div>

            <div className="similar-vehicles__body">
              <small className="similar-vehicles__make">
                {meta._car_make} {meta._car_year}
              </small>

              <h3
                className="similar-vehicles__title"
                dangerouslySetInnerHTML={{ __html: car.title.rendered }}
              />

              <p className="similar-vehicles__price">
                {meta._car_price
                  ? `${parseInt(meta._car_price, 10).toLocaleString('sv-SE')} kr`
                  : 'Ring för pris'}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}