'use client';
import Link from 'next/link';

export default function SimilarVehicles({ cars }) {
  return (
    <div className="row g-4">
      {cars.map((car) => {
        const meta = car.meta || {};
        const isNew = meta._car_is_new === 'yes';
        const folder = isNew ? 'nytt' : 'begagnat';
        const img = meta._car_thumbnail || '/placeholder-car.jpg';

        return (
          <div key={car.id} className="col-md-4">
            <Link
              href={`/bilar/${folder}/${car.slug}/`}
              className="card h-100 border-0 shadow-sm text-decoration-none transition-all"
              style={{ 
                borderRadius: '20px', 
                overflow: 'hidden', 
                backgroundColor: 'var(--cream)', // Matching the specs grid
                transition: 'transform 0.3s ease'
              }}
            >
              {/* IMAGE WRAPPER */}
              <div style={{ height: '200px', position: 'relative' }}>
                <img src={img} className="w-100 h-100 object-fit-cover" alt={car.title.rendered} />
                <span 
                  className="position-absolute top-0 start-0 m-2 badge rounded-pill"
                  style={{ 
                    backgroundColor: isNew ? 'var(--sage)' : 'var(--slate)',
                    fontSize: '0.6rem',
                    fontWeight: '800'
                  }}
                >
                  {isNew ? 'NYHET' : 'BEGAGNAD'}
                </span>
              </div>

              {/* CARD CONTENT */}
              <div className="card-body p-4">
                <small 
                  className="fw-bold text-uppercase d-block mb-1" 
                  style={{ color: 'var(--sage)', fontSize: '0.7rem', letterSpacing: '0.5px' }}
                >
                  {meta._car_make} {meta._car_year}
                </small>
                
                <h6 
                  className="fw-black mb-2" 
                  style={{ color: 'var(--charcoal)', fontWeight: '900', lineHeight: '1.4' }} 
                  dangerouslySetInnerHTML={{ __html: car.title.rendered }} 
                />
                
                <p 
                  className="fw-bold mb-0 mt-3" 
                  style={{ color: 'var(--slate)', fontSize: '1.1rem' }}
                >
                  {meta._car_price ? `${parseInt(meta._car_price).toLocaleString('sv-SE')} kr` : 'Ring för pris'}
                </p>
              </div>
            </Link>
          </div>
        );
      })}
      
      <style jsx>{`
        .transition-all:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important;
        }
      `}</style>
    </div>
  );
}