'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Container, Row, Col, Form } from 'react-bootstrap';
import {siteConfig} from '@/config/site-config';

const BRANDS = [
  { name: 'Ligier', text: 'Mopedbil service och reparation för Ligier, med fokus på säkerhet och driftsäkerhet.' },
  { name: 'Aixam', text: 'Allt från löpande underhåll till felsökning på din Aixam, utfört av erfarna händer.' },
  { name: 'Casalini', text: 'Pålitlig service för Casalini, så att din moppe bil är redo för vardagen.' },
];

const SERVICES = [
  { title: 'Oljeservice', text: 'Regelbunden oljeservice förlänger motorns livslängd och håller din mopedbil pigg år efter år.' },
  { title: 'Bromsservice', text: 'Trygga bromsar är avgörande. Vi kontrollerar, byter och justerar så att du kan lita på stoppet.' },
  { title: 'Felsökning', text: 'Konstiga ljud, varningslampor eller svårstartad? Vi hittar orsaken och förklarar vad som behöver göras.' },
  { title: 'Allmän reparation', text: 'Allmän reparation av din moppe bil, från slitdelar till större åtgärder, hos en bilverkstad som kan mopedbilar.' },
];

const REASONS = [
  { title: 'Erfarna tekniker', text: 'Vi arbetar dagligen med Ligier, Aixam och Casalini och kan märkena.' },
  { title: 'Snabb hantering', text: 'Vi vet att du behöver din mopedbil i vardagen, så vi håller ledtiderna korta.' },
  { title: 'Rättvisa priser', text: 'Tydlig offert innan vi börjar. Inga överraskningar på fakturan.' },
  { title: 'Säkerhet först', text: 'Vi prioriterar bromsar, däck och styrning, så att du kan känna dig trygg på vägen.' },
];

const BADGES = ['Ligier', 'Aixam', 'Casalini', 'Oljeservice', 'Bromsservice'];

const { phone, email, address } = siteConfig.contact;
const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

const EMPTY_FORM = { name: '', phone: '', model: '', message: '' };

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
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      // TODO: connect to your booking / contact endpoint
      setStatus('sent');
      setForm(EMPTY_FORM);
    } catch {
      setStatus('error');
    }
  };

  return (
    <main className="home-page">
      {/* Hero */}
      <section className="page-hero">
        <Container>
          <p className="page-hero__eyebrow">Bilverkstad för mopedbil</p>
          <h1 className="page-hero__title">Mopedbil service du kan lita på.</h1>
          <p className="page-hero__subtitle">
            Vi servar och reparerar Ligier, Aixam och Casalini. Från oljeservice till felsökning.
          </p>
          <p className="page-hero__description">
            Trygg service för din moppe bil, så att du och din tonåring kommer säkert fram.
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
            title="Specialister på mopedbilar"
            sub="Inte bara en vanlig bilverkstad. Vi kan märkena som rullar på svenska vägar."
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
            title="Mopedbil service från A till Ö"
            sub="Oavsett om det är rutinunderhåll eller ett oväntat fel hjälper vi dig snabbt och tydligt."
          />
          <Row className="g-4">
            {SERVICES.map((service, i) => (
              <Col key={service.title} sm={6} lg={3}>
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
            sub="Trygghet för dig som förare – och för dig som förälder."
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

      {/* Contact */}
      <section className="contact-page" id="kontakt">
        <Container>
          <SectionHeading
            title="Boka din mopedbil service idag"
            sub="Fyll i formuläret eller ring oss. Vi återkommer så snart vi kan."
          />
          <Row className="g-4">
            <Col lg={5}>
              <div className="contact-card">
                <h3 className="contact-card__title">Hitta hit</h3>
                <p className="contact-card__lead">Välkommen till vår bilverkstad.</p>
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
                      Måndag–fredag: 9 - 17<br />
                      Lördag: 10 - 15
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
                {status === 'sent' ? (
                  <div className="contact-success" role="status">
                    <h3 className="contact-success__title">Tack för din förfrågan!</h3>
                    <p className="contact-success__text">Vi återkommer så snart vi kan.</p>
                  </div>
                ) : (
                  <Form onSubmit={handleSubmit}>
                    <h3 className="contact-card__title">Skicka en förfrågan</h3>
                    <Form.Group className="mb-3" controlId="mopedbil-name">
                      <Form.Label className="contact-form__label">Namn</Form.Label>
                      <Form.Control className="contact-form__input" name="name" value={form.name} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="mopedbil-phone">
                      <Form.Label className="contact-form__label">Telefonnummer</Form.Label>
                      <Form.Control className="contact-form__input" type="tel" name="phone" value={form.phone} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="mopedbil-model">
                      <Form.Label className="contact-form__label">Märke och modell</Form.Label>
                      <Form.Control className="contact-form__input" name="model" placeholder="t.ex. Ligier, Aixam, Casalini" value={form.model} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-4" controlId="mopedbil-message">
                      <Form.Label className="contact-form__label">Vad behöver du hjälp med?</Form.Label>
                      <Form.Control className="contact-form__input" as="textarea" rows={4} name="message" value={form.message} onChange={handleChange} />
                    </Form.Group>
                    <button className="contact-btn contact-btn--primary" type="submit" disabled={status === 'sending'}>
                      {status === 'sending' ? 'Skickar…' : 'Skicka förfrågan'}
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