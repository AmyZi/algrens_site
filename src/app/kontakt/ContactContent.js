'use client';

import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import PageHero from '@/components/PageHero';
import { siteConfig } from '@/config/site-config';
import '@/styles/custom.scss';

// TODO: move to siteConfig.contact.hours so the footer can reuse it
const OPENING_HOURS = 'Mån – Fre: 09:00 – 17:00';

const CF7_FORM_ID = '172';
const CF7_ENDPOINT = `https://www.ahlgrens.eu/web/index.php?rest_route=/contact-form-7/v1/contact-forms/${CF7_FORM_ID}/feedback`;

const ContactContent = () => {
  const { contact, links } = siteConfig;
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const q = encodeURIComponent(contact.address);
  const mapUrl = apiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${q}`
    : `https://maps.google.com/maps?q=${q}&output=embed`;
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${q}`;
  const phoneHref = `tel:${contact.phone.replace(/\s/g, '')}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    const form = e.target;
    const formData = new FormData(form);
    formData.append('_wpcf7', CF7_FORM_ID);
    formData.append('_wpcf7_unit_tag', `wpcf7-f${CF7_FORM_ID}-p1-o1`);
    formData.append('_wpcf7_locale', 'sv_SE');

    try {
      const response = await fetch(CF7_ENDPOINT, { method: 'POST', body: formData });
      const data = await response.json();

      if (data.status === 'mail_sent') {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
        console.error('Validation failed:', data);
      }
    } catch (error) {
      setStatus('error');
      console.error('Submission error:', error);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Kontakt"
        title="HÖR AV"
        titleAccent="DIG IDAG"
        subtitle="Oavsett om du vill köpa, sälja eller serva din husbil finns vi här för att hjälpa dig."
      />

      <div className="contact-page">
        <Container>
          <Row className="g-5">
            <Col lg={6}>
              <div className="contact-card">
                <h2 className="contact-card__title">Kontakta oss</h2>
                <p className="contact-card__lead">Har du en fråga? Vi svarar gärna.</p>

                <ContactItem
                  icon={<EmailIcon />}
                  label="E-post"
                  value={contact.email}
                  href={`mailto:${contact.email}`}
                />
                <ContactItem
                  icon={<PhoneIcon />}
                  label="Telefon"
                  value={contact.phone}
                  href={phoneHref}
                />
                <ContactItem
                  icon={<MapIcon />}
                  label="Adress"
                  value={contact.address}
                  href={mapsLink}
                  external
                />
                <ContactItem icon={<ClockIcon />} label="Öppettider" value={OPENING_HOURS} />

                <div className="contact-social">
                  <p className="contact-social__title">Följ oss</p>
                  <div className="contact-social__list">
                    <SocialIcon label="Facebook" href={links.facebook} icon={<FacebookIcon />} />
                    <SocialIcon label="Instagram" href={links.instagram} icon={<InstagramIcon />} />
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={6}>
              <div className="contact-card">
                <h2 className="contact-card__title">Skicka ett meddelande</h2>
                <p className="contact-card__lead">
                  Fyll i formuläret så återkommer vi så snart vi kan.
                </p>

                {status === 'success' ? (
                  <div className="contact-success" role="status">
                    <span className="contact-success__icon">
                      <CheckIcon />
                    </span>
                    <h3 className="contact-success__title">Tack! Meddelandet är skickat.</h3>
                    <p className="contact-success__text">Vi hör av oss inom kort.</p>
                    <button
                      type="button"
                      className="contact-btn contact-btn--outline"
                      onClick={() => setStatus('idle')}
                    >
                      Skicka ett till
                    </button>
                  </div>
                ) : (
                  <Form onSubmit={handleSubmit}>
                    {/* `name` attributes must match the Contact Form 7 tags */}
                    <Form.Group className="mb-3" controlId="contact-name">
                      <Form.Label className="contact-form__label">Namn</Form.Label>
                      <Form.Control
                        className="contact-form__input"
                        name="your-name"
                        type="text"
                        placeholder="Ditt namn"
                        autoComplete="name"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="contact-email">
                      <Form.Label className="contact-form__label">E-post</Form.Label>
                      <Form.Control
                        className="contact-form__input"
                        name="your-email"
                        type="email"
                        placeholder="namn@exempel.se"
                        autoComplete="email"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="contact-subject">
                      <Form.Label className="contact-form__label">Ämne</Form.Label>
                      <Form.Control
                        className="contact-form__input"
                        name="your-subject"
                        type="text"
                        placeholder="Vad gäller det?"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="contact-message">
                      <Form.Label className="contact-form__label">Meddelande</Form.Label>
                      <Form.Control
                        className="contact-form__input"
                        name="your-message"
                        as="textarea"
                        rows={4}
                        required
                      />
                    </Form.Group>

                    <button
                      type="submit"
                      className="contact-btn contact-btn--primary"
                      disabled={status === 'loading'}
                    >
                      {status === 'loading' ? 'Skickar…' : 'Skicka meddelande'}
                    </button>

                    {status === 'error' && (
                      <p className="contact-form__error" role="alert">
                        Något gick fel. Försök igen eller ring oss på {contact.phone}.
                      </p>
                    )}
                  </Form>
                )}
              </div>
            </Col>
          </Row>

          <div className="contact-map">
            <iframe
              className="contact-map__frame"
              src={mapUrl}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${siteConfig.brand.name} – hitta till oss`}
            />
          </div>
        </Container>
      </div>
    </>
  );
};

// ── Sub components ──────────────────────────────────────────

const ContactItem = ({ icon, label, value, href, external = false }) => {
  const body = (
    <>
      <span className="contact-item__icon" aria-hidden="true">
        {icon}
      </span>
      <span>
        <span className="d-block contact-item__label">{label}</span>
        <span className="d-block contact-item__value">{value}</span>
      </span>
    </>
  );

  if (!href) return <div className="contact-item">{body}</div>;

  return (
    <a
      className="contact-item"
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {body}
    </a>
  );
};

const SocialIcon = ({ icon, href, label }) => (
  <a
    className="contact-social__link"
    href={href}
    aria-label={label}
    target="_blank"
    rel="noopener noreferrer"
  >
    {icon}
  </a>
);

// ── Icons ───────────────────────────────────────────────────

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MapIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const CheckIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default ContactContent;