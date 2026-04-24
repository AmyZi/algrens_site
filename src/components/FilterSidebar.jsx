'use client';

import { useState } from 'react';

// ── SVG Icons ─────────────────────────────────────────────────────────────────

const IconPrice = () => (
  <svg className="accord-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm.75 10.5v.5a.75.75 0 01-1.5 0v-.55a2.75 2.75 0 01-1.59-1.2.75.75 0 111.29-.77c.2.33.56.52.94.52h.36c.56 0 1-.42 1-.94 0-.43-.29-.8-.7-.92l-1.62-.46A2.44 2.44 0 015.5 5.81C5.5 4.75 6.39 3.9 7.5 3.75v-.5a.75.75 0 011.5 0v.5c.55.09 1.04.38 1.37.82a.75.75 0 01-1.15.96A.94.94 0 008.25 5.25h-.5c-.5 0-.88.37-.88.75 0 .33.22.62.54.71l1.62.46A2.44 2.44 0 0111.25 9.5c0 1.12-.92 2.02-2 2.19v.06c0 .14-.003.275-.003.25z"/>
  </svg>
);

const IconShield = () => (
  <svg className="accord-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 1L2 4v4c0 3.3 2.5 6 6 7 3.5-1 6-3.7 6-7V4L8 1zm0 2.2l4 2v3.6c0 2.3-1.7 4.2-4 5.1-2.3-.9-4-2.8-4-5.1V5.2l4-2z"/>
  </svg>
);

const IconCalendar = () => (
  <svg className="accord-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
    <rect x="1" y="3" width="14" height="12" rx="1.5"/>
    <line x1="5" y1="1" x2="5" y2="5"/>
    <line x1="11" y1="1" x2="11" y2="5"/>
    <line x1="1" y1="7" x2="15" y2="7"/>
  </svg>
);

const IconSpeedo = () => (
  <svg className="accord-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
    <circle cx="8" cy="9" r="6.5"/>
    <path d="M8 9L5 5"/>
    <circle cx="8" cy="9" r="1.2" fill="currentColor" stroke="none"/>
    <path d="M4 9h1M11 9h1M8 4v1"/>
  </svg>
);

const IconChevron = () => (
  <svg className="accord-arrow-icon" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <polyline points="2 4 6 8 10 4"/>
  </svg>
);

// ── Vehicle SVGs ──────────────────────────────────────────────────────────────

