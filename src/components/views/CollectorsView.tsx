import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_COLLECTORS, WASTE_CATEGORIES } from '../../data/mockData';
import { ScrapCollector, WasteCategoryId } from '../../types';
import {
  Star,
  MapPin,
  Phone,
  ShieldCheck,
  Calendar,
  Clock,
  Truck,
  Filter,
  ArrowUpDown,
  Search,
  CheckCircle2,
} from 'lucide-react';

export const CollectorsView: React.FC = () => {
  const {
    openScheduleModal,
    openCallModal,
    setViewingCollectorId,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
  } = useApp();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>(
    selectedCategoryFilter || 'all'
  );
  const [sortBy, setSortBy] = useState<'nearest' | 'rating' | 'available'>('nearest');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtering
  const filteredCollectors = INITIAL_COLLECTORS.filter((collector) => {
    // Search
    const matchesSearch =
      collector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collector.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collector.vehicleType.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    // Category
    if (activeCategoryFilter !== 'all') {
      const accepts = collector.acceptedCategories.includes(
        activeCategoryFilter as WasteCategoryId
      );
      if (!accepts) return false;
    }

    // Availability filter if chosen in sort
    if (sortBy === 'available' && !collector.availableToday) {
      return false;
    }

    return true;
  });

  // Sorting
  const sortedCollectors = [...filteredCollectors].sort((a, b) => {
    if (sortBy === 'nearest') return a.distanceKm - b.distanceKm;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'available') {
      if (a.availableToday === b.availableToday) return a.distanceKm - b.distanceKm;
      return a.availableToday ? -1 : 1;
    }
    return 0;
  });

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
            <span>Verified Local Network</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500 font-medium">Scrap Recyclers & Vendors</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Nearby Scrap Collectors
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
            Certified scrap collectors with calibrated digital scales, instant payment, and electric doorstep vehicles in your locality and neighborhood.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold self-start md:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>All 6 collectors identity-verified</span>
        </div>
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search collectors by name, street, or vehicle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
            </span>
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSortBy('nearest')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  sortBy === 'nearest'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Nearest First
              </button>
              <button
                type="button"
                onClick={() => setSortBy('rating')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  sortBy === 'rating'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Highest Rated
              </button>
              <button
                type="button"
                onClick={() => setSortBy('available')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  sortBy === 'available'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Available Today
              </button>
            </div>
          </div>

        </div>

        {/* Category Filters Bar */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mr-1 shrink-0">
            Accepts:
          </span>
          <button
            onClick={() => {
              setActiveCategoryFilter('all');
              setSelectedCategoryFilter(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeCategoryFilter === 'all'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Scrap Types
          </button>
          {WASTE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategoryFilter(cat.id);
                setSelectedCategoryFilter(cat.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategoryFilter === cat.id
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Collectors Cards Grid */}
      {sortedCollectors.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-base font-bold text-slate-900">
            No collectors found nearby. Try expanding your search area.
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try clearing the active filter or search keywords to view all certified local vendors.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setActiveCategoryFilter('all');
              setSortBy('nearest');
            }}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCollectors.map((collector) => {
            const acceptedNames = collector.acceptedCategories
              .map((id) => {
                const c = WASTE_CATEGORIES.find((cat) => cat.id === id);
                return c?.name || id;
              })
              .join(' · ');

            return (
              <div
                key={collector.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                          {collector.name}
                        </h3>
                        {collector.verified && (
                          <span title="Verified Scrap Collector">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          </span>
                        )}
                      </div>
                      
                      {/* Quiet Unboxed Metadata */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-1">
                        <span className="flex items-center gap-1 text-amber-600 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          {collector.rating}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums font-semibold text-slate-700">
                          {collector.distanceKm} km away
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{collector.experienceYears}y exp</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        collector.availableToday
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {collector.availableToday ? 'Available Today' : 'Opens Tomorrow'}
                    </span>
                  </div>

                  {/* Accepted Categories Preview */}
                  <div className="mt-3.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Accepts
                    </span>
                    <p className="font-semibold text-slate-800 line-clamp-1">
                      {acceptedNames}
                    </p>
                  </div>

                  {/* Details Snippet */}
                  <div className="mt-3.5 space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="truncate">{collector.address}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{collector.workingHours}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{collector.vehicleType}</span>
                    </div>
                  </div>
                </div>

                {/* 3 Action Buttons: Call, View Details, Schedule Pickup */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() =>
                      openCallModal({
                        name: collector.name,
                        phone: collector.phone,
                        role: 'Scrap Collector',
                        hours: collector.workingHours,
                      })
                    }
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                    title="Call Collector"
                    aria-label="Call"
                  >
                    <Phone className="w-4 h-4 text-emerald-700" />
                  </button>

                  <button
                    onClick={() => setViewingCollectorId(collector.id)}
                    className="flex-1 py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors text-center"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() =>
                      openScheduleModal({
                        type: 'collector',
                        id: collector.id,
                        name: collector.name,
                        phone: collector.phone,
                        address: collector.address,
                        defaultCategory:
                          activeCategoryFilter !== 'all' ? activeCategoryFilter : undefined,
                      })
                    }
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs text-center flex items-center justify-center gap-1"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Schedule</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
