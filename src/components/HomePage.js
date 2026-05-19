'use client';

import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import GaragePreview from './GaragePreview';

const brands = [
  "PILOTE", "BAVARIA", "HYMER", "LAIKA", "EURA MOBIL",
  "DETHLEFFS", "BÜRSTNER", "CARADO", "RAPIDO", "MCLOUIS",
  "KNAUS", "CHAUSSON", "PÖSSL", "LMC", "ADRIA"
];

export default function HomePage({ cars = [] }) {
  const wpBaseUrl = 'https://www.ahlgrens.eu';
  const [activeIndex, setActiveIndex] = useState(0);

  const featuredCars = [...cars]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  return (
    <div className="home-page" style={{ backgroundColor: '#FFFFFF' }}>

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
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 900, marginBottom: '1rem' }}>
                  Husbilar & Fritidsbilar<br />i Borås
                </h1>
                <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', opacity: 0.9, marginBottom: '2rem' }}>
                  Handplockat urval av husbilar och fritidsfordon.
                  Erfaren husbilshandlare med över 25 års branscherfarenhet.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  <Link href="/bilar" className="btn btn-lg fw-bold"
                    style={{ backgroundColor: '#FFD700', color: '#000', borderRadius: '0', padding: '12px 32px' }}>
                    SE VÅRA BILAR
                  </Link>
                  <Link href="/kontakt" className="btn btn-lg btn-outline-light fw-bold"
                    style={{ borderRadius: '0', padding: '12px 32px' }}>
                    KONTAKTA OSS
                  </Link>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 2. BRAND TICKER */}
      <div style={{
        backgroundColor: '#FFD700',
        padding: '20px 0',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        borderTop: '1px solid #000',
        borderBottom: '1px solid #000'
      }}>
        <motion.div
          animate={{ x: [0, -2000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ display: 'inline-block' }}
        >
          {[...brands, ...brands].map((brand, i) => (
            <span key={i} style={{
              fontSize: 'clamp(1rem, 2vw, 1.5rem)',
              fontWeight: '900',
              color: '#000',
              margin: '0 40px',
              letterSpacing: '2px'
            }}>
              {brand} •
            </span>
          ))}
        </motion.div>
      </div>

      {/* 3. UTVALDA FORDON */}
      <section style={{ padding: '60px 0' }}>
        <Container>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <h6 className="text-primary fw-bold text-uppercase" style={{ letterSpacing: '2px' }}>
                Premium Selection
              </h6>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, margin: 0 }}>
                Utvalda Fordon
              </h2>
            </div>
            <Link href="/bilar" className="text-dark fw-bold text-decoration-none"
              style={{ borderBottom: '2px solid #000', paddingBottom: '2px' }}>
              Se alla bilar
            </Link>
          </div>

          {featuredCars.length > 0 ? (
            <>
              {/* DESKTOP: 3 columns — hidden on mobile */}
              <Row className="g-4" style={{ display: 'none' }} id="desktop-cars">
                {featuredCars.map((car) => (
                  <Col lg={4} md={6} key={car.id}>
                    <CarCard car={car} />
                  </Col>
                ))}
              </Row>

              {/* MOBILE CAROUSEL */}
              <div id="mobile-cars">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.25 }}
                  >
                    <CarCard car={featuredCars[activeIndex]} />
                  </motion.div>
                </AnimatePresence>

                {/* Dot + Arrow Navigation */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '24px',
                  gap: '12px'
                }}>
                  <button
                    onClick={() => setActiveIndex((i) => Math.max(i - 1, 0))}
                    disabled={activeIndex === 0}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      border: '1px solid #000',
                      backgroundColor: 'transparent',
                      cursor: activeIndex === 0 ? 'not-allowed' : 'pointer',
                      opacity: activeIndex === 0 ? 0.3 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px'
                    }}
                  >
                    ←
                  </button>

                  {featuredCars.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      style={{
                        width: activeIndex === i ? '24px' : '8px',
                        height: '8px',
                        borderRadius: '4px',
                        backgroundColor: activeIndex === i ? '#000' : '#ccc',
                        border: 'none',
                        padding: 0,
                        WebkitTransition: 'all 0.3s ease',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                    />
                  ))}

                  <button
                    onClick={() => setActiveIndex((i) => Math.min(i + 1, featuredCars.length - 1))}
                    disabled={activeIndex === featuredCars.length - 1}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      border: '1px solid #000',
                      backgroundColor: 'transparent',
                      cursor: activeIndex === featuredCars.length - 1 ? 'not-allowed' : 'pointer',
                      opacity: activeIndex === featuredCars.length - 1 ? 0.3 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px'
                    }}
                  >
                    →
                  </button>
                </div>

                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <Link href="/bilar" className="text-dark fw-bold text-decoration-none"
                    style={{ borderBottom: '2px solid #000', paddingBottom: '2px' }}>
                    Se alla bilar
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p className="text-muted">Inga fordon hittades just nu.</p>
            </div>
          )}
        </Container>
      </section>

      {/* 4. ABOUT SECTION */}
      <section style={{ padding: '60px 0', backgroundColor: '#F8F9FA' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={5} className="position-relative mb-5 mb-lg-0">
              <div style={{
                position: 'absolute',
                top: '-20px',
                left: '-20px',
                width: '100%',
                height: '100%',
                border: '2px solid #FFD700',
                zIndex: 0
              }} />
              <div className="bg-dark position-relative" style={{ minHeight: '400px', zIndex: 1 }}>
                <Image
                  src={`${wpBaseUrl}/wp-content/uploads/2026/05/jonas_temp.jpeg`}
                  alt="Ahlgrens Husbilar CEO"
                  width={600}
                  height={700}
                  style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                  unoptimized
                />
              </div>
            </Col>
            <Col lg={6} className="offset-lg-1 mt-5 mt-lg-0">
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '1rem' }}>
                Vår Historia
              </h2>
              <p className="lead mb-4">
                På Ahlgrens Automotive erbjuder vi ett noggrant utvalt sortiment av premium husbilar
                från Europas mest ansedda tillverkare.
              </p>
              <div style={{ display: 'flex', gap: '32px', marginBottom: '2rem' }}>
                <div>
                  <h3 className="fw-bold mb-0">25+</h3>
                  <p className="small text-muted">Års Erfarenhet</p>
                </div>
                <div style={{ borderLeft: '1px solid #dee2e6', paddingLeft: '32px' }}>
                  <h3 className="fw-bold mb-0">3000+</h3>
                  <p className="small text-muted">Nöjda Kunder</p>
                </div>
              </div>
              <Link href="/om-oss" className="btn btn-dark fw-bold"
                style={{ borderRadius: '0', letterSpacing: '2px', padding: '12px 40px' }}>
                LÄS MER
              </Link>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 5. GARAGE PREVIEW */}
      <GaragePreview />

      {/* 6. CONTACT */}
      <section style={{ padding: '60px 0', backgroundColor: '#000', color: '#fff' }}>
        <Container>
          <Row className="align-items-center" style={{ padding: '40px 0' }}>
            <Col lg={6}>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: '1rem' }}>
                Redo för<br />nästa äventyr?
              </h2>
              <p className="fs-5 text-muted mb-0">Vi finns här för personlig rådgivning och visning.</p>
            </Col>
            <Col lg={6} className="mt-4 mt-lg-0" style={{ textAlign: 'right' }}>
              {/* Removed clipPath — not supported in all Safari versions */}
              <Link
                href="/kontakt"
                className="btn btn-lg fw-bold"
                style={{
                  backgroundColor: '#FFD700',
                  color: '#000',
                  borderRadius: '0',
                  padding: '16px 40px',
                  display: 'inline-block'
                }}
              >
                KONTAKTA OSS IDAG
              </Link>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Safari-safe responsive styles */}
      <style jsx global>{`
        @media (min-width: 768px) {
          #desktop-cars {
            display: flex !important;
          }
          #mobile-cars {
            display: none !important;
          }
        }
        @media (max-width: 767px) {
          #desktop-cars {
            display: none !important;
          }
          #mobile-cars {
            display: block !important;
          }
        }
      `}</style>

    </div>
  );
}

