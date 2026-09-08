'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Container } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import '@/styles/homePage.css';

export default function SimilarVehicles({ cars, title = 'Liknande fordon' }) {
  const desktopSwiperRef = useRef(null);
  const mobileSwiperRef = useRef(null);
  const [mobileIndex, setMobileIndex] = useState(0);

  if (!cars || cars.length === 0) return null;

  return (
    <section className="featured-section">
      <Container>
        <div className="featured-header">
          <h2 className="featured-title">{title}</h2>
        </div>

        {/* ── DESKTOP ── */}
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
              {cars.map(car => (
                <SwiperSlide key={car.id}>
                  <SimilarCarCard car={car} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* ── MOBILE ── */}
        <div className="featured-mobile">
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
              loop={cars.length > 2}
            >
              {cars.map(car => (
                <SwiperSlide key={car.id}>
                  <SimilarCarCard car={car} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="featured-mobile__pagination">
            {cars.map((_, i) => (
              <button
                key={i}
                className={`mobile-dot${i === mobileIndex ? ' mobile-dot--active' : ''}`}
                aria-label={`Gå till bil ${i + 1}`}
                onClick={() => mobileSwiperRef.current?.slideToLoop(i)}
              />
            ))}
          </div>
        </div>

        <div className="featured-mobile__link">
          <Link href="/bilar" className="featured-link">Se alla bilar</Link>
        </div>
      </Container>
    </section>
  );
}

function SimilarCarCard({ car }) {
  const meta = car.meta || {};
  const isNew = meta._car_is_new === 'yes';
  const folder = isNew ? 'nytt' : 'begagnat';
  const img = meta._car_thumbnail || '/placeholder-car.jpg';
  const price = meta._car_price
    ? `${parseInt(meta._car_price, 10).toLocaleString('sv-SE')} kr`
    : 'Ring för pris';

  return (
    <div className="hcard">
      <div className="hcard__image-wrap">
        <img src={img} alt={car.title.rendered} className="hcard__image" />
        <span className={`hcard__badge${isNew ? ' hcard__badge--new' : ' hcard__badge--used'}`}>
          {isNew ? 'NYHET' : 'BEGAGNAD'}
        </span>
      </div>

      <Link href={`/bilar/${folder}/${car.slug}/`} className="hcard__body-link">
        <div className="hcard__body">
          <p className="hcard__meta">{meta._car_make} · {meta._car_year}</p>
          <h3
            className="hcard__title"
            dangerouslySetInnerHTML={{ __html: car.title.rendered }}
          />
          <div className="hcard__footer">
            <span className="hcard__price">{price}</span>
            <span className="hcard__cta">VISA</span>
          </div>
        </div>
      </Link>
    </div>
  );
}