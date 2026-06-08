'use client';


import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import { motion } from 'framer-motion';
import PageHero from '@/components/PageHero';

export default function BrandsContent({ wpBaseUrl, brands }) {
  return (
    <div className="brands-page">

      {/* ── 1. Hero ── */}
      <PageHero
        eyebrow="OUR PARTNERS"
        title="PREMIUM"
        titleAccent="MÄRKEN"
        subtitle="Vi samarbetar exklusivt med Europas ledande tillverkare för att säkerställa din livskvalitet på vägen."
      />

      {/* ── 2. Brand grid ── */}
      <section className="brands-grid-section">
        <Container>
          <Row className="g-0 brands-grid">
            {brands.map((brand, index) => (
              <Col key={index} lg={3} md={4} sm={6} xs={6} className="brand-cell">
                <motion.div
                  whileHover={{ backgroundColor: '#FFD700' }}
                  className="brand-item"
                  transition={{ duration: 0.2 }}
                >
                  <div className="brand-item__logo-wrap">
                    <Image
                      src={`${wpBaseUrl}/wp-content/uploads/car-logos/${brand.logo}`}
                      alt={brand.name}
                      fill
                      style={{ objectFit: 'contain' }}
                      unoptimized
                    />
                  </div>
                  <h3 className="brand-item__name">{brand.name.toUpperCase()}</h3>
                  <p className="brand-item__country">{brand.country.toUpperCase()}</p>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── 3. Categories ── */}
      <section className="brands-categories">
        <Container className="py-5">
          <div className="brands-categories__heading">
            <h2 className="brands-categories__title">KATEGORIER</h2>
            <div className="brands-categories__rule" />
          </div>
          <Row className="g-4">
            {[
              { type: 'ALKOVER',        desc: 'Familjevänliga klassiker med maximalt utrymme.',  icon: '01' },
              { type: 'HALVINTEGRERAD', desc: 'Smidig körning möter modern lyx.',                icon: '02' },
              { type: 'HELINTEGRERAD',  desc: 'Det yttersta inom komfort och panoramavy.',       icon: '03' },
            ].map((item, i) => (
              <Col md={4} key={i}>
                <div className="brand-category-card">
                  <span className="brand-category-card__number">{item.icon}</span>
                  <h3 className="brand-category-card__type">{item.type}</h3>
                  <p className="brand-category-card__desc">{item.desc}</p>
                  <div className="brand-category-card__rule" />
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

    </div>
  );
}