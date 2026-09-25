'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Container } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, EffectCoverflow } from 'swiper/modules';
import { stripHtml } from '@/lib/seo';
import { getFeaturedImageUrl, getPostCategories, getReadingTime, blogPostUrl } from '@/lib/getBlogPosts';


export default function BlogPreviewSection({ posts = [] }) {
  const desktopSwiperRef = useRef(null);
  const mobileSwiperRef = useRef(null);
  const [mobileIndex, setMobileIndex] = useState(0);

  if (posts.length === 0) return null;

  return (
    <section className="featured-section" style={{ backgroundColor: '#fff' }}>
      <Container>
        <div className="featured-header">
          <div>
            <h6 className="featured-eyebrow">Från bloggen</h6>
            <h2 className="featured-title">Senaste artiklarna</h2>
          </div>
          <Link href="/blogg/" className="featured-link">Se alla inlägg</Link>
        </div>

        {/* ── DESKTOP: Arrow-nav Swiper ── */}
        <div className="featured-desktop">
          <div className="featured-slider-container">
            <button
              className="feat-side-btn feat-side-btn--prev"
              aria-label="Föregående inlägg"
              onClick={() => desktopSwiperRef.current?.slidePrev()}
            >&#10216;</button>
            <button
              className="feat-side-btn feat-side-btn--next"
              aria-label="Nästa inlägg"
              onClick={() => desktopSwiperRef.current?.slideNext()}
            >&#10217;</button>

            <Swiper
              modules={[Pagination]}
              onSwiper={swiper => { desktopSwiperRef.current = swiper; }}
              slidesPerView={3}
              spaceBetween={24}
              grabCursor
              loop={posts.length > 3}
              pagination={{ clickable: true, type: 'bullets' }}
              breakpoints={{
                768: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 24 },
              }}
              className="featured-desktop__swiper"
            >
              {posts.map(post => (
                <SwiperSlide key={post.id}>
                  <BlogPostCard post={post} />
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
              loop={posts.length > 2}
            >
              {posts.map(post => (
                <SwiperSlide key={post.id}>
                  <BlogPostCard post={post} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="featured-mobile__pagination">
            {posts.map((_, i) => (
              <button
                key={i}
                className={`mobile-dot${i === mobileIndex ? ' mobile-dot--active' : ''}`}
                aria-label={`Gå till inlägg ${i + 1}`}
                onClick={() => mobileSwiperRef.current?.slideToLoop(i)}
              />
            ))}
          </div>

          <div className="featured-mobile__link">
            <Link href="/blogg/" className="featured-link">Se alla inlägg</Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

function BlogPostCard({ post }) {
  const img = getFeaturedImageUrl(post);
  const categories = getPostCategories(post);
  const category = categories[0] ?? null;
  const readTime = getReadingTime(post.content?.rendered);
  const dateDisplay = new Date(post.date).toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="hcard">
      <div className="hcard__image-wrap">
        <img
          src={img}
          alt={stripHtml(post.title.rendered)}
          className="hcard__image"
          loading="lazy"
        />
        {category && (
          <span className="hcard__badge hcard__badge--new">{category}</span>
        )}
      </div>

      <Link href={blogPostUrl(post)} className="hcard__body-link">
        <div className="hcard__body">
          <p className="hcard__meta">{dateDisplay}</p>
          <h3
            className="hcard__title"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
          <div className="hcard__footer">
            <span className="hcard__price">{readTime}</span>
            <span className="hcard__cta">LÄS MER</span>
          </div>
        </div>
      </Link>
    </div>
  );
}