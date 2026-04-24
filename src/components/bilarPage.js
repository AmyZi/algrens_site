'use client';
import '@/styles/custom.scss';
import '@/styles/bilarPage.css';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import VehicleGrid from '@/components/VehicleGrid';

// ── Icons ─────────────────────────────────────────────────────

const SvgSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const SvgSliders = () => (
  <svg width="15" height="15" viewBox="0 0 512 512" fill="currentColor" aria-hidden="true">
    <path d="M0 416C0 402.7 10.75 392 24 392H83.66C93.86 359.5 124.2 336 160 336C195.8 336 226.1 359.5 236.3 392H488C501.3 392 512 402.7 512 416C512 429.3 501.3 440 488 440H236.3C226.1 472.5 195.8 496 160 496C124.2 496 93.86 472.5 83.66 440H24C10.75 440 0 429.3 0 416zM352 176C387.8 176 418.1 199.5 428.3 232H488C501.3 232 512 242.7 512 256C512 269.3 501.3 280 488 280H428.3C418.1 312.5 387.8 336 352 336C316.2 336 285.9 312.5 275.7 280H24C10.75 280 0 269.3 0 256C0 242.7 10.75 232 24 232H275.7C285.9 199.5 316.2 176 352 176zM488 72C501.3 72 512 82.75 512 96C512 109.3 501.3 120 488 120H268.3C258.1 152.5 227.8 176 192 176C156.2 176 125.9 152.5 115.7 120H24C10.75 120 0 109.3 0 96C0 82.75 10.75 72 24 72H115.7C125.9 39.54 156.2 16 192 16C227.8 16 258.1 39.54 268.3 72H488z"/>
  </svg>
);

const SvgEyeSlash = () => (
  <svg width="15" height="15" viewBox="0 0 640 512" fill="currentColor" aria-hidden="true">
    <path d="M150.7 92.77C195 58.27 251.8 32 320 32C400.8 32 465.5 68.84 512.6 112.6C559.4 156 590.7 207.1 605.5 243.7C608.8 251.6 608.8 260.4 605.5 268.3C592.1 300.6 565.2 346.1 525.6 386.7L630.8 469.1C641.2 477.3 643.1 492.4 634.9 502.8C626.7 513.2 611.6 515.1 601.2 506.9L9.196 42.89C-1.236 34.71-3.065 19.63 5.112 9.196C13.29-1.236 28.37-3.065 38.81 5.112L150.7 92.77z"/>
  </svg>
);

const SvgTrash = () => (
  <svg width="14" height="14" viewBox="0 0 448 512" fill="currentColor" aria-hidden="true">
    <path d="M160 400C160 408.8 152.8 416 144 416C135.2 416 128 408.8 128 400V192C128 183.2 135.2 176 144 176C152.8 176 160 183.2 160 192V400zM317.5 24.94L354.2 80H424C437.3 80 448 90.75 448 104C448 117.3 437.3 128 424 128H416V432C416 476.2 380.2 512 336 512H112C67.82 512 32 476.2 32 432V128H24C10.75 128 0 117.3 0 104C0 90.75 10.75 80 24 80H93.82L130.5 24.94z"/>
  </svg>
);

const SvgChevron = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const SvgGridView = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);

const SvgListView = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <circle cx="3" cy="18" r="1.2" fill="currentColor" stroke="none"/>
  </svg>
);

// ── Configuration ─────────────────────────────────────────────

const VEHICLE_TYPES = [
  { key: 'Camper',  label: 'Husbilar' },
  { key: 'Caravan', label: 'Husvagnar' },
  { key: 'MC',      label: 'MC' },
];

