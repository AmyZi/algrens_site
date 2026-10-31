'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Modal } from 'react-bootstrap';
import { COOKIE_OPEN_EVENT, saveConsent, useCookieConsent } from './cookieConsent';

export default function CookieBanner() {
  const { ready, consent } = useCookieConsent();
  const [reopened, setReopened] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [mapsChecked, setMapsChecked] = useState(false);

  useEffect(() => {
    const handleOpen = () => {
      setReopened(true);
      setShowSettings(true);
    };
    window.addEventListener(COOKIE_OPEN_EVENT, handleOpen);
    return () => window.removeEventListener(COOKIE_OPEN_EVENT, handleOpen);
  }, []);

  useEffect(() => {
    if (consent) setMapsChecked(Boolean(consent.maps));
  }, [consent]);

  const visible = ready && (!consent || reopened);

  const close = (choices) => {
    saveConsent(choices);
    setReopened(false);
    setShowSettings(false);
  };

  return (
    <Modal
      show={visible}
      centered
      backdrop="static"
      keyboard={false}
      onHide={() => {}}
      aria-labelledby="cookie-banner-title"
    >
      <Modal.Header>
        <Modal.Title id="cookie-banner-title" className="contact-card__title mb-0">
          Vi använder cookies
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!showSettings ? (
          <>
            <p className="contact-card__lead">
              Vi använder funktionella cookies som behövs för att webbplatsen ska fungera.
              Med ditt samtycke visar vi även kartan från Google Maps, som kan sätta cookies.
              Läs mer i vår <Link href="/integritetspolicy">integritetspolicy</Link>.
            </p>
            <div className="cluster">
              <button
                type="button"
                className="contact-btn contact-btn--primary w-auto"
                onClick={() => close({ maps: true })}
              >
                Godkänn alla
              </button>
              <button
                type="button"
                className="contact-btn contact-btn--primary w-auto"
                onClick={() => close({ maps: false })}
              >
                Endast funktionella
              </button>
              <button
                type="button"
                className="contact-btn contact-btn--outline"
                onClick={() => setShowSettings(true)}
              >
                Inställningar
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="form-check mb-3">
              <input
                id="cookie-functional"
                type="checkbox"
                className="form-check-input"
                checked
                disabled
                readOnly
              />
              <label htmlFor="cookie-functional" className="form-check-label">
                <strong>Funktionella (alltid på)</strong>
                <span className="d-block small">
                  Behövs för att webbplatsen ska fungera och för att komma ihåg dina cookieval.
                </span>
              </label>
            </div>
            <div className="form-check mb-4">
              <input
                id="cookie-maps"
                type="checkbox"
                className="form-check-input"
                checked={mapsChecked}
                onChange={(e) => setMapsChecked(e.target.checked)}
              />
              <label htmlFor="cookie-maps" className="form-check-label">
                <strong>Google Maps (tredje part)</strong>
                <span className="d-block small">
                  Visar karta och vägbeskrivning till vårt kontor. Google får din IP-adress och
                  kan sätta cookies.
                </span>
              </label>
            </div>
            <div className="cluster">
              <button
                type="button"
                className="contact-btn contact-btn--primary w-auto"
                onClick={() => close({ maps: mapsChecked })}
              >
                Spara val
              </button>
              {!consent && (
                <button
                  type="button"
                  className="contact-btn contact-btn--outline"
                  onClick={() => setShowSettings(false)}
                >
                  Tillbaka
                </button>
              )}
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
}