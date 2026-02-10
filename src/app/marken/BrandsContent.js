'use client';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function BrandsContent({ wpBaseUrl, brands }) {
  return (
    <div className="brands-page" style={{ backgroundColor: '#FFFFFF', color: '#000' }}>
      
      {/* 1. FIGMA HERO: High Contrast & Outlined Text */}
      <section 
        style={{
          backgroundColor: '#000',
          color: 'white',
          padding: '120px 0 80px 0',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container>
          <Row>
            <Col lg={8}>
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h6 className="fw-bold mb-3" style={{ color: '#FFD700', letterSpacing: '0.3em' }}>
                  OUR PARTNERS
                </h6>
                <h1 className="display-1 fw-black mb-4" style={{ letterSpacing: '-0.04em', lineHeight: '1' }}>
                  PREMIUM <br />
                  <span style={{ 
                    WebkitTextStroke: '1px #FFD700', 
                    WebkitTextFillColor: 'transparent' 
                  }}>
                    MÄRKEN
                  </span>
                </h1>
                <p className="lead fs-4 fw-medium text-white" style={{ maxWidth: '600px' }}>
                  Vi samarbetar exklusivt med Europas ledande tillverkare för att säkerställa din livskvalitet på vägen.
                </p>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 2. BRAND GRID: Sharp Corners & Minimalist Borders */}
      <section className="py-5" style={{ marginTop: '-40px' }}>
        <Container>
          <Row className="g-0 shadow-sm" style={{ border: '1px solid #000' }}>
            {brands.map((brand, index) => (
              <Col key={index} lg={3} md={4} sm={6} xs={6} 
                style={{ 
                  border: '0.5px solid #F1F5F9',
                  backgroundColor: '#FFF' 
                }}
              >
                <motion.div 
                  whileHover={{ backgroundColor: '#FFD700' }}
                  className="brand-item text-center p-5"
                  style={{
                    height: '220px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transition: '0.2s ease-in-out',
                    cursor: 'crosshair'
                  }}
                >
                  <div className="position-relative mb-4" style={{ width: '100%', height: '60px', filter: 'grayscale(100%) brightness(0.2)' }}>
                    <Image 
                      src={`${wpBaseUrl}/wp-content/uploads/car-logos/${brand.logo}`}
                      alt={brand.name}
                      fill
                      style={{ objectFit: 'contain' }}
                      unoptimized
                    />
                  </div>
                  <h3 className="h6 fw-black mb-1" style={{ letterSpacing: '0.1em' }}>{brand.name.toUpperCase()}</h3>
                  <p className="small mb-0 opacity-50 fw-bold" style={{ fontSize: '0.7rem' }}>{brand.country.toUpperCase()}</p>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 3. TYPES SECTION: Industrial Layout */}
      <section className="py-5 bg-white">
        <Container className="py-5">
          <div className="mb-5">
            <h2 className="display-4 fw-black">KATEGORIER</h2>
            <div style={{ width: '60px', height: '4px', backgroundColor: '#000' }}></div>
          </div>
          <Row className="g-4">
            {[
              { type: 'ALKOVER', desc: 'Familjevänliga klassiker med maximalt utrymme.', icon: '01' },
              { type: 'HALVINTEGRERAD', desc: 'Smidig körning möter modern lyx.', icon: '02' },
              { type: 'HELINTEGRERAD', desc: 'Det yttersta inom komfort och panoramavy.', icon: '03' }
            ].map((item, i) => (
              <Col md={4} key={i}>
                <div className="p-4 h-100 position-relative" style={{ border: '2px solid #F1F5F9' }}>
                  <span className="display-5 fw-black position-absolute" style={{ top: '10px', right: '20px', opacity: 0.1 }}>{item.icon}</span>
                  <h3 className="h4 fw-black mb-3">{item.type}</h3>
                  <p className="text-muted fw-medium">{item.desc}</p>
                  <div className="mt-4" style={{ width: '20px', height: '2px', backgroundColor: '#FFD700' }}></div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CUSTOM CSS FOR HOVER LOGO COLORS */}
      <style jsx>{`
        .brand-item:hover div {
          filter: grayscale(0%) brightness(1) !important;
          transform: scale(1.1);
          transition: 0.3s;
        }
      `}</style>
    </div>
  );
}