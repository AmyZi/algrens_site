'use client';

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import GaragePreview from './GaragePreview';

const brands = [
  "PILOTE", "BAVARIA", "HYMER", "LAIKA", "EURA MOBIL",
  "DETHLEFFS", "BÜRSTNER", "CARADO", "RAPIDO", "MCLOUIS",
  "KNAUS", "CHAUSSON", "PÖSSL", "LMC", "ADRIA"
];

export default function HomePage({ cars = [] }) {
  const wpBaseUrl = 'https://www.ahlgrens.eu';

  return (
    /* Global wrapper with overflow hidden to prevent horizontal mobile shaking */
    <div className="home-page" style={{ backgroundColor: '#FFFFFF', overflowX: 'hidden' }}>

      {/* 1. HERO SECTION */}
      <section
        className="hero-section d-flex align-items-center"
        style={{
          minHeight: '80vh',
          background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('${wpBaseUrl}/wp-content/uploads/2026/02/Hero.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#FFFFFF',
        }}
      >
        <Container>
          <Row>
            <Col lg={7}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {/* Responsive font size clamp to prevent title from breaking layout on small phones */}
                <h1 className="fw-bold mb-4" style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', lineHeight: '1.1' }}>
                  Husbilar & Fritidsbilar<br />i Borås
                </h1>
                <p className="lead fs-4 mb-5" style={{ opacity: 0.9, maxWidth: '600px' }}>
                  Handplockat urval av husbilar och fritidsfordon.
                  Över 25 års branscherfarenhet.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <Link href="/bilar" className="btn btn-lg px-4 py-3 fw-bold" style={{ backgroundColor: '#FFD700', color: '#000', borderRadius: '0', fontSize: '1rem' }}>
                    SE VÅRA BILAR
                  </Link>
                  <Link href="/kontakt" className="btn btn-lg px-4 py-3 btn-outline-light fw-bold" style={{ borderRadius: '0', fontSize: '1rem' }}>
                    KONTAKTA OSS
                  </Link>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 2. BRAND TICKER */}
      <div style={{ backgroundColor: '#FFD700', padding: '15px 0', overflow: 'hidden', whiteSpace: 'nowrap', borderTop: '1px solid #000', borderBottom: '1px solid #000' }}>
        <motion.div
          animate={{ x: [0, -2000] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          style={{ display: 'inline-block' }}
        >
          {[...brands, ...brands].map((brand, i) => (
            <span key={i} style={{ fontSize: '1.2rem', fontWeight: '900', color: '#000', margin: '0 30px', letterSpacing: '2px' }}>
              {brand} •
            </span>
          ))}
        </motion.div>
      </div>

      {/* 3. UTVALDA FORDON - MOBILE RESPONSIVE SWIPEABLE GRID */}
      <section className="py-5 mt-4">
        <Container>
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h6 className="text-primary fw-bold text-uppercase small" style={{ letterSpacing: '2px' }}>Premium Selection</h6>
              <h2 className="fw-bold m-0" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)' }}>Utvalda Fordon</h2>
            </div>
            <Link href="/bilar" className="text-dark fw-bold text-decoration-none border-bottom border-2 border-dark pb-1 small">
              Se alla bilar
            </Link>
          </div>

          {/* This wrapper enables horizontal scroll on mobile, and standard grid on desktop */}
          <div className="car-scroll-wrapper" style={{ margin: '0 -15px', padding: '0 15px' }}>
            <Row 
              className="flex-nowrap flex-md-wrap g-4" 
              style={{ 
                overflowX: 'auto', 
                WebkitOverflowScrolling: 'touch',
                scrollSnapType: 'x mandatory',
                paddingBottom: '20px'
              }}
            >
              {cars && cars.length > 0 ? (
                cars
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 3)
                  .map((car) => {
                    const meta = car.meta || {};
                    const isNew = meta._car_is_new === 'yes';
                    const folder = isNew ? 'nytt' : 'begagnat';
                    const thumbnail = meta._car_thumbnail || '/placeholder-car.jpg';
                    const price = meta._car_price
                      ? parseInt(meta._car_price).toLocaleString('sv-SE') + ' kr'
                      : 'Ring för pris';

                    return (
                      <Col 
                        xs={10} md={6} lg={4} 
                        key={car.id} 
                        style={{ scrollSnapAlign: 'start', flex: '0 0 auto' }}
                      >
                        <motion.div
                          whileHover={{ y: -5 }}
                          className="border-0 bg-light shadow-sm overflow-hidden h-100"
                        >
                          <div style={{ height: '220px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                            <img
                              src={thumbnail}
                              alt={car.title?.rendered}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => { e.target.src = '/placeholder-car.jpg'; }}
                            />
                            <div
                              className="position-absolute top-0 start-0 m-2 px-3 py-1 fw-bold text-uppercase"
                              style={{ backgroundColor: isNew ? '#FFD700' : '#000', color: isNew ? '#000' : '#FFF', fontSize: '0.65rem', zIndex: 2 }}
                            >
                              {isNew ? 'Nyhet' : 'Begagnad'}
                            </div>
                          </div>

                          <div className="p-3">
                            <p className="text-muted mb-1 fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
                              {meta._car_make} · {meta._car_year}
                            </p>
                            <h3
                              className="h6 fw-bold mb-2 text-truncate"
                              dangerouslySetInnerHTML={{ __html: car.title?.rendered }}
                            />
                            <p className="text-muted small mb-3">
                              {meta._car_mileage ? `${parseInt(meta._car_mileage).toLocaleString('sv-SE')} mil` : ''}
                              {meta._car_fuel ? ` · ${meta._car_fuel}` : ''}
                            </p>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="fw-bold mb-0">{price}</span>
                              <Link
                                href={`/bilar/${folder}/${car.slug}`}
                                className="btn btn-dark btn-sm rounded-0 px-3 py-2 fw-bold"
                                style={{ fontSize: '0.75rem' }}
                              >
                                VISA
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      </Col>
                    );
                  })
              ) : (
                <Col className="text-center py-5 w-100">
                  <p className="text-muted">Inga fordon hittades just nu.</p>
                </Col>
              )}
            </Row>
          </div>
        </Container>
      </section>

      {/* 4. ABOUT SECTION */}
      <section className="py-5" style={{ backgroundColor: '#F8F9FA' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={5} className="mb-5 mb-lg-0">
              <div className="position-relative">
                <div style={{ position: 'absolute', top: '-15px', left: '-15px', width: '100%', height: '100%', border: '2px solid #FFD700', zIndex: 0 }} />
                <div className="bg-dark position-relative" style={{ zIndex: 1 }}>
                  <Image
                    src={`${wpBaseUrl}/wp-content/uploads/2026/02/Algrens_CEO.jpeg`}
                    alt="Ahlgrens Husbilar CEO"
                    width={600}
                    height={700}
                    style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                    unoptimized
                  />
                </div>
              </div>
            </Col>
            <Col lg={6} className="offset-lg-1">
              <h2 className="fw-bold mb-4" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)' }}>Vår Historia</h2>
              <p className="lead mb-4">
                På Ahlgrens Automotive erbjuder vi ett noggrant utvalt sortiment av premium husbilar från Europas mest ansedda tillverkare.
              </p>
              <div className="d-flex gap-4 mb-4">
                <div>
                  <h3 className="fw-bold mb-0">25+</h3>
                  <p className="small text-muted">Års Erfarenhet</p>
                </div>
                <div className="border-start ps-4">
                  <h3 className="fw-bold mb-0">3000+</h3>
                  <p className="small text-muted">Nöjda Kunder</p>
                </div>
              </div>
              <Link href="/om-oss" className="btn btn-dark px-5 py-3 fw-bold rounded-0" style={{ letterSpacing: '2px' }}>
                LÄS MER
              </Link>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 5. GARAGE PREVIEW */}
      <GaragePreview />

      {/* 6. CONTACT */}
      <section className="py-5" style={{ backgroundColor: '#000', color: '#fff' }}>
        <Container>
          <Row className="align-items-center py-4">
            <Col lg={6}>
              <h2 className="fw-bold mb-3" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}>Redo för nästa äventyr?</h2>
              <p className="fs-5 text-muted mb-0">Vi finns här för personlig rådgivning och visning.</p>
            </Col>
            <Col lg={6} className="text-lg-end mt-4 mt-lg-0">
              <Link
                href="/kontakt"
                className="btn btn-lg px-5 py-3 fw-bold"
                style={{ 
                  backgroundColor: '#FFD700', 
                  color: '#000', 
                  borderRadius: '0', 
                  clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)' 
                }}
              >
                KONTAKTA OSS IDAG
              </Link>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Internal CSS for the swipe indicator / hiding scrollbars */}
      <style jsx>{`
        .car-scroll-wrapper::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 767px) {
          .car-scroll-wrapper Row {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        }
      `}</style>

    </div>
  );
}