const BODY_TYPE_OPTIONS = {
  Camper: [
    { key: 'Husbil-halvintegrerad', label: 'HALVINTEGRERAD', imgUrl: 'https://res.cloudinary.com/dh1zzn3o4/image/upload/v1776255235/semi-integrated_s2haxe.svg' },
    { key: 'Husbil-integrerad',     label: 'INTEGRERAD',     imgUrl: 'https://res.cloudinary.com/dh1zzn3o4/image/upload/v1776255252/fully-integrated_wujgh1.svg' },
    { key: 'Husbil-alkov',          label: 'ALKOV',          imgUrl: 'https://res.cloudinary.com/dh1zzn3o4/image/upload/v1776255215/alcove_e3tv4b.svg' },
  ],
  Caravan: [
    { key: 'Husvagn, 1-axl',  label: 'ENKELAXLAD',  imgUrl: 'https://res.cloudinary.com/dh1zzn3o4/image/upload/v1776255304/single-shaft_iqi15v.svg' },
    { key: 'Husvagn, 2-axl',  label: 'DUBBELAXLAD', imgUrl: 'https://res.cloudinary.com/dh1zzn3o4/image/upload/v1776255273/double-shaft_yaku1g.svg' },
  ],
  MC: [
    { key: 'Touring/Landsväg', label: 'TOURING', imgUrl: 'https://res.cloudinary.com/dh1zzn3o4/image/upload/v1776364367/touring_mc_glfwy5.svg' },
    { key: 'Sport',            label: 'SPORT',   imgUrl: 'https://res.cloudinary.com/dh1zzn3o4/image/upload/v1776364239/sport_mc_aihyft.svg' },
  ],
};

const BODY_TYPE_LABELS = {
  'Husbil-halvintegrerad': 'Halvintegrerad',
  'Husbil-integrerad':     'Integrerad',
  'Husbil-alkov':          'Alkov',
  'Husvagn, 1-axl':        'Enkelaxlad',
  'Husvagn, 2-axl':        'Dubbelaxlad',
  'Touring/Landsväg':      'Touring',
};

const PRICE_RANGE_OPTIONS = ['Under 100 000', '100 000–300 000', '300 000–500 000', 'Över 500 000'];

const SORT_OPTIONS = [
  { key: 'newest',     label: 'Senaste' },
  { key: 'price_asc',  label: 'Lägst pris' },
  { key: 'price_desc', label: 'Högst pris' },
];

// ── Sub-components ────────────────────────────────────────────

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="fs-group">
      <label className="fs-label">{label}</label>
      <div className="fs-wrap">
        <select value={value} onChange={e => onChange(e.target.value)} className="fs-select">
          <option value="all">Alla</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <span className="fs-chevron"><SvgChevron /></span>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────

