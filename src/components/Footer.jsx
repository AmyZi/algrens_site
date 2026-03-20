'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  const [mounted, setMounted] = useState(false);
  const brandGold = '#FFD700';
  const mutedText = '#888888';
  const location = "Gånghestersvägen 129, 507 62 Borås";

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentYear = new Date().getFullYear();

  // Map URL Configuration
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(location)}`;

  const linkVariants = {
    initial: { x: 0, color: mutedText },
    hover: { x: 7, color: brandGold }
  };

  const navLinks = [
    { name: 'Hem', href: '/' },
    { name: 'Våra Bilar', href: '/bilar' },
    { name: 'Om Oss', href: '/om-oss' },
    { name: 'Kontakt', href: '/kontakt' }
  ];

  if (!mounted) return null;

  return (
    <footer style={{ backgroundColor: '#000', color: '#FFF', padding: '80px 0 40px', marginTop: 'auto' }}>
      <Container>
        <Row className="g-5">
          {/* 1. Company Info & Socials */}
          <Col lg={4} md={6}>
            <motion.h5 
              initial={{ opacity: 0 }} 
              whileInView={{ opacity: 1 }}
              className="fw-black mb-4" 
              style={{ letterSpacing: '-0.02em', fontSize: '1.5rem', fontWeight: 900 }}
            >
              AHLGRENS<br />
              <span style={{ color: brandGold }}>HUSBILAR</span>
            </motion.h5>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.8', color: mutedText, maxWidth: '300px' }}>
              Din pålitliga partner för begagnade bilar av hög kvalitet. 
            </p>
            <div className="d-flex gap-3 mt-4">
              <motion.a whileHover={{ y: -3, color: brandGold }} href="#" style={{ color: '#FFF', fontSize: '1.2rem' }}><i className="bi bi-facebook"></i></motion.a>
              <motion.a whileHover={{ y: -3, color: brandGold }} href="#" style={{ color: '#FFF', fontSize: '1.2rem' }}><i className="bi bi-instagram"></i></motion.a>
            </div>
          </Col>

          {/* 2. Snabblänkar */}
          <Col lg={2} md={6}>
            <h6 className="fw-bold text-uppercase mb-4" style={{ fontSize: '0.75rem', letterSpacing: '0.2em' }}>Snabblänkar</h6>
            <div className="d-flex flex-column gap-2">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} style={{ textDecoration: 'none' }}>
                  <motion.span variants={linkVariants} initial="initial" whileHover="hover" style={{ display: 'inline-block', fontSize: '0.9rem' }}>
                    {link.name}
                  </motion.span>
                </Link>
              ))}
            </div>
          </Col>

          {/* 3. Våra Tjänster */}
          <Col lg={3} md={6}>
            <h6 className="fw-bold text-uppercase mb-4" style={{ fontSize: '0.75rem', letterSpacing: '0.2em' }}>Våra Tjänster</h6>
            <ul className="list-unstyled" style={{ fontSize: '0.9rem', color: mutedText }}>
              <li className="mb-2">Försäljning av begagnade bilar</li>
              <li className="mb-2">Inbyte av din nuvarande bil</li>
              <li className="mb-2">Eftermarknadstjänster</li>
            </ul>
          </Col>

          {/* 4. Contact Info */}
          <Col lg={3} md={6}>
            <h6 className="fw-bold text-uppercase mb-4" style={{ fontSize: '0.75rem', letterSpacing: '0.2em' }}>Kontakta Oss</h6>
            <div style={{ fontSize: '0.9rem', color: mutedText }}>
              <address style={{ fontStyle: 'normal', lineHeight: '1.6' }}>
                AHLGRENS HUSBILAR<br />
                Gånghestersvägen 129<br />
                507 62 Borås
              </address>
              <div className="mt-4 d-flex flex-column gap-2">
                <a href="tel:+4633103011" style={{ color: brandGold, textDecoration: 'none', fontWeight: 'bold' }}>+46 33 1030 11</a>
                <a href="mailto:jonas@ahlgrens.eu" style={{ color: '#FFF', textDecoration: 'none' }}>jonas@ahlgrens.eu</a>
              </div>
            </div>
          </Col>
        </Row>

        {/* MAP SECTION */}
        <Row className="mt-5">
          <Col xs={12}>
            <div className="mb-3">
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: brandGold, textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}
              >
                Hitta till oss (Klicka här för att gå till Google Maps)
              </a>
            </div>
            <div className="rounded-4 overflow-hidden shadow-lg border border-secondary" style={{ height: '400px' }}>
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Office Location"
              />
            </div>
          </Col>
        </Row>

        <hr style={{ borderColor: '#222', margin: '60px 0 30px', opacity: 1 }} />

        {/* BOTTOM BAR WITH UNDERLINE */}
        <Row className="align-items-center">
          <Col md={6}>
            <p style={{ fontSize: '0.75rem', color: '#555', margin: 0 }}>
              © {currentYear} AHLGRENS HUSBILAR. ALLA RÄTTIGHETER FÖRBEHÅLLNA.
              <Link href="/integritetspolicy" className="ms-3 text-decoration-none" style={{ color: '#555' }}>Privacy</Link>
            </p>
          </Col>
          <Col md={6} className="text-md-end mt-3 mt-md-0">
            <div className="d-inline-flex align-items-center">
              <span style={{ fontSize: '0.7rem', color: '#444', marginRight: '15px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                Developed by
              </span>
              <motion.a 
                href="https://www.amicodes.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ opacity: 1, scale: 1.05, filter: `drop-shadow(0 0 5px ${brandGold})` }}
                style={{ opacity: 0.6, transition: '0.3s' }}
              >
                <svg viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg" height="1.2em" fill="none">
                  <text x="50%" y="80" textAnchor="middle" fontSize="70" fontFamily="Brush Script MT, Pacifico, cursive" fill="#e53935">Amina</text>
                  <path d="M170 18 C170 8, 185 8, 185 18 C185 8, 200 8, 200 18 C200 30, 185 38, 185 38 C185 38, 170 30, 170 18 Z" fill="#1e40af" />
                </svg>
              </motion.a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}