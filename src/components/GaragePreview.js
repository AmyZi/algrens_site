'use client';

import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function GaragePreview() {
  const wpBaseUrl = 'https:///ahlgrens.eu/web';

  const previewZones = [
    { 
      id: '01', 
      name: 'Showroom', 
      image: `${wpBaseUrl}/wp-content/uploads/2026/garage/Showroom-1.jpeg` 
    },
    { 
      id: '02', 
      name: 'Verkstad', 
      image: `${wpBaseUrl}/wp-content/uploads/2026/garage/workshop-1.jpeg` 
    },
    { 
      id: '03', 
      name: 'Service', 
      image: `${wpBaseUrl}/wp-content/uploads/2026/garage/workshop-2.jpeg` 
    },
  ];

  return (
    <section className="py-5" style={{ backgroundColor: '#000', color: '#fff', overflow: 'hidden' }}>
      <Container className="py-5">
        <Row className="mb-5 align-items-end">
          <Col md={8}>
            <h6 className="fw-bold mb-3" style={{ color: '#FFD700', letterSpacing: '0.3em' }}>THE FACILITY</h6>
            <h2 className="display-3 fw-black mb-0" style={{ letterSpacing: '-0.02em' }}>UTFORSKA GARAGET</h2>
          </Col>
          <Col md={4} className="text-md-end">
            <Link href="/garage" className="text-white fw-bold text-decoration-none" style={{ letterSpacing: '0.1em' }}>
              SE HELA RUNDTUREN <span style={{ color: '#FFD700' }}>→</span>
            </Link>
          </Col>
        </Row>

        <Row className="g-4">
          {previewZones.map((zone) => (
            <Col key={zone.id} md={4}>
              <Link href={`/garage#${zone.id}`} className="text-decoration-none">
                <motion.div 
                  whileHover="hover" 
                  className="position-relative" 
                  style={{ height: '450px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  {/* Image Container with Motion Zoom */}
                  <motion.div 
                    variants={{ hover: { scale: 1.1 } }}
                    transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      backgroundColor: '#1a1a1a',
                      position: 'relative'
                    }} 
                  >
                    {/* THE IMAGE TAG GOES HERE */}
                    <Image 
                      src={zone.image}
                      alt={zone.name}
                      fill
                      unoptimized
                      style={{ objectFit: 'cover' }}
                    />
                    <span className="display-1 fw-black position-absolute" style={{ bottom: '-10px', left: '10px', opacity: 0.1, color: '#fff', pointerEvents: 'none' }}>
                      {zone.id}
                    </span>
                  </motion.div>
                  
                  {/* Text Overlay */}
                  <div className="position-absolute bottom-0 left-0 p-4 w-100" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.9))', zIndex: 2 }}>
                    <h4 className="fw-black mb-1" style={{ color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{zone.name.toUpperCase()}</h4>
                    
                    {/* Motion Underline */}
                    <motion.div 
                      variants={{ hover: { width: '60px' } }}
                      initial={{ width: '0px' }}
                      transition={{ duration: 0.3 }}
                      style={{ height: '3px', backgroundColor: '#FFD700' }} 
                    />
                  </div>
                </motion.div>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}