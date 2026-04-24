'use client';

import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { siteConfig } from '@/config/site-config';

function LazyMap({ query }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const src = apiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${query}`
    : `https://maps.google.com/maps?q=${query}&output=embed`;

  return (
    <div ref={ref} className="map-wrapper">
      {visible && (
        <iframe
          src={src}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`${siteConfig.brand.name} — hitta till oss`}
        />
      )}
    </div>
  );
}

const NAV_LINKS = [
  { name: 'Hem',        href: '/' },
  { name: 'Våra Bilar', href: '/bilar' },
  { name: 'Om Oss',     href: '/om-oss' },
  { name: 'Kontakt',    href: '/kontakt' },
];

const SERVICES = [
  'Försäljning av begagnade bilar',
  'Inbyte av din nuvarande bil',
  'Eftermarknadstjänster',
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { brand, contact, links } = siteConfig;
  const mapsQuery = encodeURIComponent(contact.address);
  const mapsLink  = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <footer className="site-footer">
      <Container>

        <Row className="g-5">

          <Col lg={4} md={6}>
            <p className="footer-brand">
              AHLGRENS<br />
              <span className="text-accent">HUSBILAR</span>
            </p>
            <p className="text-muted-sm" style={{ maxWidth: '300px' }}>
              {brand.slogan}
            </p>
            <div className="cluster mt-3">
              <a href={links.facebook} aria-label="Facebook" className="icon-link" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-facebook" aria-hidden="true" />
              </a>
              <a href={links.instagram} aria-label="Instagram" className="icon-link" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-instagram" aria-hidden="true" />
              </a>
            </div>
          </Col>

          <Col lg={2} md={6}>
            <h6 className="section-label">Snabblänkar</h6>
            <nav aria-label="Sidfotslänkar">
              <ul className="stack">
                {NAV_LINKS.map(({ name, href }) => (
                  <li key={name}>
                    <Link href={href} className="link-subtle">
                      <motion.span
                        style={{ display: 'inline-block' }}
                        whileHover={{ x: 7 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      >
                        {name}
                      </motion.span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </Col>

          <Col lg={3} md={6}>
            <h6 className="section-label">Våra Tjänster</h6>
            <ul className="stack text-muted-sm">
              {SERVICES.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </Col>

          <Col lg={3} md={6}>
            <h6 className="section-label">Kontakta Oss</h6>
            <address className="footer-address text-muted-sm mb-3">
              {brand.name}<br />
              {contact.address}
            </address>
            <div className="stack">
              <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="link-accent">
                {contact.phone}
              </a>
              <a href={`mailto:${contact.email}`} className="link-subtle">
                {contact.email}
              </a>
            </div>
          </Col>
        </Row>

        <hr className="divider" />

        <Row className="mt-5">
          <Col>
            <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="link-accent d-inline-block mb-3">
              Hitta till oss — öppna i Google Maps ↗
            </a>
            <LazyMap query={mapsQuery} />
          </Col>
        </Row>

        <hr className="divider" />

        <Row className="align-items-center">
          <Col md={6}>
            <p className="footer-copyright">
              © {currentYear} {brand.name.toUpperCase()}. ALLA RÄTTIGHETER FÖRBEHÅLLNA.
              <Link href="/integritetspolicy" className="link-subtle ms-3">Privacy</Link>
            </p>
          </Col>
          <Col md={6} className="text-md-end mt-3 mt-md-0">
            <div className="footer-dev-credit">
              <span className="footer-dev-label">Developed by</span>
              <motion.a
                href="https://www.amicodes.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-dev-link"
                whileHover={{ scale: 1.05, filter: `drop-shadow(0 0 5px ${siteConfig.theme.yellow})` }}
                transition={{ duration: 0.2 }}
              >
                <svg viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg" height="1.2em" fill="none" aria-label="Amina">
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