function CarCard({ car }) {
  const meta = car.meta || {};
  const isNew = meta._car_is_new === 'yes';
  const folder = isNew ? 'nytt' : 'begagnat';
  const thumbnail = meta._car_thumbnail || '/placeholder-car.jpg';
  const price = meta._car_price
    ? parseInt(meta._car_price).toLocaleString('sv-SE') + ' kr'
    : 'Ring för pris';

  return (
    <motion.div
      whileHover={{ y: -6 }}
      style={{
        backgroundColor: '#f8f9fa',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)',
      }}
    >
      <div style={{ height: '250px', width: '100%', overflow: 'hidden', position: 'relative' }}>
        <img
          src={thumbnail}
          alt={car.title?.rendered}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={(e) => { e.target.src = '/placeholder-car.jpg'; }}
        />
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          backgroundColor: isNew ? '#FFD700' : '#000',
          color: isNew ? '#000' : '#FFF',
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          padding: '4px 12px',
          zIndex: 2
        }}>
          {isNew ? 'Nyhet' : 'Begagnad'}
        </div>
      </div>

      <div style={{ padding: '20px 24px 24px' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#6c757d', margin: '0 0 4px' }}>
          {meta._car_make} · {meta._car_year}
        </p>
        <h3
          style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}
          dangerouslySetInnerHTML={{ __html: car.title?.rendered }}
        />
        <p style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '16px' }}>
          {meta._car_mileage ? `${parseInt(meta._car_mileage).toLocaleString('sv-SE')} mil` : ''}
          {meta._car_fuel ? ` · ${meta._car_fuel}` : ''}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>{price}</span>
          <Link
            href={`/bilar/${folder}/${car.slug}`}
            className="btn btn-dark btn-sm fw-bold"
            style={{ borderRadius: '0', padding: '8px 20px' }}
          >
            VISA
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
