'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Container, Row, Col, Form } from 'react-bootstrap';
import {siteConfig} from '@/config/site-config';

const CF7_FORM_ID = '172';
const CF7_ENDPOINT = `https://www.ahlgrens.eu/web/index.php?rest_route=/contact-form-7/v1/contact-forms/${CF7_FORM_ID}/feedback`;

const BRANDS = [
  { name: 'Ligier', text: 'Ligier verkstad i Borås: service och reparation med fokus på säkerhet och driftsäkerhet.' },
  { name: 'Aixam', text: 'Aixam service i Borås, från löpande underhåll till felsökning, utfört av erfarna händer.' },
  { name: 'Casalini', text: 'Casalini service i Borås, så att din moppe bil är redo för vardagen.' },
];

const SERVICES = [
  { title: 'Oljeservice', text: 'Oljeservice för mopedbil i Borås. Regelbunden service förlänger motorns livslängd och håller din mopedbil pigg år efter år.' },
  { title: 'Bromsservice', text: 'Trygga bromsar är avgörande. Vi kontrollerar, byter och justerar så att du kan lita på stoppet.' },
  { title: 'Variatorrem', text: 'Tappar din mopedbil kraft eller slirar den? Vi byter variatorrem och går igenom drivlinan.' },
  { title: 'Felsökning', text: 'Konstiga ljud, varningslampor eller svårstartad? Vi hittar orsaken och förklarar vad som behöver göras.' },
  { title: 'Laga moppebil', text: 'Vi lagar din moppebil i Borås, från slitdelar till större åtgärder, hos en bilverkstad som kan mopedbilar.' },
];

const REASONS = [
  { title: 'Erfarna tekniker', text: 'Vi arbetar dagligen med Ligier, Aixam och Casalini och kan märkena.' },
  { title: 'Snabb hantering', text: 'Vi vet att du behöver din mopedbil i vardagen, så vi håller ledtiderna korta.' },
  { title: 'Rättvisa priser', text: 'Tydlig offert innan vi börjar. Inga överraskningar på fakturan.' },
  { title: 'Säkerhet först', text: 'Vi prioriterar bromsar, däck och styrning, så att du kan känna dig trygg på vägen.' },
];

const BADGES = ['Ligier verkstad Borås', 'Aixam service Borås', 'Casalini service Borås', 'Oljeservice', 'Variatorrem'];

const { phone, email, address } = siteConfig.contact;
const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

function SectionHeading({ title, sub }) {
  return (
    <div className="boras-section-heading mb-5">
      <h2 className="boras-section-heading__title">{title}</h2>
      <div className="boras-section-heading__rule" />
      <p className="boras-section-heading__sub">{sub}</p>
    </div>
  );
}