export default function BilarPage({ cars, initialFilter = 'all' }) {
  const parseNum = (v) => v ? parseInt(v, 10) : 0;
  const baseCars = useMemo(() => cars.filter(c => c.meta), [cars]);

  // activeType drives which body icons show — defaults to 'Camper' for display.
  // typeSelected tracks whether the user has deliberately clicked a type tab.
  // Type filtering only applies when the user has explicitly chosen a type.
  const [activeType,    setActiveType]    = useState('Camper');
  const [typeSelected,  setTypeSelected]  = useState(false);
  const [activeBody,   setActiveBody]   = useState(null);
  const [condition,    setCondition]    = useState(
    initialFilter === 'new' ? 'new' : initialFilter === 'used' ? 'used' : 'all'
  );
  const [sort,         setSort]         = useState('newest');
  const [viewMode,     setViewMode]     = useState('grid');
  const [showFilters,  setShowFilters]  = useState(false);
  const [search,       setSearch]       = useState('');
  const [currentPage,  setCurrentPage]  = useState(1);
  const [filterMake,   setFilterMake]   = useState('all');
  const [filterYear,   setFilterYear]   = useState('all');
  const [filterPrice,  setFilterPrice]  = useState('all');
  const [filterWeight, setFilterWeight] = useState('all');
  const [filterPlan,   setFilterPlan]   = useState('all');

  const currentBodyIcons = useMemo(() => BODY_TYPE_OPTIONS[activeType] ?? [], [activeType]);

  const makeOptions   = useMemo(() => [...new Set(baseCars.map(c => c.meta?._car_make).filter(Boolean))].sort(), [baseCars]);
  const yearOptions   = useMemo(() => [...new Set(baseCars.map(c => c.meta?._car_year).filter(Boolean))].sort((a, b) => b - a), [baseCars]);
  const weightOptions = useMemo(() => [...new Set(baseCars.map(c => c.meta?._car_total_weight).filter(Boolean))].sort(), [baseCars]);
  const planOptions   = useMemo(() => [...new Set(baseCars.map(c => BODY_TYPE_LABELS[c.meta?._car_body_type]).filter(Boolean))].sort(), [baseCars]);

  // Nollställ is active if anything beyond the default state is set
  const hasActiveFilters = activeBody || condition !== 'all' ||
    search !== '' || filterMake !== 'all' || filterYear !== 'all' ||
    filterPrice !== 'all' || filterWeight !== 'all' || filterPlan !== 'all';

  function resetAll() {
    setTypeSelected(false); setActiveBody(null); setCondition('all'); setSearch('');
    setFilterMake('all'); setFilterYear('all');
    setFilterPrice('all'); setFilterWeight('all'); setFilterPlan('all');
    setCurrentPage(1);
  }

  const filteredCars = useMemo(() => {
    const q = search.toLowerCase().trim();

    // Only filter by vehicle type if the user explicitly clicked a type tab
    const result = baseCars.filter(car => {
      const m = car.meta;
      if (typeSelected && activeType && m._car_vehicle_type && m._car_vehicle_type !== activeType) return false;
      if (activeBody && m._car_body_type !== activeBody) return false;
      if (condition === 'new'  && m._car_is_new !== 'yes') return false;
      if (condition === 'used' && m._car_is_new === 'yes') return false;
      if (filterMake   !== 'all' && m._car_make         !== filterMake)   return false;
      if (filterYear   !== 'all' && m._car_year         !== filterYear)   return false;
      if (filterWeight !== 'all' && m._car_total_weight !== filterWeight) return false;
      if (filterPlan   !== 'all' && BODY_TYPE_LABELS[m._car_body_type] !== filterPlan) return false;
      if (filterPrice  !== 'all') {
        const p = parseNum(m._car_price);
        if (filterPrice === 'Under 100 000'      && p >= 100000)               return false;
        if (filterPrice === '100 000–300 000'    && (p < 100000 || p > 300000)) return false;
        if (filterPrice === '300 000–500 000'    && (p < 300000 || p > 500000)) return false;
        if (filterPrice === 'Över 500 000'       && p <= 500000)               return false;
      }
      if (q && !car.title?.rendered?.toLowerCase().includes(q) &&
               !(m._car_make  ?? '').toLowerCase().includes(q) &&
               !(m._car_model ?? '').toLowerCase().includes(q)) return false;
      return true;
    });

    return result.sort((a, b) => {
      if (sort === 'price_asc')  return parseNum(a.meta._car_price) - parseNum(b.meta._car_price);
      if (sort === 'price_desc') return parseNum(b.meta._car_price) - parseNum(a.meta._car_price);
      return new Date(b.date) - new Date(a.date);
    });
  }, [baseCars, activeType, typeSelected, activeBody, condition, search, filterMake, filterYear, filterPrice, filterWeight, filterPlan, sort, initialFilter]);

  const totalPages      = Math.ceil(filteredCars.length / 12);
  const currentVehicles = filteredCars.slice((currentPage - 1) * 12, currentPage * 12);

  const goTo = (page) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <div className="container py-5 mt-5 listings-page">

      {/* BREADCRUMB */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb" style={{ fontSize: '0.85rem' }}>
          <li className="breadcrumb-item"><Link href="/" className="link-subtle">Hem</Link></li>
          <li className="breadcrumb-item active fw-bold">Lager</li>
        </ol>
      </nav>

      {/* ── ROW 1: Vehicle type tabs + body type icon cards ── */}
      <div className="lp-type-row">
        <div className="lp-type-left">
          <span className="lp-type-label">Välj fordonstyp:</span>
          <div className="status-seg" role="group" aria-label="Fordonstyp">
            {VEHICLE_TYPES.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setActiveType(key); setTypeSelected(true); setActiveBody(null); setCurrentPage(1); }}
                className={`status-btn${activeType === key ? ' status-btn--active' : ''}`}
              >{label}</button>
            ))}
          </div>
        </div>

        <div className="lp-body-icons">
          {currentBodyIcons.map(({ key, label, imgUrl }) => (
            <button
              key={key}
              onClick={() => { setActiveBody(prev => prev === key ? null : key); setCurrentPage(1); }}
              className={`body-icon-btn${activeBody === key ? ' body-icon-btn--active' : ''}${activeBody && activeBody !== key ? ' body-icon-btn--dim' : ''}`}
              aria-pressed={activeBody === key}
            >
              <div className="body-icon-btn__svg">
                <img src={imgUrl} alt="" width="60" height="30" loading="lazy" role="presentation" />
              </div>
              <span className="body-icon-btn__label">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── ROW 2: Condition + Search ── */}
      <div className="lp-filter-row">
        <div className="status-seg" role="group" aria-label="Status">
          {[['all','Alla'],['new','Nya'],['used','Begagnade']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => { setCondition(key); setCurrentPage(1); }}
              className={`status-btn${condition === key ? ' status-btn--active' : ''}`}
            >{label}</button>
          ))}
        </div>

        <div className="lp-search">
          <span className="lp-search__icon"><SvgSearch /></span>
          <input
            type="text"
            className="lp-search__input"
            placeholder="Sök märke eller modell..."
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            aria-label="Sök fordon"
          />
        </div>
      </div>

      {/* ── ROW 3: Extended filter grid (toggleable) ── */}
      {showFilters && (
        <div className="filter-grid-primary">
          <FilterSelect label="PRIS"        value={filterPrice}  onChange={v => { setFilterPrice(v);  setCurrentPage(1); }} options={PRICE_RANGE_OPTIONS} />
          <FilterSelect label="PLANLÖSNING" value={filterPlan}   onChange={v => { setFilterPlan(v);   setCurrentPage(1); }} options={planOptions} />
          <FilterSelect label="MÄRKE"       value={filterMake}   onChange={v => { setFilterMake(v);   setCurrentPage(1); }} options={makeOptions} />
          <FilterSelect label="MODELLÅR"    value={filterYear}   onChange={v => { setFilterYear(v);   setCurrentPage(1); }} options={yearOptions} />
          <FilterSelect label="TOTALVIKT"   value={filterWeight} onChange={v => { setFilterWeight(v); setCurrentPage(1); }} options={weightOptions} />
        </div>
      )}

      {/* ── ROW 4: Filter actions ── */}
      <div className="filter-actions">
        <div className="filter-actions__left">
          <button className="faction-btn" onClick={() => setShowFilters(v => !v)} aria-expanded={showFilters}>
            {showFilters ? <SvgEyeSlash /> : <SvgSliders />}
            <span>{showFilters ? 'Dölj filter' : 'Visa fler filter'}</span>
          </button>
          <button
            className={`faction-btn faction-btn--reset${!hasActiveFilters ? ' faction-btn--disabled' : ''}`}
            onClick={resetAll}
            disabled={!hasActiveFilters}
          >
            <SvgTrash />
            <span>Nollställ filter</span>
          </button>
        </div>
      </div>

      {/* ── ROW 5: Sort + results count + view toggle ── */}
      <div className="results-toolbar">
        <div className="sort-pills">
          <span className="sort-pills__label">Sortera:</span>
          {SORT_OPTIONS.map(o => (
            <button
              key={o.key}
              onClick={() => { setSort(o.key); setCurrentPage(1); }}
              className={`sort-pill${sort === o.key ? ' sort-pill--active' : ''}`}
            >{o.label}</button>
          ))}
        </div>
        <div className="results-right">
          <span className="results-count">{filteredCars.length} fordon</span>
          <div className="view-toggle">
            <button onClick={() => setViewMode('list')} className={`view-btn${viewMode === 'list' ? ' view-btn--active' : ''}`} aria-label="Listvy"><SvgListView /></button>
            <button onClick={() => setViewMode('grid')} className={`view-btn${viewMode === 'grid' ? ' view-btn--active' : ''}`} aria-label="Rutnätsvy"><SvgGridView /></button>
          </div>
        </div>
      </div>

      {/* ── VEHICLE GRID ── */}
      <VehicleGrid vehicles={currentVehicles} viewMode={viewMode} onClearFilters={resetAll} />

      {/* ── PAGINATION ── */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1} className="pagination-btn" aria-label="Föregående">←</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button key={page} onClick={() => goTo(page)} className={`pagination-btn${currentPage === page ? ' pagination-btn--active' : ''}`}>{page}</button>
          ))}
          <button onClick={() => goTo(currentPage + 1)} disabled={currentPage === totalPages} className="pagination-btn" aria-label="Nästa">→</button>
        </div>
      )}

    </div>
  );
}