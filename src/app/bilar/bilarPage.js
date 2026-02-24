'use client';
import { useState } from 'react';
import CarCard from '@/components/CarCard';
import Link from 'next/link';

const CARS_PER_PAGE = 6;

export default function BilarPage({ cars, initialFilter = 'all' }) {
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCars = cars.filter((car) => {
    if (initialFilter === 'new') return car.meta?._car_is_new === 'yes';
    if (initialFilter === 'used') return car.meta?._car_is_new !== 'yes';
    return true;
  });

  const totalPages = Math.ceil(filteredCars.length / CARS_PER_PAGE);
  const startIndex = (currentPage - 1) * CARS_PER_PAGE;
  const currentCars = filteredCars.slice(startIndex, startIndex + CARS_PER_PAGE);

  const goTo = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container py-5 mt-5">

      {/* BREADCRUMB */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb" style={{ fontSize: '0.85rem' }}>
          <li className="breadcrumb-item">
            <Link href="/" className="text-decoration-none text-muted">Hem</Link>
          </li>
          <li className="breadcrumb-item">
            <Link href="/bilar" className="text-decoration-none text-muted">Lager</Link>
          </li>
          {initialFilter !== 'all' && (
            <li className="breadcrumb-item active" style={{ fontWeight: 700 }}>
              {initialFilter === 'new' ? 'Nya husbilar' : 'Begagnade'}
            </li>
          )}
        </ol>
      </nav>

      <div className="row mb-4 align-items-end">
        <div className="col-12 col-md-6">
          <h1 className="fw-bold text-uppercase border-bottom pb-3 mb-0">
            {initialFilter === 'new' ? 'Nya Husbilar' : initialFilter === 'used' ? 'Begagnade Bilar' : 'Vårt Lager'}
          </h1>
        </div>
        <div className="col-12 col-md-6 mt-3 mt-md-0 d-flex justify-content-md-end">
          <p className="text-muted mb-0 align-self-end">{filteredCars.length} fordon</p>
        </div>
      </div>

      {/* FILTER TABS — navigate by slug */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        <Link
          href="/bilar"
          className={`btn rounded-pill px-4 fw-bold ${initialFilter === 'all' ? 'btn-dark' : 'btn-outline-secondary'}`}
          style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}
        >
          Alla fordon
        </Link>
        <Link
          href="/bilar/begagnat"
          className={`btn rounded-pill px-4 fw-bold ${initialFilter === 'used' ? 'btn-dark' : 'btn-outline-secondary'}`}
          style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}
        >
          Begagnade
        </Link>
        <Link
          href="/bilar/nytt"
          className={`btn rounded-pill px-4 fw-bold ${initialFilter === 'new' ? 'btn-dark' : 'btn-outline-secondary'}`}
          style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}
        >
          Nya husbilar
        </Link>
      </div>

      {/* CAR GRID */}
      <div className="row g-4">
        {currentCars.length > 0 ? (
          currentCars.map((car) => <CarCard key={car.id} car={car} />)
        ) : (
          <div className="col-12 text-center py-5">
            <div className="alert alert-light border">Inga fordon hittades just nu.</div>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-2 mt-5 flex-wrap">
          <button
            onClick={() => goTo(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: '42px', height: '42px' }}
            aria-label="Föregående"
          >
            ←
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goTo(page)}
              className={`btn rounded-circle d-flex align-items-center justify-content-center ${
                currentPage === page ? 'btn-dark' : 'btn-outline-secondary'
              }`}
              style={{ width: '42px', height: '42px', fontWeight: 600 }}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => goTo(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: '42px', height: '42px' }}
            aria-label="Nästa"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}