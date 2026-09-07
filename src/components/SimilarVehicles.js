'use client';

import Link from 'next/link';
import '@/styles/homePage.css';

export default function SimilarVehicles({ cars, title = 'Liknande fordon' }) {
  if (!cars || cars.length === 0) return null;

  return (
    <section className="featured-section">
      <div className="featured-header">
        <h2 className="featured-title">{title}</h2>
      </div>

      <div className="hcard-row">
        {cars.map((car) => {
          const meta = car.meta || {};
          const isNew = meta._car_is_new === 'yes';
          const folder = isNew ? 'nytt' : 'begagnat';
          const img = meta._car_thumbnail || '/placeholder-car.jpg';
          const price = meta._car_price
            ? `${parseInt(meta._car_price, 10).toLocaleString('sv-SE')} kr`
            : 'Ring för pris';

          return (
            <div key={car.id} className="hcard">
              <div className="hcard__image-wrap">
                <img
                  src={img}
                  alt={car.title.rendered}
                  className="hcard__image"
                />
                <span
                  className={`hcard__badge${isNew ? ' hcard__badge--new' : ' hcard__badge--used'}`}
                >
                  {isNew ? 'NYHET' : 'BEGAGNAD'}
                </span>
              </div>

              <Link href={`/bilar/${folder}/${car.slug}/`} className="hcard__body-link">
                <div className="hcard__body">
                  <p className="hcard__meta">{meta._car_make} · {meta._car_year}</p>
                  <h3
                    className="hcard__title"
                    dangerouslySetInnerHTML={{ __html: car.title.rendered }}
                  />
                  <div className="hcard__footer">
                    <span className="hcard__price">{price}</span>
                    <span className="hcard__cta">VISA</span>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}