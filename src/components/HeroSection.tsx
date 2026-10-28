import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Recycle,
  Coins,
  Clock,
  MapPin,
  ChevronRight,
  Calculator,
} from 'lucide-react';
import { WASTE_CATEGORIES } from '../data/mockData';

export const HeroSection: React.FC = () => {
  const { setActiveTab, setIsAddWasteModalOpen, openScheduleModal, setSelectedCategoryFilter } = useApp();
  const [activeHeroCat, setActiveHeroCat] = useState<'plastic' | 'paper' | 'metal' | 'ewaste'>('plastic');
  const [demoWeight, setDemoWeight] = useState<number>(6);

  const heroStats = [
    { label: 'Items Recycled', value: '10K+', helper: 'Clean material diverted' },
    { label: 'Donations Facilitated', value: '5K+', helper: 'Books, clothes & essentials' },
    { label: 'Active Households & Users', value: '2K+', helper: 'Across 14 neighborhoods' },
    { label: 'Verified Collectors & NGOs', value: '100+', helper: 'Doorstep pickup fleet' },
  ];

  const currentCat = WASTE_CATEGORIES.find((c) => c.id === activeHeroCat) || WASTE_CATEGORIES[0];
  const calculatedVal = Math.round(demoWeight * currentCat.pricePerKg);

  return (
    <section className="relative overflow-hidden pt-8 pb-14 lg:pt-14 lg:pb-20 border-b border-slate-200 bg-white">
      {/* Background ambient accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-50/60 via-slate-50/40 to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Tagline kicker */}
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Doorstep Household & Community Waste Management</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-500 font-medium">Recycle · Donate · Earn · Repeat</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] text-balance">
              Turn Your Waste <br className="hidden sm:inline" />
              <span className="text-emerald-600">Into Worth.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl text-balance">
              Sell recyclable household waste to verified local collectors, donate reusable items to partner NGOs, schedule seamless doorstep pickups, and redeem earned RELIVE points for real vouchers.
            </p>

            {/* CTA Button Group */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('sell');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap"
              >
                <span>Sell / Recycle Waste</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('donate');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap shadow-sm"
              >
                <HeartHandshake className="w-4 h-4 text-emerald-400" />
                <span>Donate Items</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAddWasteModalOpen(true)}
                className="py-3.5 px-5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-800 font-semibold text-sm transition-colors text-center whitespace-nowrap"
              >
                + List an Item
              </button>
            </div>

            {/* Trust Markers */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Verified Digital Scale Weighing
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Instant Cash or UPI Payout
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Voucher Rewards Program
              </span>
            </div>

          </div>

          {/* Right Column: High-Impact Modern Startup Dashboard Visual (NO PHOTO IMAGE) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white p-6 sm:p-7 space-y-5">
              
              {/* Card Header & Live Status */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                    <Recycle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white tracking-wide">
                      Doorstep Waste-to-Worth Hub
                    </h3>
                    <p className="text-[10px] text-emerald-300">Live Household Scrap & Donation Loop</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Doorstep Service Live</span>
                </div>
              </div>

              {/* Interactive Value Estimator Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold uppercase text-[10px] tracking-wider">
                    Instant Value Estimator
                  </span>
                  <span className="text-emerald-300 font-bold tabular-nums">
                    ₹{currentCat.pricePerKg}/kg benchmark
                  </span>
                </div>

                {/* Quick Category Tabs */}
                <div className="grid grid-cols-4 gap-1.5">
                  {(['plastic', 'paper', 'metal', 'ewaste'] as const).map((catId) => (
                    <button
                      key={catId}
                      type="button"
                      onClick={() => setActiveHeroCat(catId)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold capitalize transition-all ${
                        activeHeroCat === catId
                          ? 'bg-emerald-500 text-slate-950 shadow-xs'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {catId === 'ewaste' ? 'E-Waste' : catId}
                    </button>
                  ))}
                </div>

                {/* Weight slider */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Weight:</span>
                    <span className="font-extrabold text-white tabular-nums">{demoWeight} kg</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={demoWeight}
                    onChange={(e) => setDemoWeight(parseInt(e.target.value) || 1)}
                    className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-white/20 rounded-lg"
                  />
                </div>

                {/* Dynamic Calculated Bar */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Estimated Doorstep Value
                    </span>
                    <span className="text-2xl font-black text-white tabular-nums">
                      ₹{calculatedVal}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCategoryFilter(activeHeroCat);
                      setActiveTab('collectors');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="py-2 px-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Book Pickup</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Recent Real-time Activity Card */}
              <div className="bg-slate-900/90 rounded-2xl p-4 border border-white/5">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-white/5 font-semibold">
                  <span className="text-emerald-400 flex items-center gap-1.5 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Recent Doorstep Collection
                  </span>
                  <span className="text-slate-400 text-[10px] tabular-nums">Just now</span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      8.5 kg Cardboard & Newspaper
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Collected by GreenCycle Express · Sector 15
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-emerald-400 tabular-nums block">
                      +₹102 Payout
                    </span>
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 border border-amber-500/20 px-1.5 py-0.5 rounded">
                      +30 RELIVE Pts
                    </span>
                  </div>
                </div>

                {/* Live Steps Micro-indicator */}
                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> Digital Scale Verified
                  </span>
                  <span>Instant UPI Settlement</span>
                </div>
              </div>

            </div>

            {/* Clean Floating pill teaser */}
            <div className="hidden sm:flex absolute -top-3 -left-3 bg-white px-3.5 py-2 rounded-xl shadow-md border border-slate-200 items-center gap-2 text-slate-900">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                ₹
              </div>
              <div className="text-left text-xs">
                <p className="font-bold text-slate-900">Household Scrap to Worth</p>
                <p className="text-[10px] text-slate-500">Zero commission doorstep pickup</p>
              </div>
            </div>
          </div>

        </div>

        {/* Demo Statistics Strip */}
        <div className="mt-12 lg:mt-16 pt-8 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-6">
          {heroStats.map((stat, idx) => (
            <div key={idx} className="flex flex-col">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                {stat.value}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
                {stat.label}
              </span>
              <span className="text-xs text-slate-400 mt-0.5">
                {stat.helper}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
