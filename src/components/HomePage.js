'use client';

import React, { useState, useEffect } from 'react';
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
  const [mounted, setMounted] = useState(false);

  // Fixes hydration mismatch by ensuring animations/client-logic 
  // only run after the first render.
  useEffect(() => {
    setMounted(true);
  }, []);

  const featuredCars = [...cars]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  if (!mounted) {
    // Return a simplified version or null to prevent mismatch 
    // during the initial hydration swap
    return <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }} />;
  }

  return (
    <div className="home-page" style={{ 
      backgroundColor: '#FFFFFF', 
      overflowX: 'hidden', 
      position: 'relative',
      width: '100%' 
    }}>

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
                <h1 style={{ fontSize: 'clamp(2.2rem, 8vw, 4rem)', fontWeight: 900, marginBottom: '1.5rem', lineHeight: '1.1' }}>
                  Husbilar & Fritidsbilar<br />i Borås
                </h1>
                <p style={{ fontSize: 'clamp(1.1rem, 3vw, 1.25rem)', opacity: 0.9, marginBottom: '2.5rem', maxWidth: '600px' }}>
                  Handplockat urval av husbilar och fritidsfordon.
                  Över 25 års branscherfarenhet.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <Link href="/bilar" className="btn btn-lg fw-bold"
                    style={{ backgroundColor: '#FFD700', color: '#000', borderRadius: '0', padding: '15px 35px' }}>
                    SE VÅRA BILAR
                  </Link>
                  <Link href="/kontakt" className="btn btn-lg btn-outline-light fw-bold"
                    style={{ borderRadius: '0', padding: '15px 35px' }}>
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
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          style={{ display: 'inline-block' }}
        >
          {[...brands, ...brands].map((brand, i) => (
            <span key={i} style={{
              fontSize: '1.2rem',
              fontWeight: '900',
              color: '#000',
              margin: '0 30px',
              letterSpacing: '2px'
            }}>
              {brand} •
            </span>
          ))}
        </motion.div>
      </div>

      {/* 3. UTVALDA FORDON */}
      <section style={{ padding: '80px 0' }}>
        <Container>
          <div className="d-flex justify-content-between align-items-end mb-5 flex-wrap gap-3">
            <div>
              <h6 className="text-primary fw-bold text-uppercase" style={{ letterSpacing: '2px', fontSize: '0.8rem' }}>
                Premium Selection
              </h6>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, margin: 0 }}>
                Utvalda Fordon
              </h2>
            </div>
            <Link href="/bilar" className="text-dark fw-bold text-decoration-none border-bottom border-2 border-dark pb-1">
              Se alla bilar
            </Link>
          </div>

          {featuredCars.length > 0 ? (
            <>
              {/* DESKTOP VIEW */}
              <div className="d-none d-md-block">
                <Row className="g-4">
                  {featuredCars.map((car) => (
                    <Col lg={4} md={6} key={car.id}>
                      <CarCard car={car} />
                    </Col>
                  ))}
                </Row>
              </div>

              {/* MOBILE VIEW (Carousel) */}
              <div className="d-block d-md-none">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CarCard car={featuredCars[activeIndex]} />
                  </motion.div>
                </AnimatePresence>

                <div className="d-flex justify-content-center align-items-center mt-4 gap-4">
                  <button
                    onClick={() => setActiveIndex((i) => Math.max(i - 1, 0))}
                    disabled={activeIndex === 0}
                    style={{
                      width: '44px', height: '44px', borderRadius: '50%', border: '1px solid #000',
                      backgroundColor: 'transparent', opacity: activeIndex === 0 ? 0.2 : 1
                    }}
                  >
                    ←
                  </button>
                  <div className="d-flex gap-2">
                    {featuredCars.map((_, i) => (
                      <div
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        style={{
                          width: activeIndex === i ? '25px' : '8px',
                          height: '8px', borderRadius: '4px',
                          backgroundColor: activeIndex === i ? '#000' : '#ccc',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setActiveIndex((i) => Math.min(i + 1, featuredCars.length - 1))}
                    disabled={activeIndex === featuredCars.length - 1}
                    style={{
                      width: '44px', height: '44px', borderRadius: '50%', border: '1px solid #000',
                      backgroundColor: 'transparent', opacity: activeIndex === featuredCars.length - 1 ? 0.2 : 1
                    }}
                  >
                    →
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">Inga fordon hittades just nu.</p>
            </div>
          )}
        </Container>
      </section>

      {/* 4. ABOUT SECTION */}
      <section style={{ padding: '80px 0', backgroundColor: '#F8F9FA' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={5} className="position-relative mb-5 mb-lg-0">
              <div style={{
                position: 'absolute', top: '-15px', left: '-15px',
                width: '100%', height: '100%', border: '2px solid #FFD700', zIndex: 0
              }} />
              <div className="bg-dark position-relative" style={{ minHeight: '450px', zIndex: 1 }}>
                <Image
                  src={`${wpBaseUrl}/wp-content/uploads/2026/02/Algrens_CEO.jpeg`}
                  alt="Ahlgrens Husbilar CEO"
                  width={600}
                  height={700}
                  style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                  unoptimized
                />
              </div>
            </Col>
            <Col lg={6} className="offset-lg-1">
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, marginBottom: '1.5rem' }}>
                Vår Historia
              </h2>
              <p className="lead mb-4">
                På Ahlgrens Automotive erbjuder vi ett noggrant utvalt sortiment av premium husbilar från Europas mest ansedda tillverkare.
              </p>
              <div className="d-flex gap-5 mb-4">
                <div>
                  <h3 className="fw-bold mb-0">25+</h3>
                  <p className="small text-muted">Års Erfarenhet</p>
                </div>
                <div className="border-start ps-5">
                  <h3 className="fw-bold mb-0">3000+</h3>
                  <p className="small text-muted">Nöjda Kunder</p>
                </div>
              </div>
              <Link href="/om-oss" className="btn btn-dark fw-bold px-5 py-3" style={{ borderRadius: '0', letterSpacing: '2px' }}>
                LÄS MER
              </Link>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 5. GARAGE PREVIEW */}
      <GaragePreview />

      {/* 6. CONTACT */}
      <section style={{ padding: '80px 0', backgroundColor: '#000', color: '#fff' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h2 style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', fontWeight: 900 }}>
                Redo för nästa äventyr?
              </h2>
              <p className="fs-5 text-muted">Vi finns här för personlig rådgivning och visning.</p>
            </Col>
            <Col lg={6} className="text-lg-end mt-4 mt-lg-0">
              <Link
                href="/kontakt"
                className="btn btn-lg fw-bold"
                style={{ backgroundColor: '#FFD700', color: '#000', borderRadius: '0', padding: '18px 45px' }}
              >
                KONTAKTA OSS IDAG
              </Link>
            </Col>
          </Row>
        </Container>
      </section>
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
      className="h-100 d-flex flex-column"
      style={{ backgroundColor: '#f8f9fa', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}
    >
      <div style={{ height: '240px', width: '100%', overflow: 'hidden', position: 'relative' }}>
        <img
          src={thumbnail}
          alt={car.title?.rendered}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div className="position-absolute top-0 start-0 m-3 px-3 py-1 fw-bold text-uppercase"
          style={{ backgroundColor: isNew ? '#FFD700' : '#000', color: isNew ? '#000' : '#FFF', fontSize: '0.7rem' }}>
          {isNew ? 'Nyhet' : 'Begagnad'}
        </div>
      </div>

      <div className="p-4 flex-grow-1 d-flex flex-column">
        <p className="small text-muted fw-bold text-uppercase mb-1">
          {meta._car_make} · {meta._car_year}
        </p>
        <h3 className="h5 fw-bold mb-2" dangerouslySetInnerHTML={{ __html: car.title?.rendered }} />
        <p className="small text-muted mb-4">
          {meta._car_mileage ? `${parseInt(meta._car_mileage).toLocaleString('sv-SE')} mil` : ''}
          {meta._car_fuel ? ` · ${meta._car_fuel}` : ''}
        </p>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="h5 fw-bold mb-0">{price}</span>
          <Link href={`/bilar/${folder}/${car.slug}`} className="btn btn-dark btn-sm px-4 py-2" style={{ borderRadius: '0' }}>
            VISA
          </Link>
        </div>
      </div>
    </motion.div>
  );
}