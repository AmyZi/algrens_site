'use client';

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';

const AboutContent = () => {
  const wpBaseUrl = process.env.NEXT_PUBLIC_WP_API_URL?.replace('/wp-json/wp/v2', '') || 'http://localhost/web';

  return (
    <div className="about-page" style={{ backgroundColor: '#FFFFFF', padding: '100px 0', overflow: 'hidden' }}>
      <Container>
        <Row className="align-items-center g-5">
          
          {/* Left Side: Image with Decorative Lines and Floating Stats */}
          <Col lg={6} className="position-relative">
            <div className="position-relative">
              {/* Decorative Blue Outline Box */}
              <div style={{
                position: 'absolute',
                top: '-30px',
                left: '-30px',
                width: '100%',
                height: '100%',
                border: '1.5px solid #FFD700',
                zIndex: 0,
                opacity: 0.5
              }} />

              {/* Main Image Container */}
              <div className="position-relative" style={{ zIndex: 1, borderRadius: '4px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
                <Image 
                  src={`${wpBaseUrl}/wp-content/uploads/2026/02/Algrens_CEO.jpeg`}
                  alt="Ahlgrens Husbilar CEO"
                  width={600}
                  height={700}
                  style={{ 
                    objectFit: 'cover', 
                    width: '100%', 
                    height: 'auto'
                  }}
                  unoptimized
                />

                {/* Top Right Floating Badge */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '-40px',
                    backgroundColor: '#FFFFFF',
                    padding: '20px 30px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    borderRadius: '8px',
                    textAlign: 'center',
                    minWidth: '150px',
                    zIndex: 10
                  }}
                >
                  <p className="small text-muted mb-1 text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>Års Erfarenhet</p>
                  <h3 className="fw-bold mb-0" style={{ color: '#0F172A' }}>25+</h3>
                </div>

                {/* Bottom Left Floating Badge */}
                <div 
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '-20px',
                    backgroundColor: '#FFFFFF',
                    padding: '15px 25px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 10
                  }}
                >
                  <div className="d-flex mb-1">
                    <span style={{ fontSize: '1.2rem' }}>⭐⭐⭐⭐⭐</span>
                  </div>
                  <p className="fw-bold mb-0" style={{ fontSize: '0.9rem' }}>3000+ nöjda kunder</p>
                </div>
              </div>

              {/* Decorative Dot Grid */}
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-20px',
                width: '100px',
                height: '100px',
                backgroundImage: 'radial-gradient(#CBD5E1 2px, transparent 2px)',
                backgroundSize: '15px 15px',
                zIndex: 0
              }} />
            </div>
          </Col>

          {/* Right Side: Typography and Content */}
          <Col lg={6} className="ps-lg-5">
            <div>
              <h1 className="display-3 fw-bold mb-4" style={{ color: '#0F172A', letterSpacing: '-0.03em' }}>
                Om Oss
              </h1>
              
              <div style={{ color: '#475569', fontSize: '1.1rem', lineHeight: '1.8' }}>
                <p className="lead mb-4 fw-medium" style={{ color: '#0F172A' }}>
                  Sommaren 1973 – sommarlovet hade precis börjat. Det var en lite regnig morgon, jag minns det som igår...
                </p>
                <p>Doften av gasolspisen blandat med doften av nybryggt kaffe. Det lite sövande ljudet av smattrande regn på taket. Ljudet av lekande skrattande barn utanför.</p>
                <p>
                  Det här är ett av de första och starkaste minnena från min barndom. Mina föräldrar hade köpt en ny husvagn och bestämt att vi skulle tillbringa sommaren i Varberg och senare Öland. Det var då min kärlek till husbilsliv började.
                </p>
                <p className="mb-5">
                  Nu 52 år senare har jag bedrivit handel med husbilar och husvagnar i snart 25 år och varit med att sätta Sverige på husbilskartan med över 3 000 lyckliga kunder.
                </p>
                <p>Efter att ha varit med och bygga upp ett försäljnings nät med olika märken kände jag att det var dags att ändra inriktning och istället för kvantitet satsa på kvalitet. Min passion för vanlife och husbilskulturen har alltid varit drivkraften bakom mitt arbete.</p>

                <p>Sommaren 2025 var det således dags att slå upp portarna för min nya husbilshandel hos Ahlgrens i Borås. Min vision är att &quot;handplocka&quot; samtliga husbilar – oavsett om det är en alkov, halv integrerad eller hel integrerad husbil – och göra varje affär unik med garantier, fullständig husbilsservice och att vara stolt över varje enskild kund. Din väg, ditt hem, är inte bara ett ord för mig – det är mitt löfte till dig.</p>
              </div>

              {/* Modern Black CTA Button */}
              <Link href="/kontakt" style={{ textDecoration: 'none' }}>
                <div 
                  className="cta-button"
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#000000',
                    color: '#FFFFFF',
                    padding: '18px 50px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0% 100%)',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(10px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                >
                  Kontakta Oss
                </div>
              </Link>
            </div>
          </Col>

        </Row>
      </Container>
    </div>
  );
};

export default AboutContent;