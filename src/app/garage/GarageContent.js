'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const GarageContent = () => {
  const [activeZone, setActiveZone] = useState('entrance');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const wpBaseUrl = process.env.NEXT_PUBLIC_WP_API_URL?.replace('/wp-json/wp/v2', '') || '';

  // 1. Initialize Refs
  const entranceRef = useRef(null);
  const showroomRef = useRef(null);
  const workshopRef = useRef(null);
  const serviceRef = useRef(null);
  const officeRef = useRef(null);

  // 2. Showroom Images Data
  const showroomImages = useMemo(() => [
    `${wpBaseUrl}/wp-content/uploads/2026/garage/Showroom-1.jpeg`,
    `${wpBaseUrl}/wp-content/uploads/2026/garage/Showroom-2.jpeg`,
    `${wpBaseUrl}/wp-content/uploads/2026/garage/Showroom-3.jpeg`,
    `${wpBaseUrl}/wp-content/uploads/2026/garage/Showroom-4.jpeg`,
    `${wpBaseUrl}/wp-content/uploads/2026/garage/Showroom-5.jpeg`,
    `${wpBaseUrl}/wp-content/uploads/2026/garage/Showroom-6.jpeg`,
    `${wpBaseUrl}/wp-content/uploads/2026/garage/Showroom-7.jpeg`,
    `${wpBaseUrl}/wp-content/uploads/2026/garage/Showroom-8.jpeg`,
    `${wpBaseUrl}/wp-content/uploads/2026/garage/Showroom-9.jpeg`,
  ], [wpBaseUrl]);

  // 3. Define Zones Data (WITHOUT refs - fix ref access warning)
  const zonesData = useMemo(() => [
    {
      id: 'entrance',
      name: 'ENTRÉ',
      number: '01',
      isVideo: true,
      mediaUrl: `${wpBaseUrl}/wp-content/uploads/2026/02/Ahlgrens-Reception.mp4`,
      description: 'Välkommen till Ahlgrens Husbilar i Borås. Här möts du av en personlig atmosfär och professionell rådgivning.',
      features: ['Rymlig parkering', 'Handikappanpassad entré', 'Värmeisolerad anläggning']
    },
    {
      id: 'showroom',
      name: 'SHOWROOM',
      number: '02',
      isSlider: true,
      description: 'Moderna utrymmen med optimal belysning för att visa upp våra handplockade husbilar i sitt bästa ljus.',
      features: ['LED-belysning', 'Klimatkontrollerad miljö', '200 m² utställningsyta']
    },
    {
      id: 'workshop',
      name: 'VERKSTAD',
      number: '03',
      mediaUrl: `${wpBaseUrl}/wp-content/uploads/2026/garage/workshop-1.jpeg`,
      description: 'Vår fullt utrustade verkstad säkerställer att varje fordon lämnar oss i toppskick.',
      features: ['Modern diagnosutrustning', 'Specialverktyg', 'Godkända lyftanordningar']
    },
    {
      id: 'service',
      name: 'SERVICE',
      number: '04',
      mediaUrl: `${wpBaseUrl}/wp-content/uploads/2026/garage/workshop-2.jpeg`,
      description: 'Här utför vi allt från täthetskontroller till montering av extrautrustning och solceller.',
      features: ['Elarbetsplatser', 'Vattentestsystem', 'Komplett reservdelslager']
    },
    {
      id: 'office',
      name: 'KONTOR',
      number: '05',
      mediaUrl: `${wpBaseUrl}/wp-content/uploads/2026/02/Office.jpg`,
      description: 'I vårt bekväma mötesrum går vi igenom finansiering och avtal över en kopp kaffe.',
      features: ['Kostnadsfritt WiFi', 'Nybyggt pentry', 'Privat miljö']
    }
  ], [wpBaseUrl]);

  // Helper function to get ref by zone ID (only used in event handlers and effects)
  const getZoneRef = useCallback((zoneId) => {
    switch(zoneId) {
      case 'entrance': return entranceRef;
      case 'showroom': return showroomRef;
      case 'workshop': return workshopRef;
      case 'service': return serviceRef;
      case 'office': return officeRef;
      default: return null;
    }
  }, []);

  // 4. Auto-slider for Showroom
  useEffect(() => {
    let interval;
    if (activeZone === 'showroom') {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % showroomImages.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [activeZone, showroomImages.length]);

  // 5. Scroll Spy Logic (refs only accessed in effect - NOT during render)
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 2;
      zonesData.forEach((zone) => {
        const ref = getZoneRef(zone.id);
        const el = ref?.current;
        if (el) {
          const { offsetTop, offsetHeight } = el;
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActiveZone(zone.id);
          }
        }
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [zonesData, getZoneRef]);

  // Scroll handler (only used in event handlers)
  const scrollToZone = useCallback((zoneId) => {
    const ref = getZoneRef(zoneId);
    ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [getZoneRef]);

  // Zoom SVG Icon
  const ZoomIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 2H2V7M13 2H18V7M7 18H2V13M13 18H18V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#000' }}>
      
      {/* 1. MINI-MAP */}
      <div className="d-none d-xl-block" style={mapContainerStyle}>
        <div className="mb-4">
          <h6 className="fw-black mb-1" style={{ fontSize: '0.7rem', letterSpacing: '0.2em' }}>FACILITY MAP</h6>
          <div style={{ width: '30px', height: '2px', backgroundColor: '#FFD700' }} />
        </div>
        
        <svg width="100%" height="180" viewBox="0 0 200 150">
          <rect x="10" y="10" width="180" height="25" fill={activeZone === 'entrance' ? '#FFD700' : '#E2E8F0'} style={{ cursor: 'pointer', transition: '0.3s' }} onClick={() => scrollToZone('entrance')} />
          <rect x="10" y="40" width="85" height="40" fill={activeZone === 'showroom' ? '#FFD700' : '#E2E8F0'} style={{ cursor: 'pointer', transition: '0.3s' }} onClick={() => scrollToZone('showroom')} />
          <rect x="105" y="40" width="85" height="40" fill={activeZone === 'workshop' ? '#FFD700' : '#E2E8F0'} style={{ cursor: 'pointer', transition: '0.3s' }} onClick={() => scrollToZone('workshop')} />
          <rect x="10" y="85" width="120" height="30" fill={activeZone === 'service' ? '#FFD700' : '#E2E8F0'} style={{ cursor: 'pointer', transition: '0.3s' }} onClick={() => scrollToZone('service')} />
          <rect x="140" y="85" width="50" height="30" fill={activeZone === 'office' ? '#FFD700' : '#E2E8F0'} style={{ cursor: 'pointer', transition: '0.3s' }} onClick={() => scrollToZone('office')} />
        </svg>

        <div className="mt-4">
          {zonesData.map(z => (
            <div key={z.id} onClick={() => scrollToZone(z.id)}
              style={{ fontSize: '0.65rem', fontWeight: '800', color: activeZone === z.id ? '#000' : '#CBD5E1', cursor: 'pointer', marginBottom: '8px', transition: '0.2s' }}>
              {z.number} — {z.name}
            </div>
          ))}
        </div>
      </div>

      {/* 2. HERO SECTION */}
      <section className="py-5" style={{ backgroundColor: '#000', color: '#FFF', minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <Container>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h6 className="fw-bold text-uppercase mb-3" style={{ color: '#FFD700', letterSpacing: '0.3em' }}>Facility Tour</h6>
            <h1 className="display-1 fw-black mb-0" style={{ letterSpacing: '-0.04em' }}>VÅR ANLÄGGNING</h1>
            <div style={{ width: '100px', height: '4px', backgroundColor: '#FFD700', marginTop: '20px' }} />
          </motion.div>
        </Container>
      </section>

      {/* 3. ZONE SECTIONS */}
      {zonesData.map((zone, idx) => (
        <section key={zone.id} ref={getZoneRef(zone.id)} className="py-5" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', borderBottom: '1px solid #F1F5F9' }}>
          <Container>
            <Row className={`align-items-center ${idx % 2 !== 0 ? 'flex-row-reverse' : ''}`}>
              <Col lg={5}>
                <div className="mb-4">
                  <span className="display-4 fw-black" style={{ color: '#E2E8F0', WebkitTextStroke: '1px #CBD5E1', WebkitTextFillColor: 'transparent' }}>{zone.number}</span>
                  <h2 className="display-3 fw-black mb-4" style={{ marginTop: '-30px' }}>{zone.name}</h2>
                </div>
                <p className="lead fw-medium mb-5" style={{ color: '#475569', lineHeight: '1.8' }}>{zone.description}</p>
                
                <div className="ps-4 border-start border-4 border-warning">
                  <h4 className="h6 fw-black text-uppercase mb-3" style={{ letterSpacing: '0.1em' }}>Key Details</h4>
                  <ul className="list-unstyled">
                    {zone.features.map((feature, i) => (
                      <li key={i} className="mb-2 fw-bold" style={{ fontSize: '0.9rem' }}>
                        <span style={{ color: '#FFD700', marginRight: '10px' }}>/</span> {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
              
              <Col lg={6} className={idx % 2 !== 0 ? 'me-lg-auto' : 'ms-lg-auto'}>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="position-relative">
                  <div style={{ position: 'absolute', top: '-20px', left: idx % 2 === 0 ? '-20px' : '20px', width: '100%', height: '100%', border: '1px solid #000', zIndex: 0 }} />
                  
                  <div style={{ height: '500px', backgroundColor: '#F1F5F9', zIndex: 1, position: 'relative', overflow: 'hidden' }}>
                    
                    {/* Media Rendering Logic - FIXED: Use <img> not <Image> */}
                    {zone.isSlider ? (
                      <>
                        <AnimatePresence mode="wait">
                          <motion.img 
                            key={currentSlide}
                            src={showroomImages[currentSlide]}
                            alt={`Showroom ${currentSlide + 1}`}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                          />
                        </AnimatePresence>
                        {/* Slide Indicators */}
                        <div style={{ position: 'absolute', bottom: '20px', left: '20px', display: 'flex', gap: '8px', zIndex: 10 }}>
                          {showroomImages.map((_, i) => (
                            <div key={i} style={{ width: i === currentSlide ? '30px' : '8px', height: '8px', backgroundColor: i === currentSlide ? '#FFD700' : '#FFF', transition: '0.4s', borderRadius: '4px' }} />
                          ))}
                        </div>
                      </>
                    ) : zone.isVideo ? (
                      <video autoPlay muted loop playsInline style={{ objectFit: 'cover', width: '100%', height: '100%' }}>
                        <source src={zone.mediaUrl} type="video/mp4" />
                      </video>
                    ) : (
                      <img src={zone.mediaUrl} alt={zone.name} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                    )}

                    {/* ZOOM BUTTON */}
                    <motion.div 
                      whileHover={{ scale: 1.1, backgroundColor: '#FFD700', color: '#000' }}
                      onClick={() => setShowLightbox(true)}
                      style={{
                        position: 'absolute', top: '20px', right: '20px', zIndex: 10,
                        width: '45px', height: '45px', backgroundColor: 'rgba(0,0,0,0.8)',
                        color: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: '0.3s'
                      }}
                    >
                      <ZoomIcon />
                    </motion.div>
                  </div>
                </motion.div>
              </Col>
            </Row>
          </Container>
        </section>
      ))}

      {/* LIGHTBOX MODAL - FIXED: Use <img> not <Image> */}
      <Modal show={showLightbox} onHide={() => setShowLightbox(false)} centered size="xl" contentClassName="bg-transparent border-0">
        <Modal.Body className="p-0 position-relative">
          <button onClick={() => setShowLightbox(false)} style={{ position: 'absolute', top: '-40px', right: '0', background: 'none', border: 'none', color: '#FFF', fontSize: '2rem' }}>×</button>
          {activeZone === 'entrance' ? (
             <video autoPlay muted loop controls style={{ width: '100%', height: 'auto' }}>
               <source src={zonesData[0].mediaUrl} type="video/mp4" />
             </video>
          ) : (
            <img 
              src={activeZone === 'showroom' ? showroomImages[currentSlide] : zonesData.find(z => z.id === activeZone)?.mediaUrl} 
              style={{ width: '100%', height: 'auto', maxHeight: '90vh', objectFit: 'contain' }} 
              alt="Fullscreen View"
            />
          )}
        </Modal.Body>
      </Modal>

      {/* FOOTER CTA */}
      <section className="py-5" style={{ backgroundColor: '#FFD700' }}>
        <Container className="py-5">
          <Row className="align-items-center">
            <Col lg={8}>
              <h2 className="display-4 fw-black mb-0">VILL DU SE DET I VERKLIGHETEN?</h2>
            </Col>
            <Col lg={4} className="text-lg-end mt-4 mt-lg-0">
              <Link href="/kontakt" className="btn btn-dark btn-lg px-5 py-3 fw-bold rounded-0" style={{ letterSpacing: '0.2em', clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0% 100%)' }}>
                BOKA VISNING
              </Link>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

const mapContainerStyle = {
  position: 'fixed',
  top: '150px',
  right: '40px',
  width: '200px',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  padding: '2rem 1.5rem',
  zIndex: 1000,
  borderLeft: '4px solid #000'
};

export default GarageContent;