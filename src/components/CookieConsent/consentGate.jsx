'use client';

import { openCookieSettings, useCookieConsent } from './Cookieconsent';


export default function ConsentGate({ category = 'maps', className = '', children }) {
  const { ready, consent } = useCookieConsent();

  if (ready && consent && consent[category]) {
    return children;
  }

  return (
    <div className={className}>
      {ready && (
        <div className="d-flex flex-column align-items-center justify-content-center text-center gap-3 p-4 py-5 h-100">
          <p className="text-muted-sm mb-0">
            Kartan från Google Maps visas när du godkänner cookies från tredje part.
          </p>
          <button
            type="button"
            className="contact-btn contact-btn--primary w-auto"
            onClick={openCookieSettings}
          >
            Cookieinställningar
          </button>
        </div>
      )}
    </div>
  );
}