const CamperSVG = () => (
  <svg className="qp-vehicle-svg" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="2" y="14" width="66" height="18" rx="2" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M2 14 Q2 6 10 6 L46 6 L58 14Z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.2"/>
    <rect x="8" y="8" width="11" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    <rect x="24" y="8" width="11" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    <rect x="60" y="15" width="14" height="11" rx="1.5" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.2"/>
    <rect x="62" y="17" width="10" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="1"/>
    <circle cx="16" cy="33" r="5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="16" cy="33" r="2" fill="currentColor"/>
    <circle cx="56" cy="33" r="5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="56" cy="33" r="2" fill="currentColor"/>
    <line x1="68" y1="23" x2="78" y2="23" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const CaravanSVG = () => (
  <svg className="qp-vehicle-svg" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="4" y="12" width="56" height="20" rx="2" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="2" y="17" width="5" height="10" rx="1" fill="currentColor" opacity="0.3"/>
    <rect x="57" y="17" width="4" height="8" rx="1" fill="currentColor" opacity="0.3"/>
    <rect x="8" y="12" width="9" height="5" rx="1" fill="none" stroke="currentColor" strokeWidth="1"/>
    <rect x="22" y="12" width="9" height="5" rx="1" fill="none" stroke="currentColor" strokeWidth="1"/>
    <rect x="4" y="8" width="40" height="5" rx="1" fill="currentColor" opacity="0.12"/>
    <circle cx="18" cy="34" r="5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="18" cy="34" r="2" fill="currentColor"/>
    <circle cx="38" cy="34" r="5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="38" cy="34" r="2" fill="currentColor"/>
    <line x1="61" y1="23" x2="78" y2="23" stroke="currentColor" strokeWidth="1.8"/>
  </svg>
);

// ── Accordion section ─────────────────────────────────────────────────────────

function Accordion({ id, icon, title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`accord${open ? ' accord--open' : ''}`}>
      <button className="accord-head" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        {icon}
        <span className="accord-title">{title}</span>
        <span className={`accord-arrow${open ? ' accord-arrow--open' : ''}`}><IconChevron /></span>
      </button>
      {open && <div className="accord-body">{children}</div>}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function FilterSidebar({ cars = [], filters, onChange }) {
  // Derive unique option values from cars
  const makes = [...new Set(cars.map(c => c.meta?._car_make).filter(Boolean))].sort();
  const years  = [...new Set(cars.map(c => c.meta?._car_year).filter(Boolean))].sort((a, b) => b - a);

  const {
    vehicleType = null,
    make        = null,
    year        = null,
    priceMax    = 1000000,
    mileageMax  = 30,
  } = filters;

  const set = (key, val) => onChange({ ...filters, [key]: val });

  const activeTags = [
    vehicleType && { key: 'vehicleType', label: vehicleType === 'Camper' ? 'Husbilar' : 'Husvagnar' },
    make        && { key: 'make',        label: make },
    year        && { key: 'year',        label: year },
    priceMax < 1000000 && { key: 'priceMax', label: `Max ${(priceMax / 1000).toFixed(0)}k kr` },
    mileageMax < 30    && { key: 'mileageMax', label: `Max ${mileageMax} mil` },
  ].filter(Boolean);

  const clearTag = (key) => {
    const defaults = { vehicleType: null, make: null, year: null, priceMax: 1000000, mileageMax: 30 };
    onChange({ ...filters, [key]: defaults[key] });
  };

  const resetAll = () => onChange({ vehicleType: null, make: null, year: null, priceMax: 1000000, mileageMax: 30 });

  return (
    <aside className="filter-sidebar">

      {/* Active filter tags */}
      {activeTags.length > 0 && (
        <div className="sidebar-active-bar">
          {activeTags.map(tag => (
            <span key={tag.key} className="sidebar-tag">
              {tag.label}
              <button className="sidebar-tag__remove" onClick={() => clearTag(tag.key)} aria-label={`Ta bort ${tag.label}`}>×</button>
            </span>
          ))}
        </div>
      )}

      {/* Quick-pick vehicle type cards */}
      <div className="qp-grid">
        {[
          { type: 'Camper',  label: 'Husbilar',  Svg: CamperSVG },
          { type: 'Caravan', label: 'Husvagnar', Svg: CaravanSVG },
        ].map(({ type, label, Svg }) => (
          <button
            key={type}
            onClick={() => set('vehicleType', vehicleType === type ? null : type)}
            className={`qp-card${vehicleType === type ? ' qp-card--active' : ''}`}
            aria-pressed={vehicleType === type}
          >
            <Svg />
            <span className="qp-label">{label}</span>
          </button>
        ))}
      </div>

      {/* Price accordion */}
      <Accordion id="price" icon={<IconPrice />} title="Pris">
        <div className="range-row">
          <span className="range-min">0 kr</span>
          <input
            type="range"
            min={0}
            max={1000000}
            step={10000}
            value={priceMax}
            onChange={e => set('priceMax', parseInt(e.target.value, 10))}
            className="range-input"
            aria-label="Max pris"
          />
          <span className="range-val">{priceMax.toLocaleString('sv-SE')} kr</span>
        </div>
      </Accordion>

      {/* Brand accordion */}
      <Accordion id="make" icon={<IconShield />} title="Märke">
        <ul className="filter-opts" role="listbox" aria-label="Märke">
          {makes.map(m => (
            <li key={m}>
              <button
                role="option"
                aria-selected={make === m}
                onClick={() => set('make', make === m ? null : m)}
                className={`filter-opt${make === m ? ' filter-opt--active' : ''}`}
              >
                <span className="filter-opt__dot" />
                {m}
              </button>
            </li>
          ))}
        </ul>
      </Accordion>

      {/* Year accordion */}
      <Accordion id="year" icon={<IconCalendar />} title="Modellår">
        <ul className="filter-opts" role="listbox" aria-label="Modellår">
          {years.map(y => (
            <li key={y}>
              <button
                role="option"
                aria-selected={year === y}
                onClick={() => set('year', year === y ? null : y)}
                className={`filter-opt${year === y ? ' filter-opt--active' : ''}`}
              >
                <span className="filter-opt__dot" />
                {y}
              </button>
            </li>
          ))}
        </ul>
      </Accordion>

      {/* Mileage accordion */}
      <Accordion id="mileage" icon={<IconSpeedo />} title="Miltal">
        <div className="range-row">
          <span className="range-min">0 mil</span>
          <input
            type="range"
            min={0}
            max={30}
            step={1}
            value={mileageMax}
            onChange={e => set('mileageMax', parseInt(e.target.value, 10))}
            className="range-input"
            aria-label="Max miltal"
          />
          <span className="range-val">{mileageMax} mil</span>
        </div>
      </Accordion>

      <button className="sidebar-reset" onClick={resetAll}>Nollställ alla filter</button>

    </aside>
  );
}