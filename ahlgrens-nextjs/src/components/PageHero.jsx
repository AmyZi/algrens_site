'use client';

import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PageHero({ eyebrow, title, titleAccent, subtitle, description, primaryCta, secondaryCta, badges, breadcrumb }) {
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
              {breadcrumb && (
                <nav aria-label="breadcrumb" className="page-hero__breadcrumb mb-2">
                  {breadcrumb}
                </nav>
              )}
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
              {description && (
                <p className="page-hero__description">{description}</p>
              )}
              {(primaryCta || secondaryCta) && (
                <div className="hero-actions">
                  {primaryCta && (
                    <Link href={primaryCta.href} className="hero-btn hero-btn--primary">
                      {primaryCta.label}
                    </Link>
                  )}
                  {secondaryCta && (
                    <a href={secondaryCta.href} target="_blank" rel="noopener noreferrer" className="hero-btn hero-btn--outline">
                      {secondaryCta.label}
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          </Col>
        </Row>
      </Container>

      {badges && badges.length > 0 && (
        <div className="page-hero__badge-bar">
          <div className="page-hero__badge-bar-inner">
            {badges.map(b => (
              <span key={b} className="page-hero__badge">{b}</span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}