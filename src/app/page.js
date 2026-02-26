'use client';

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import GaragePreview from '../components/GaragePreview';

const brands = [
  "PILOTE", "BAVARIA", "HYMER", "LAIKA", "EURA MOBIL", 
  "DETHLEFFS", "BÜRSTNER", "CARADO", "RAPIDO", "MCLOUIS", 
  "KNAUS", "CHAUSSON", "PÖSSL", "LMC", "ADRIA"
];

export default function HomePage({ vehicles = [] }) {
  const wpBaseUrl = process.env.NEXT_PUBLIC_WP_API_URL?.replace('/wp-json/wp/v2', '') || 'https://www.ahlgrens.eu';

  return (
    <div className="home-page" style={{ backgroundColor: '#FFFFFF' }}>
      
      {/* 1. HERO SECTION */}
      <section 
        className="hero-section d-flex align-items-center"
        style={{
          minHeight: '80vh',
          background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('${wpBaseUrl}/wp-content/uploads/2026/02/Hero.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#FFFFFF',
        }}
      >
        <Container>
          <Row>
            <Col lg={7}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="display-2 fw-bold mb-4">Husbilar & Fritidsbilar<br/>i Borås</h1>
                <p className="lead fs-4 mb-5" style={{ opacity: 0.9 }}>
                  Handplockat urval av husbilar och fritidsfordon. 
                  Erfaren husbilshandlare med över 25 års branscherfarenhet.
                </p>
                <div className="d-flex gap-3">
                  <Link href="/bilar" className="btn btn-lg px-5 py-3 fw-bold" style={{ backgroundColor: '#FFD700', color: '#000', borderRadius: '0' }}>SE VÅRA BILAR</Link>
                  <Link href="/kontakt" className="btn btn-lg px-5 py-3 btn-outline-light fw-bold" style={{ borderRadius: '0' }}>KONTAKTA OSS</Link>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 2. BRAND TICKER */}
      <div style={{ backgroundColor: '#FFD700', padding: '20px 0', overflow: 'hidden', whiteSpace: 'nowrap', borderTop: '1px solid #000', borderBottom: '1px solid #000' }}>
        <motion.div 
          animate={{ x: [0, -2000] }} 
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ display: 'inline-block' }}
        >
          {[...brands, ...brands].map((brand, i) => (
            <span key={i} style={{ fontSize: '1.5rem', fontWeight: '900', color: '#000', margin: '0 40px', letterSpacing: '2px' }}>
              {brand} •
            </span>
          ))}
        </motion.div>
      </div>

      {/* 3. UTVALDA FORDON (ACTUAL DATA) */}
      <section className="py-5 mt-5">
        <Container>
          <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <h6 className="text-primary fw-bold text-uppercase" style={{ letterSpacing: '2px' }}>Premium Selection</h6>
              <h2 className="display-4 fw-bold">Utvalda Fordon</h2>
            </div>
            <Link href="/bilar" className="text-dark fw-bold text-decoration-none border-bottom border-2 border-dark pb-1">Se alla bilar</Link>
          </div>
          
          <Row className="g-4">
            {vehicles && vehicles.length > 0 ? (
              vehicles
                .sort((a, b) => new Date(b.date) - new Date(a.date)) // Latest first
                .slice(0, 3) // Only top 3
                .map((vehicle) => {
                  const meta = vehicle.meta || {};
                  const isNew = meta._car_is_new === 'yes';
                  const folder = isNew ? 'nytt' : 'begagnat';
                  // Use the helper field or fallback to featured media
                  const thumbnail = meta._car_thumbnail || vehicle._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/placeholder-car.jpg';
                  const price = meta._car_price
                    ? parseInt(meta._car_price).toLocaleString('sv-SE') + ' kr'
                    : 'Ring för pris';

                  return (
                    <Col lg={4} md={6} key={vehicle.id}>
                      <motion.div whileHover={{ y: -10 }} className="border-0 bg-light shadow-sm" style={{ transition: '0.3s', height: '100%' }}>
                        <div style={{ height: '250px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                          <img
                            src={thumbnail}
                            alt={vehicle.title?.rendered}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div className="position-absolute top-0 start-0 m-2 px-3 py-1 fw-bold text-uppercase"
                            style={{ backgroundColor: isNew ? '#FFD700' : '#000', color: isNew ? '#000' : '#FFF', fontSize: '0.7rem', zIndex: 2 }}>
                            {isNew ? 'Nyhet' : 'Begagnad'}
                          </div>
                        </div>

                        <div className="p-4">
                          <p className="text-muted small fw-bold text-uppercase mb-1" style={{ letterSpacing: '1px' }}>
                            {meta._car_make} · {meta._car_year}
                          </p>
                          <h3 className="h5 fw-bold mb-1" dangerouslySetInnerHTML={{ __html: vehicle.title?.rendered }} />
                          <p className="text-muted small mb-3">
                            {meta._car_mileage ? `${parseInt(meta._car_mileage).toLocaleString('sv-SE')} mil` : ''}
                            {meta._car_fuel ? ` · ${meta._car_fuel}` : ''}
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="h5 fw-bold mb-0">{price}</span>
                            <Link href={`/bilar/${folder}/${vehicle.slug}`} className="btn btn-dark btn-sm rounded-0 px-4 py-2 fw-bold">VISA</Link>
                          </div>
                        </div>
                      </motion.div>
                    </Col>
                  );
                })
            ) : (
              <Col className="text-center py-5">
                <p className="text-muted">Inga fordon hittades just nu.</p>
              </Col>
            )}
          </Row>
        </Container>
      </section>

      {/* 4. ABOUT US */}
      <section className="py-5" style={{ backgroundColor: '#F8F9FA' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={5} className="position-relative mb-5 mb-lg-0">
               <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '100%', height: '100%', border: '2px solid #FFD700', zIndex: 0 }} />
               <div className="bg-dark position-relative" style={{ minHeight: '500px', zIndex: 1 }}>
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
              <h2 className="display-4 fw-bold mb-4">Vår Historia</h2>
              <p className="lead mb-4">På Ahlgrens Automotive erbjuder vi ett noggrant utvalt sortiment av premium husbilar.</p>
              <div className="d-flex gap-4 mb-5">
                 <div><h3 className="fw-bold mb-0">25+</h3><p className="small text-muted">Års Erfarenhet</p></div>
                 <div className="border-start ps-4"><h3 className="fw-bold mb-0">3000+</h3><p className="small text-muted">Nöjda Kunder</p></div>
              </div>
              <Link href="/om-oss" className="btn btn-dark px-5 py-3 fw-bold rounded-0">LÄS MER</Link>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 5. GARAGE PREVIEW */}
      <GaragePreview />
      
      {/* 6. CONTACT FOOTER SECTION */}
      <section className="py-5" style={{ backgroundColor: '#000', color: '#fff' }}>
        <Container>
          <Row className="align-items-center py-5">
            <Col lg={6}>
              <h2 className="display-3 fw-bold mb-4">Redo för<br/>nästa äventyr?</h2>
              <p className="fs-5 text-muted mb-0">Vi finns här för personlig rådgivning och visning.</p>
            </Col>
            <Col lg={6} className="text-lg-end mt-4 mt-lg-0">
               <Link href="/kontakt" 
                 className="btn btn-lg px-5 py-4 fw-bold" 
                 style={{ backgroundColor: '#FFD700', color: '#000', borderRadius: '0', clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0% 100%)' }}>
                 KONTAKTA OSS IDAG
               </Link>
            </Col>
          </Row>
        </Container>
      </section>

    </div>
  );
}