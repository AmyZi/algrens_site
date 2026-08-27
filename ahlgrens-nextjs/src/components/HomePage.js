'use client';

import React, { useRef, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
import GaragePreview from './GaragePreview';

const BRANDS = [
  "PILOTE", "BAVARIA", "HYMER", "LAIKA", "EURA MOBIL",
  "DETHLEFFS", "BÜRSTNER", "CARADO", "RAPIDO", "MCLOUIS",
  "KNAUS", "CHAUSSON", "PÖSSL", "LMC", "ADRIA"
];

const WP_BASE = 'https://www.ahlgrens.eu';

function getImages(meta) {
  const gallery = meta._car_gallery_urls;
  if (gallery) {
    const urls = gallery.split(',').map(u => u.trim()).filter(Boolean);
    if (urls.length > 0) return urls;
  }
  return [meta._car_thumbnail || '/placeholder-car.jpg'];
}

function HomeCarCard({ car }) {
  const meta   = car.meta || {};
  const isNew  = meta._car_is_new === 'yes';
  const folder = isNew ? 'nytt' : 'begagnat';
  const images = getImages(meta);
  const price  = meta._car_price
    ? `${parseInt(meta._car_price).toLocaleString('sv-SE')} kr`
    : 'Ring för pris';

  return (
    <motion.div className="hcard" whileHover={{ y: -6 }} transition={{ duration: 0.2 }}>
      <div className="hcard__image-wrap">
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true, type: 'bullets' }}
          autoplay={images.length > 1 ? { delay: 3500, disableOnInteraction: false } : false}
          loop={images.length > 1}
          grabCursor
          speed={500}
          className="hcard__swiper"
        >
          {images.map((src, i) => (
            <SwiperSlide key={i}>
              <img
                src={src}
                alt={i === 0 ? (car.title?.rendered ?? 'Fordon') : ''}
                className="hcard__image"
                loading={i === 0 ? 'eager' : 'lazy'}
                onError={e => { e.target.src = '/placeholder-car.jpg'; }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        {/* Badge is sibling to Swiper, both inside hcard__image-wrap (position: relative) */}
        <span className={`hcard__badge${isNew ? ' hcard__badge--new' : ' hcard__badge--used'}`}>
          {isNew ? 'NYHET' : 'BEGAGNAD'}
        </span>
      </div>
      <Link href={`/bilar/${folder}/${car.slug}/`} className="hcard__body-link">
        <div className="hcard__body">
          <p className="hcard__meta">{meta._car_make} · {meta._car_year}</p>
          <h3 className="hcard__title" dangerouslySetInnerHTML={{ __html: car.title?.rendered }} />
          <p className="hcard__specs">
            {meta._car_mileage ? `${parseInt(meta._car_mileage).toLocaleString('sv-SE')} mil` : ''}
            {meta._car_fuel    ? ` · ${meta._car_fuel}` : ''}
          </p>
          <div className="hcard__footer">
            <span className="hcard__price">{price}</span>
            <span className="hcard__cta">VISA</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function HomePage({ cars = [] }) {
  const desktopSwiperRef = useRef(null);
  const mobileSwiperRef  = useRef(null);
  const [mobileIndex, setMobileIndex] = useState(0);

  const featuredCars = [...cars]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  return (
    <div className="home-page">

      {/* ── 1. HERO ── */}
      <section
        className="hero-section"
        style={{
          background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('${WP_BASE}/wp-content/uploads/2026/02/Hero.jpeg') center/cover no-repeat`,
        }}
      >
        <Container>
          <Row>
            <Col lg={7}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                <h1 className="hero-title">Husbilar & Fritidsbilar<br />i Borås</h1>
                <p className="hero-subtitle">
                  Handplockat urval av husbilar och fritidsfordon.
                  Erfaren husbilshandlare med över 25 års branscherfarenhet.
                </p>
                <div className="hero-actions">
                  <Link href="/bilar" className="hero-btn hero-btn--primary">SE VÅRA BILAR</Link>
                  <Link href="/kontakt" className="hero-btn hero-btn--outline">KONTAKTA OSS</Link>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── 2. BRAND TICKER ── */}
      <div className="brand-ticker">
        <motion.div
          className="brand-ticker__track"
          animate={{ x: [0, -2000] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          {[...BRANDS, ...BRANDS].map((brand, i) => (
            <span key={i} className="brand-ticker__item">{brand} •</span>
          ))}
        </motion.div>
      </div>

      {/* ── 3. UTVALDA FORDON ── */}
      <section className="featured-section">
        <Container>
          <div className="featured-header">
            <div>
              <h6 className="featured-eyebrow">Premium Selection</h6>
              <h2 className="featured-title">Utvalda Fordon</h2>
            </div>
            <Link href="/bilar" className="featured-link">Se alla bilar</Link>
          </div>

          {featuredCars.length > 0 ? (
            <>
              {/* ── DESKTOP: Arrow-nav Swiper, 3 visible, arrows scroll more ── */}
              <div className="featured-desktop">
                <div className="featured-slider-container">
                  <button
                    className="feat-side-btn feat-side-btn--prev"
                    aria-label="Föregående bil"
                    onClick={() => desktopSwiperRef.current?.slidePrev()}
                  >&#10216;</button>
                  <button
                    className="feat-side-btn feat-side-btn--next"
                    aria-label="Nästa bil"
                    onClick={() => desktopSwiperRef.current?.slideNext()}
                  >&#10217;</button>

                  <Swiper
                    modules={[Pagination]}
                    onSwiper={swiper => { desktopSwiperRef.current = swiper; }}
                    slidesPerView={3}
                    spaceBetween={24}
                    grabCursor
                    loop
                    pagination={{ clickable: true, type: 'bullets' }}
                    breakpoints={{
                      768:  { slidesPerView: 2, spaceBetween: 20 },
                      1024: { slidesPerView: 3, spaceBetween: 24 },
                    }}
                    className="featured-desktop__swiper"
                  >
                    {featuredCars.map(car => (
                      <SwiperSlide key={car.id}>
                        <HomeCarCard car={car} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>

              {/* ── MOBILE: Coverflow carousel ── */}
              <div className="featured-mobile">
                {/* Swiper — no built-in pagination; dots rendered manually below */}
                <div className="featured-mobile__swiper-clip">
                  <Swiper
                    modules={[EffectCoverflow]}
                    onSwiper={swiper => {
                      mobileSwiperRef.current = swiper;
                      setMobileIndex(swiper.realIndex);
                    }}
                    onSlideChange={swiper => setMobileIndex(swiper.realIndex)}
                    effect="coverflow"
                    coverflowEffect={{ rotate: 15, stretch: 0, depth: 100, modifier: 1, slideShadows: false }}
                    centeredSlides
                    grabCursor
                    slidesPerView={1.2}
                    spaceBetween={16}
                    loop={featuredCars.length > 2}
                  >
                    {featuredCars.map(car => (
                      <SwiperSlide key={car.id}>
                        <HomeCarCard car={car} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                {/* Manual pagination dots — outside Swiper, above the link */}
                <div className="featured-mobile__pagination">
                  {featuredCars.map((_, i) => (
                    <button
                      key={i}
                      className={`mobile-dot${i === mobileIndex ? ' mobile-dot--active' : ''}`}
                      aria-label={`Gå till bil ${i + 1}`}
                      onClick={() => mobileSwiperRef.current?.slideToLoop(i)}
                    />
                  ))}
                </div>

                <div className="featured-mobile__link">
                  <Link href="/bilar" className="featured-link">Se alla bilar</Link>
                </div>
              </div>
            </>
          ) : (
            <p className="featured-empty">Inga fordon hittades just nu.</p>
          )}
        </Container>
      </section>

      {/* ── 4. ABOUT ── */}
      <section className="about-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={5} className="mb-5 mb-lg-0">
              <div className="about-image-wrap">
                <div className="about-image-border" />
                <div className="about-image-inner">
                  <Image
                    src={`${WP_BASE}/wp-content/uploads/2026/05/jonas_temp.jpeg`}
                    alt="Ahlgrens Husbilar CEO"
                    width={600} height={700}
                    className="about-image"
                    unoptimized
                  />
                </div>
              </div>
            </Col>
            <Col lg={6} className="offset-lg-1 mt-5 mt-lg-0">
              <h2 className="about-title">Vår Historia</h2>
              <p className="about-lead">
                På Ahlgrens Husbilar erbjuder vi ett noggrant utvalt sortiment av premium husbilar
                från Europas mest ansedda tillverkare.
              </p>
              <div className="about-stats">
                <div className="about-stat">
                  <h3 className="about-stat__number">25+</h3>
                  <p className="about-stat__label">Års Erfarenhet</p>
                </div>
                <div className="about-stat about-stat--divided">
                  <h3 className="about-stat__number">3000+</h3>
                  <p className="about-stat__label">Nöjda Kunder</p>
                </div>
              </div>
              <Link href="/om-oss" className="about-cta">LÄS MER</Link>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── 5. GARAGE PREVIEW ── */}
      <GaragePreview />

      {/* ── 6. CONTACT CTA ── */}
      <section className="contact-section">
        <Container>
          <Row className="align-items-center contact-row">
            <Col lg={6}>
              <h2 className="contact-title">Redo för<br />nästa äventyr?</h2>
              <p className="contact-sub">Vi finns här för personlig rådgivning och visning.</p>
            </Col>
            <Col lg={6} className="mt-4 mt-lg-0 text-lg-end">
              <Link href="/kontakt" className="contact-cta">KONTAKTA OSS IDAG</Link>
            </Col>
          </Row>
        </Container>
      </section>

    </div>
  );
}