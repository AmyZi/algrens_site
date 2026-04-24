'use client';

import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';

export default function PageHero({ eyebrow, title, titleAccent, subtitle }) {
  return (
    <section className="page-hero">
      <Container>
        <Row>
          <Col lg={8}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {eyebrow && (
                <h6 className="page-hero__eyebrow">{eyebrow}</h6>
              )}
              <h1 className="page-hero__title">
                {title}
                {titleAccent && (
                  <><br /><span className="page-hero__title-accent">{titleAccent}</span></>
                )}
              </h1>
              {subtitle && (
                <p className="page-hero__subtitle">{subtitle}</p>
              )}
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}