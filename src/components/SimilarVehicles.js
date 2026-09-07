'use client';

import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import HomeCarCard from './HomeCarCard';
import '@/styles/homePage.css';


export default function SimilarVehicles({ cars = [], title = 'Liknande fordon' }) {
  const desktopSwiperRef = useRef(null);
  const mobileSwiperRef = useRef(null);
  const [mobileIndex, setMobileIndex] = useState(0);

  if (cars.length === 0) return null;

  return (
    <section className="featured-section">
      <div className="featured-header">
        <div>
          <h2 className="featured-title">{title}</h2>
        </div>
      </div>

      {/* ── DESKTOP: Arrow-nav Swiper ── */}
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
            loop={cars.length > 3}
            pagination={{ clickable: true, type: 'bullets' }}
            breakpoints={{
              768: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
            className="featured-desktop__swiper"
          >
            {cars.map(car => (
              <SwiperSlide key={car.id}>
                <HomeCarCard car={car} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* ── MOBILE: Coverflow carousel ── */}
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
                <HomeCarCard car={car} />
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
    </section>
  );
}