// src/app/bilar/page.js
'use client';
import { useState } from 'react';
import CarCard from '@/components/CarCard';

export default function CarListingPage({ initialCars }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredCars = initialCars.filter(car => {
    if (activeFilter === 'all') return true;
    // This matches the ACF field or Category. Adjust based on your WP setup:
    return car.acf?.condition?.toLowerCase() === activeFilter; 
  });

  return (
    <main className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-black text-slate-900 mb-4">Vårt Lager</h1>
          
          {/* Filter Toggles */}
          <div className="flex justify-center gap-3 mt-8">
            {['all', 'nytt', 'begagnat'].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-8 py-2 rounded-full font-bold transition-all ${
                  activeFilter === f ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-500 border hover:bg-slate-100'
                }`}
              >
                {f === 'all' ? 'Alla' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map(car => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </main>
  );
}