export default function MopedbilPage() {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

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
    <main className="home-page">
      {/* Hero */}
      <section className="page-hero">
        <Container>
          <p className="page-hero__eyebrow">Mopedbil verkstad i Borås</p>
          <h1 className="page-hero__title">Mopedbil service i Borås du kan lita på.</h1>
          <p className="page-hero__subtitle">
            Din bilverkstad för Ligier, Aixam och Casalini. Oljeservice, variatorrem, bromsar och felsökning.
          </p>
          <p className="page-hero__description">
            Vi hjälper dig med din moppe bil i Borås, Ulricehamn, Kinna, Bollebygd och hela Sjuhärad.
          </p>
          <div className="hero-actions mt-4">
            <a className="hero-btn hero-btn--primary" href="#kontakt">Boka service nu</a>
            <a className="hero-btn hero-btn--outline" href="#tjanster">Se våra tjänster</a>
          </div>
        </Container>
        <div className="page-hero__badge-bar">
          <Container>
            <ul className="page-hero__badge-bar-inner list-unstyled mb-0">
              {BADGES.map((badge) => (
                <li key={badge} className="page-hero__badge">{badge}</li>
              ))}
            </ul>
          </Container>
        </div>
      </section>

      {/* Brands */}
      <section className="py-5" id="marken">
        <Container>
          <SectionHeading
            title="Mopedbil verkstad i Borås"
            sub="Specialister på Ligier, Aixam och Casalini. Inte bara en vanlig bilverkstad, utan en verkstad som kan märkena som rullar i Sjuhärad."
          />
          <Row className="g-4">
            {BRANDS.map((brand, i) => (
              <Col key={brand.name} md={4}>
                <article className="brand-category-card">
                  <span className="brand-category-card__number">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="brand-category-card__type">{brand.name}</h3>
                  <p className="brand-category-card__desc">{brand.text}</p>
                  <div className="brand-category-card__rule" />
                </article>
              </Col>
            ))}
          </Row>
          <p className="text-center mt-4 mb-0 text-muted-sm">
            Äger du ett annat märke? Hör av dig, så berättar vi om vi kan hjälpa dig.
          </p>
        </Container>
      </section>

      {/* Services */}
      <section className="boras-reasons py-5" id="tjanster">
        <Container>
          <SectionHeading
            title="Mopedbil service i Borås, från A till Ö"
            sub="Oavsett om det är rutinunderhåll eller ett oväntat fel hjälper vi dig snabbt och tydligt."
          />
          <Row className="g-4 justify-content-center">
            {SERVICES.map((service, i) => (
              <Col key={service.title} md={6} lg={4}>
                <article className="brand-category-card">
                  <span className="brand-category-card__number">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="brand-category-card__type">{service.title}</h3>
                  <p className="brand-category-card__desc">{service.text}</p>
                  <div className="brand-category-card__rule" />
                </article>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Why us */}
      <section className="py-5" id="varfor">
        <Container>
          <SectionHeading
            title="Varför välja oss"
            sub="Trygghet för dig som förare och för dig som förälder. En mopedbil är ofta en tonårings första fordon, och det ska kännas tryggt från första besöket."
          />
          <Row className="g-4">
            {REASONS.map((reason, i) => (
              <Col key={reason.title} sm={6} lg={3}>
                <article className="boras-reason-card">
                  <span className="boras-reason-card__number">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="boras-reason-card__title">{reason.title}</h3>
                  <p className="boras-reason-card__desc">{reason.text}</p>
                  <div className="boras-reason-card__rule" />
                </article>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Service area */}
      <section className="boras-reasons py-5" id="omrade">
        <Container>
          <SectionHeading
            title="Mopedbil verkstad i Borås och Sjuhärad"
            sub="Vår verkstad ligger i Borås, och hit kommer mopedbilsägare från hela närområdet."
          />
          <p className="text-center mb-0">
            Vi servar och lagar mopedbilar för kunder i Borås, Ulricehamn, Kinna och Bollebygd. Bor du i
            närheten och letar efter en mopedbil verkstad i Sjuhärad? Hör av dig, så hjälper vi dig med
            oljeservice, variatorrem eller felsökning av din Ligier, Aixam eller Casalini.
          </p>
        </Container>
      </section>

      {/* Contact */}
      <section className="contact-page" id="kontakt">
        <Container>
          <SectionHeading
            title="Boka din mopedbil service i Borås idag"
            sub="Fyll i formuläret eller ring oss. Vi återkommer så snart vi kan."
          />
          <Row className="g-4">
            <Col lg={5}>
              <div className="contact-card">
                <h3 className="contact-card__title">Hitta hit</h3>
                <p className="contact-card__lead">Välkommen till vår bilverkstad i Borås.</p>
                <a
                  className="contact-item"
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${address} – visa på karta (öppnas i ny flik)`}
                >
                  <div>
                    <div className="contact-item__label">Adress</div>
                    <div className="contact-item__value">{address}</div>
                  </div>
                </a>
                <div className="contact-item">
                  <div>
                    <div className="contact-item__label">Öppettider</div>
                    <div className="contact-item__value">
                      Måndag–fredag: 9 - 17 <br />
                      Lördag–söndag: 10 - 16
                    </div>
                  </div>
                </div>
                <div className="d-grid gap-2">
                  <a className="contact-btn contact-btn--primary" href={`tel:${phone.replace(/\s/g, '')}`}>
                    Ring oss {phone}
                  </a>
                  <a className="contact-btn contact-btn--outline" href={`mailto:${email}`}>
                    Mejla {email}
                  </a>
                  <Link className="contact-btn contact-btn--outline" href="/garage">
                    Besök vår bilverkstad
                  </Link>
                </div>
              </div>
            </Col>

            <Col lg={7}>
              <div className="contact-card">
                {status === 'success' ? (
                  <div className="contact-success" role="status">
                    <h3 className="contact-success__title">Tack för din förfrågan!</h3>
                    <p className="contact-success__text">Vi återkommer så snart vi kan.</p>
                  </div>
                ) : (
                  <Form onSubmit={handleSubmit}>
                    <h3 className="contact-card__title">Skicka en förfrågan</h3>
                    <Form.Group className="mb-3" controlId="mopedbil-name">
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
                    <Form.Group className="mb-3" controlId="mopedbil-email">
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
                    <Form.Group className="mb-3" controlId="mopedbil-model">
                      <Form.Label className="contact-form__label">Ämne</Form.Label>
                      <Form.Control
                        className="contact-form__input"
                        name="your-subject"
                        type="text"
                        placeholder="Vilket märke och modell har du?"
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-4" controlId="mopedbil-message">
                      <Form.Label className="contact-form__label">Meddelande</Form.Label>
                      <Form.Control
                        className="contact-form__input"
                        name="your-message"
                        as="textarea"
                        rows={4}
                        required
                      />
                    </Form.Group>
                    <button className="contact-btn contact-btn--primary" type="submit" disabled={status === 'loading'}>
                      {status === 'loading' ? 'Skickar…' : 'Skicka förfrågan'}
                    </button>
                    {status === 'error' && (
                      <p className="contact-form__error" role="alert">Något gick fel. Försök igen eller ring oss.</p>
                    )}
                  </Form>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Closing CTA */}
      <section className="py-5 text-center">
        <Container>
          <h2 className="boras-map-cta__title">Redo att ge din moppe bil den service den förtjänar?</h2>
          <div className="boras-map-cta__actions justify-content-center">
            <a className="hero-btn hero-btn--primary" href="#kontakt">Boka service nu</a>
            <Link className="hero-btn hero-btn--outline-dark" href="/garage">Besök vår bilverkstad</Link>
          </div>
        </Container>
      </section>
    </main>
  );
}