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
    /* Fix 1: overflow-x hidden on the body level via style to stop Safari horizontal "wiggle" */
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
          /* Fix 2: Safari hates 'fixed' backgrounds on mobile. We use 'scroll' or omit for stability */
          background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('${wpBaseUrl}/wp-content/uploads/2026/02/Hero.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
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
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                  <Link href="/bilar" className="btn btn-lg fw-bold"
                    style={{ backgroundColor: '#FFD700', color: '#000', borderRadius: '0', padding: '15px 35px', fontSize: '1rem' }}>
                    SE VÅRA BILAR
                  </Link>
                  <Link href="/kontakt" className="btn btn-lg btn-outline-light fw-bold"
                    style={{ borderRadius: '0', padding: '15px 35px', fontSize: '1rem' }}>
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
        width: '100%',
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
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '3rem',
            flexWrap: 'wrap',
            gap: '15px'
          }}>
            <div>
              <h6 className="text-primary fw-bold text-uppercase" style={{ letterSpacing: '2px', fontSize: '0.8rem' }}>
                Premium Selection
              </h6>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, margin: 0 }}>
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

                {/* Dot + Arrow Navigation */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '30px',
                  gap: '20px'
                }}>
                  <button
                    onClick={() => setActiveIndex((i) => Math.max(i - 1, 0))}
                    disabled={activeIndex === 0}
                    className="carousel-nav-btn"
                  >
                    ←
                  </button>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {featuredCars.map((_, i) => (
                      <div
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        style={{
                          width: activeIndex === i ? '25px' : '8px',
                          height: '8px',
                          borderRadius: '4px',
                          backgroundColor: activeIndex === i ? '#000' : '#ccc',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setActiveIndex((i) => Math.min(i + 1, featuredCars.length - 1))}
                    disabled={activeIndex === featuredCars.length - 1}
                    className="carousel-nav-btn"
                  >
                    →
                  </button>
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
      <section style={{ padding: '80px 0', backgroundColor: '#F8F9FA' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={5} className="position-relative mb-5 mb-lg-0">
              <div style={{
                position: 'absolute',
                top: '-15px',
                left: '-15px',
                width: '100%',
                height: '100%',
                border: '2px solid #FFD700',
                zIndex: 0
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
            <Col lg={6} className="offset-lg-1 mt-4 mt-lg-0">
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, marginBottom: '1.5rem' }}>
                Vår Historia
              </h2>
              <p className="lead mb-4" style={{ fontSize: '1.1rem', color: '#444' }}>
                På Ahlgrens Automotive erbjuder vi ett noggrant utvalt sortiment av premium husbilar
                från Europas mest ansedda tillverkare.
              </p>
              <div style={{ display: 'flex', gap: '40px', marginBottom: '2.5rem' }}>
                <div>
                  <h3 className="fw-bold mb-0">25+</h3>
                  <p className="small text-muted">Års Erfarenhet</p>
                </div>
                <div style={{ borderLeft: '1px solid #dee2e6', paddingLeft: '40px' }}>
                  <h3 className="fw-bold mb-0">3000+</h3>
                  <p className="small text-muted">Nöjda Kunder</p>
                </div>
              </div>
              <Link href="/om-oss" className="btn btn-dark fw-bold"
                style={{ borderRadius: '0', letterSpacing: '2px', padding: '15px 45px' }}>
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
              <h2 style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', fontWeight: 900, marginBottom: '1rem' }}>
                Redo för nästa äventyr?
              </h2>
              <p className="fs-5 text-muted mb-0">Vi finns här för personlig rådgivning och visning.</p>
            </Col>
            <Col lg={6} className="mt-5 mt-lg-0 text-lg-end">
              <Link
                href="/kontakt"
                className="btn btn-lg fw-bold contact-btn-safari"
                style={{
                  backgroundColor: '#FFD700',
                  color: '#000',
                  borderRadius: '0',
                  padding: '18px 45px',
                  display: 'inline-block',
                  fontSize: '1.1rem'
                }}
              >
                KONTAKTA OSS IDAG
              </Link>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Safari Specific Overrides */}
      <style jsx global>{`
        /* Fix for Safari scroll bounce and jitter */
        html, body {
            max-width: 100%;
            overflow-x: hidden !important;
            -webkit-overflow-scrolling: touch;
        }

        .carousel-nav-btn {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            border: 1px solid #000;
            background-color: transparent;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }

        .carousel-nav-btn:disabled {
            opacity: 0.2;
            cursor: not-allowed;
        }

        /* Better Button Tap handling for iOS */
        .btn {
            -webkit-tap-highlight-color: transparent;
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
      style={{
        backgroundColor: '#f8f9fa',
        overflow: 'hidden',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ height: '240px', width: '100%', overflow: 'hidden', position: 'relative' }}>
        <img
          src={thumbnail}
          alt={car.title?.rendered}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          top: '15px',
          left: '15px',
          backgroundColor: isNew ? '#FFD700' : '#000',
          color: isNew ? '#000' : '#FFF',
          fontSize: '0.7rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          padding: '5px 12px',
          zIndex: 2
        }}>
          {isNew ? 'Nyhet' : 'Begagnad'}
        </div>
      </div>

      <div style={{ padding: '25px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#666', marginBottom: '8px' }}>
          {meta._car_make} · {meta._car_year}
        </p>
        <h3
          style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '10px', lineHeight: '1.3' }}
          dangerouslySetInnerHTML={{ __html: car.title?.rendered }}
        />
        <p style={{ fontSize: '0.9rem', color: '#777', marginBottom: '20px' }}>
          {meta._car_mileage ? `${parseInt(meta._car_mileage).toLocaleString('sv-SE')} mil` : ''}
          {meta._car_fuel ? ` · ${meta._car_fuel}` : ''}
        </p>
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 900 }}>{price}</span>
          <Link
            href={`/bilar/${folder}/${car.slug}`}
            className="btn btn-dark fw-bold"
            style={{ borderRadius: '0', padding: '10px 25px', fontSize: '0.85rem' }}
          >
            VISA
          </Link>
        </div>
      </div>
    </motion.div>
  );
}