'use client';

import { useState, useEffect, useRef } from 'react';
import '@/styles/custom.scss';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import PageHero from '@/components/PageHero';
import { siteConfig } from '@/config/site-config';

const REASONS = [
  {
    number: '01',
    title: 'LOKALT I BORÅS',
    desc: 'Vi finns i Borås och känner den lokala marknaden. Kom förbi och träffa oss personligen.',
  },
  {
    number: '02',
    title: 'BRETT SORTIMENT',
    desc: 'Husbilar och husvagnar från Europas ledande märken — nya och begagnade.',
  },
  {
    number: '03',
    title: 'PERSONLIG SERVICE',
    desc: 'Ingen säljpressning. Vi hjälper dig hitta rätt fordon för just ditt äventyr.',
  },
];

const LOCAL_AREAS = [
  'Borås', 'Göteborg', 'Alingsås', 'Ulricehamn',
  'Skene', 'Kinna', 'Tranemo', 'Fristad',
];

// ── Lazy map — exact same pattern as Footer ────────────────────
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
    <div ref={ref} className="boras-map-cta__map-wrap">
      {visible && (
        <iframe
          src={src}
          width="100%"
          height="360"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`${siteConfig.brand.name} — hitta till oss i Borås`}
        />
      )}
    </div>
  );
}

// ── Vehicle card ───────────────────────────────────────────────
function VehicleCard({ car }) {
  const meta  = car.meta || {};
  const isNew = meta._car_is_new === 'yes';
  const slug  = car.slug;
  const href  = isNew ? `/nytt/${slug}/` : `/begagnade/${slug}/`;
  const image = meta._car_main_image || null;
  const make  = meta._car_make || '';
  const model = meta._car_model || '';
  const year  = meta._car_year || '';
  const price = meta._car_price
    ? parseInt(meta._car_price).toLocaleString('sv-SE') + ' kr'
    : 'Kontakta oss';

  return (
    <Col lg={4} md={6} className="mb-4">
      <motion.div
        className="boras-vehicle-card"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <Link href={href} className="boras-vehicle-card__link">
          <div className="boras-vehicle-card__image-wrap">
            {image ? (
              <Image
                src={image}
                alt={`${make} ${model}`}
                fill
                style={{ objectFit: 'cover' }}
                unoptimized
              />
            ) : (
              <div className="boras-vehicle-card__no-image" />
            )}
            <span className={`boras-vehicle-card__badge ${isNew ? 'badge--new' : 'badge--used'}`}>
              {isNew ? 'NY' : 'BEGAGNAD'}
            </span>
          </div>
          <div className="boras-vehicle-card__body">
            <p className="boras-vehicle-card__year">{year}</p>
            <h3 className="boras-vehicle-card__title">{make} {model}</h3>
            <p className="boras-vehicle-card__price">{price}</p>
          </div>
        </Link>
      </motion.div>
    </Col>
  );
}

