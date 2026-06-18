'use client';

import { useState, useMemo, useEffect } from 'react';
import CarCard from '@/components/CarCard';

const INITIAL_COUNT = 10;
const LOAD_MORE_COUNT = 10;

export default function VehicleGrid({ vehicles = [], onClearFilters, viewMode = 'grid' }) {

  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  // Sort sold to end
  const sorted = useMemo(() => [
    ...vehicles.filter(v => v.meta?._car_is_sold !== 'yes'),
    ...vehicles.filter(v => v.meta?._car_is_sold === 'yes'),
  ], [vehicles]);

  const visible   = sorted.slice(0, visibleCount);
  const hasMore   = visibleCount < sorted.length;
  const remaining = sorted.length - visibleCount;

  const loadMore = () => setVisibleCount(c => c + LOAD_MORE_COUNT);

  // Reset when vehicles prop changes (filter applied)
  useEffect(() => {
    setVisibleCount(INITIAL_COUNT);
  }, [vehicles]);

  // Empty state
  if (sorted.length === 0) {
    return (
      <div className="vgrid-empty">
        <p className="vgrid-empty__msg">Inga fordon hittades.</p>
        {onClearFilters && (
          <button className="vgrid-empty__reset" onClick={onClearFilters}>
            Nollställ filter
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="vgrid-wrap">

      <div className={`vgrid${viewMode === 'list' ? ' vgrid--list' : ''}`}>
        {visible.map((car, i) => (
          <div
            key={car.id}
            className="vgrid-item"
            style={{ animationDelay: `${(i % INITIAL_COUNT) * 55}ms` }}
          >
            <CarCard car={car} viewMode={viewMode} />
          </div>
        ))}
      </div>

    </div>
  );
}