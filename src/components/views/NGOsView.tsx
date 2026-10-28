import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_NGOS, DONATION_CATEGORIES } from '../../data/mockData';
import { DonationCategoryId } from '../../types';
import {
  Heart,
  Star,
  MapPin,
  Phone,
  ShieldCheck,
  Gift,
  Clock,
  Filter,
  Search,
  CheckCircle2,
  Building2,
} from 'lucide-react';

export const NGOsView: React.FC = () => {
  const {
    openScheduleModal,
    openCallModal,
    setViewingNgoId,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>(
    selectedCategoryFilter || 'all'
  );
  const [pickupOnly, setPickupOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [maxDistance, setMaxDistance] = useState<number>(5);

  const filteredNgos = INITIAL_NGOS.filter((ngo) => {
    // Search
    const matchesSearch =
      ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.cause.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.address.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    // Category
    if (activeCategory !== 'all') {
      const accepts = ngo.acceptedCategories.includes(
        activeCategory as DonationCategoryId
      );
      if (!accepts) return false;
    }

    // Pickup
    if (pickupOnly && !ngo.pickupAvailable) return false;

    // Distance
    if (ngo.distanceKm > maxDistance) return false;

    return true;
  });

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-800 uppercase tracking-wider mb-2">
            <span>Verified Non-Profit Partners</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500 font-medium">Community Impact & Shelters</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Nearby NGOs & Donation Drives
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
            Pass on reusable textbooks, clean clothes, study toys, and gadgets directly to verified grassroots organizations helping children and families.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 text-xs font-semibold self-start md:self-auto">
          <Heart className="w-4 h-4 text-teal-600 fill-teal-600" />
          <span>Doorstep pickup available for all households</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search NGOs by name, cause, or locality..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                checked={pickupOnly}
                onChange={(e) => setPickupOnly(e.target.checked)}
                className="rounded accent-teal-600"
              />
              <span>Doorstep Pickup Available</span>
            </label>

            <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-semibold">Max Distance:</span>
              <span className="font-bold text-slate-900 tabular-nums">{maxDistance} km</span>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={maxDistance}
                onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
                className="w-20 accent-teal-600 cursor-pointer"
              />
            </div>
          </div>

        </div>

        {/* Categories Bar */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mr-1 shrink-0">
            Accepting:
          </span>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSelectedCategoryFilter(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeCategory === 'all'
                ? 'bg-teal-700 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Items
          </button>
          {DONATION_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSelectedCategoryFilter(cat.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* NGOs Cards Grid */}
      {filteredNgos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-base font-bold text-slate-900">
            No NGOs found matching your criteria
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try expanding your distance slider or resetting filters to see all partner organizations.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setActiveCategory('all');
              setPickupOnly(false);
              setMaxDistance(10);
            }}
            className="mt-4 px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNgos.map((ngo) => {
            const acceptedNames = ngo.acceptedCategories
              .map((id) => {
                const c = DONATION_CATEGORIES.find((cat) => cat.id === id);
                return c?.name || id;
              })
              .join(' · ');

            return (
              <div
                key={ngo.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                          {ngo.name}
                        </h3>
                        {ngo.verified && (
                          <span title="Verified Non-Profit">
                            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                          </span>
                        )}
                      </div>
                      
                      {/* Quiet Unboxed Metadata */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-1">
                        <span className="flex items-center gap-1 text-amber-600 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          {ngo.rating}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums font-semibold text-slate-700">
                          {ngo.distanceKm} km away
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{ngo.reviewsCount} donors</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ngo.pickupAvailable
                          ? 'bg-teal-50 text-teal-800 border border-teal-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {ngo.pickupAvailable ? 'Pickup Available' : 'Center Drop-off'}
                    </span>
                  </div>

                  {/* Mission */}
                  <p className="text-xs font-semibold text-teal-900 bg-teal-50/60 p-2.5 rounded-xl border border-teal-100 line-clamp-2">
                    “{ngo.cause}”
                  </p>

                  {/* Accepted Categories Preview */}
                  <div className="mt-3 text-xs text-slate-600">
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
                      <span className="truncate">{ngo.address}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{ngo.workingHours}</span>
                    </div>
                  </div>
                </div>

                {/* 3 Action Buttons: Call NGO, View Details, Donate Now */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() =>
                      openCallModal({
                        name: ngo.name,
                        phone: ngo.phone,
                        role: 'NGO Volunteer Coordinator',
                        hours: ngo.workingHours,
                      })
                    }
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                    title="Call NGO Hotline"
                    aria-label="Call"
                  >
                    <Phone className="w-4 h-4 text-teal-700" />
                  </button>

                  <button
                    onClick={() => setViewingNgoId(ngo.id)}
                    className="flex-1 py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors text-center"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() =>
                      openScheduleModal({
                        type: 'ngo',
                        id: ngo.id,
                        name: ngo.name,
                        phone: ngo.phone,
                        address: ngo.address,
                        defaultCategory:
                          activeCategory !== 'all' ? activeCategory : undefined,
                      })
                    }
                    className="flex-1 py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs text-center flex items-center justify-center gap-1"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>Donate Now</span>
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