// ── Main component ─────────────────────────────────────────────
export default function BorasContent({ cars }) {
  const husbilar  = cars.filter(c => c.meta?._car_vehicle_type !== 'Husvagn');
  const husvagnar = cars.filter(c => c.meta?._car_vehicle_type === 'Husvagn');
  const mapsQuery = encodeURIComponent(siteConfig.contact.address);

  return (
    <div className="boras-page">

      {/* ── 1. Hero ── */}
      <PageHero
        eyebrow="BORÅS & VÄSTSVERIGE"
        title="HUSBILAR &"
        titleAccent="HUSVAGNAR"
        subtitle="Din lokala återförsäljare i Borås. Vi hjälper dig hitta rätt husbil eller husvagn — oavsett om du drömmer om veckoslutsäventyr eller längre resor."
      />

      {/* ── 2. Why us ── */}
      <section className="boras-reasons">
        <Container className="py-5">
          <div className="boras-section-heading">
            <h2 className="boras-section-heading__title">VARFÖR AHLGRENS I BORÅS</h2>
            <div className="boras-section-heading__rule" />
          </div>
          <Row className="g-4 mt-2">
            {REASONS.map((r, i) => (
              <Col md={4} key={i}>
                <motion.div
                  className="boras-reason-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className="boras-reason-card__number">{r.number}</span>
                  <h3 className="boras-reason-card__title">{r.title}</h3>
                  <p className="boras-reason-card__desc">{r.desc}</p>
                  <div className="boras-reason-card__rule" />
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── 3. Husbilar ── */}
      {husbilar.length > 0 && (
        <section className="boras-vehicles boras-vehicles--husbilar">
          <Container className="py-5">
            <div className="boras-section-heading">
              <h2 className="boras-section-heading__title">HUSBILAR I LAGER</h2>
              <div className="boras-section-heading__rule" />
              <p className="boras-section-heading__sub">
                {husbilar.length} husbilar tillgängliga i Borås
              </p>
            </div>
            <Row className="mt-4">
              {husbilar.slice(0, 6).map(car => (
                <VehicleCard key={car.id} car={car} />
              ))}
            </Row>
            {husbilar.length > 6 && (
              <div className="text-center mt-3">
                <Link href="/bilar/" className="btn-outline-dark-custom">
                  SE ALLA {husbilar.length} HUSBILAR
                </Link>
              </div>
            )}
          </Container>
        </section>
      )}

      {/* ── 4. Husvagnar ── */}
      {husvagnar.length > 0 && (
        <section className="boras-vehicles boras-vehicles--husvagnar">
          <Container className="py-5">
            <div className="boras-section-heading">
              <h2 className="boras-section-heading__title">HUSVAGNAR I LAGER</h2>
              <div className="boras-section-heading__rule" />
              <p className="boras-section-heading__sub">
                {husvagnar.length} husvagnar tillgängliga i Borås
              </p>
            </div>
            <Row className="mt-4">
              {husvagnar.slice(0, 6).map(car => (
                <VehicleCard key={car.id} car={car} />
              ))}
            </Row>
            {husvagnar.length > 6 && (
              <div className="text-center mt-3">
                <Link href="/bilar/" className="btn-outline-dark-custom">
                  SE ALLA {husvagnar.length} HUSVAGNAR
                </Link>
              </div>
            )}
          </Container>
        </section>
      )}

      {/* ── 5. Local areas ── */}
      <section className="boras-areas">
        <Container className="py-5">
          <div className="boras-section-heading">
            <h2 className="boras-section-heading__title">VI BETJÄNAR HELA REGIONEN</h2>
            <div className="boras-section-heading__rule" />
          </div>
          <div className="boras-areas__grid mt-4">
            {LOCAL_AREAS.map((area, i) => (
              <motion.span
                key={i}
                className="boras-areas__tag"
                whileHover={{ backgroundColor: 'var(--yellow)' }}
                transition={{ duration: 0.15 }}
              >
                {area}
              </motion.span>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 6. Map + CTA ── */}
      <section className="boras-map-cta">
        <Container className="py-5">
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <p className="boras-map-cta__eyebrow">HITTA HIT</p>
              <h2 className="boras-map-cta__title">
                BESÖK OSS I <span className="text-accent">BORÅS</span>
              </h2>
              <p className="boras-map-cta__desc">
                Vi tar emot besök på vår anläggning i Borås. Boka ett möte eller kom förbi
                så visar vi dig vad vi har i lager just nu.
              </p>
              <div className="hero-actions">
                <Link href="/kontakt/" className="hero-btn hero-btn--primary">
                  KONTAKTA OSS
                </Link>
                <Link href="/bilar/" className="hero-btn hero-btn--outline-dark">
                  SE ALLA FORDON
                </Link>
              </div>
            </Col>
            <Col lg={6}>
              <LazyMap query={mapsQuery} />
            </Col>
          </Row>
        </Container>
      </section>

    </div>
  );
}