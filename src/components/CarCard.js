import Link from 'next/link';

export default function CarCard({ car }) {
  if (!car || !car.meta) return null;

  const meta = car.meta;
  const isNew = meta._car_is_new === 'yes';
  const folder = isNew ? 'nytt' : 'begagnat';
  const thumbnail = meta._car_thumbnail || '/placeholder-car.jpg';
  
  const price = meta._car_price 
    ? `${parseInt(meta._car_price).toLocaleString('sv-SE')} kr` 
    : "Ring för pris";

  return (
    <div className="col-12 col-md-6 col-lg-4 mb-4">
      {/* Background set to cream, text to charcoal */}
      <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '20px', overflow: 'hidden', backgroundColor: 'var(--cream)' }}>
        
        {/* IMAGE SECTION */}
        <div className="position-relative" style={{ height: '220px' }}>
          <img 
            src={thumbnail} 
            className="card-img-top w-100 h-100" 
            style={{ objectFit: 'cover' }} 
            alt={car.title?.rendered}
          />
          {/* Badge using SAGE for New and SLATE for Used */}
          <span 
            className="position-absolute top-0 start-0 m-3 badge rounded-pill"
            style={{ 
              backgroundColor: isNew ? 'var(--sage)' : 'var(--slate)',
              color: 'white',
              padding: '8px 16px',
              fontSize: '10px',
              letterSpacing: '1px'
            }}
          >
            {isNew ? 'NYHET' : 'BEGAGNAD'}
          </span>
        </div>

        {/* BODY SECTION */}
        <div className="card-body d-flex flex-column p-4" style={{ color: 'var(--charcoal)' }}>
          {/* Using Sage for the Make/Year subheader */}
          <small className="fw-bold text-uppercase mb-1" style={{ color: 'var(--sage)', letterSpacing: '0.5px' }}>
            {meta._car_make} {meta._car_year}
          </small>
          
          <h5 className="card-title fw-black mb-3" 
              style={{ color: 'var(--charcoal)', fontWeight: '900' }}
              dangerouslySetInnerHTML={{ __html: car.title?.rendered }} />

          {/* Specs using Taupe/Light Slate look */}
          <div className="mb-4">
            <span className="badge me-1 fw-normal border" style={{ backgroundColor: 'rgba(74, 87, 89, 0.1)', color: 'var(--slate)' }}>{meta._car_fuel}</span>
            <span className="badge me-1 fw-normal border" style={{ backgroundColor: 'rgba(74, 87, 89, 0.1)', color: 'var(--slate)' }}>{meta._car_gearbox}</span>
            <span className="badge fw-normal border" style={{ backgroundColor: 'rgba(74, 87, 89, 0.1)', color: 'var(--slate)' }}>{meta._car_mileage} mil</span>
          </div>

          {/* FOOTER */}
          <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center" style={{ borderColor: 'rgba(44, 44, 44, 0.1) !important' }}>
            <span className="h5 mb-0 fw-black" style={{ color: 'var(--charcoal)', fontWeight: '900' }}>{price}</span>
            
            {/* Button using Charcoal/Slate for a premium look */}
            <Link 
              href={`/bilar/${folder}/${car.slug}/`} 
              className="btn btn-sm rounded-pill px-4 fw-bold transition-all"
              style={{ 
                backgroundColor: 'var(--charcoal)', 
                color: 'var(--cream)',
                border: 'none'
              }}
            >
              Visa mer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}