import Link from 'next/link';

const BODY_TYPE_LABELS = {
  'Husbil-halvintegrerad': 'Halvintegrerad',
  'Husbil-integrerad':     'Integrerad',
  'Husbil-alkov':          'Alkov',
  'Husvagn, 1-axl':        'Enkelaxlad',
  'Husvagn, 2-axl':        'Dubbelaxlad',
  'Husvagn-övrigt':        'Övrig husvagn',
  // Fallbacks for any raw English strings leaking from old data
  'Caravan other':          'Övrig husvagn',
  'Motorhome semi-integrated': 'Halvintegrerad',
  'Motorhome integrated':   'Integrerad',
  'Motorhome alcove':       'Alkov',
};

const CONDITION_LABEL = {
  sold: 'SÅLD',
  new:  'NYHET',
  used: 'BEGAGNAD',
};

export default function CarCard({ car, viewMode = 'grid' }) {
  if (!car || !car.meta) return null;

  const meta      = car.meta;
  const isNew     = meta._car_is_new === 'yes';
  const isSold    = meta._car_is_sold === 'yes';
  const folder    = isNew ? 'nytt' : 'begagnat';
  const thumbnail = meta._car_thumbnail || '/placeholder-car.jpg';
  const price     = meta._car_price
    ? `${parseInt(meta._car_price).toLocaleString('sv-SE')} kr`
    : 'Ring för pris';

  // Only show bodyLabel if it maps — never show raw Bytbil strings
  const bodyLabel = BODY_TYPE_LABELS[meta._car_body_type] ?? null;

  const condition = isSold ? 'sold' : isNew ? 'new' : 'used';

  return (
    <div className={`vehicle-card${isSold ? ' vehicle-card--sold' : ''}${viewMode === 'list' ? ' vehicle-card--list' : ''}`}>
      <Link href={`/bilar/${folder}/${car.slug}/`} className="vehicle-card__link">

        <div className="vehicle-card__image-wrap">
          <img
            src={thumbnail}
            alt={car.title?.rendered ?? 'Fordon'}
            className="vehicle-card__image"
            loading="lazy"
          />
          <span className={`vehicle-card__badge vehicle-card__badge--${condition}`}>
            {CONDITION_LABEL[condition]}
          </span>
          {isSold && <div className="vehicle-card__sold-overlay">SÅLD</div>}
        </div>

        <div className="vehicle-card__body">
          <p className="vehicle-card__meta">
            {meta._car_make} {meta._car_year}
          </p>
          <h5
            className="vehicle-card__title"
            dangerouslySetInnerHTML={{ __html: car.title?.rendered }}
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