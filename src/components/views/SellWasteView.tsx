import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WASTE_CATEGORIES } from '../../data/mockData';
import { WasteCalculator } from '../WasteCalculator';
import { WasteCategoryId } from '../../types';
import {
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileCheck2,
  Sparkles,
} from 'lucide-react';

export const SellWasteView: React.FC = () => {
  const { setActiveTab, setSelectedCategoryFilter, setIsAddWasteModalOpen } = useApp();
  const [activeCategoryId, setActiveCategoryId] = useState<WasteCategoryId>('plastic');

  const handleSelectCategory = (catId: WasteCategoryId) => {
    setActiveCategoryId(catId);
    // Smooth scroll to calculator
    const calcEl = document.getElementById('scrap-calculator');
    if (calcEl) {
      calcEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
          <span>Doorstep Scrap Resale</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500 font-medium">Verified Household & Doorstep Rates</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Sell Your Waste
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed text-balance">
          “Give your waste a value instead of sending it to a landfill.”
          Sort recyclables, calculate instant market value, and connect with certified local scrap dealers for doorstep pickup and instant cash or UPI payouts.
        </p>
      </div>

      {/* Categories Grid */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Scrap Material Rates & Categories
            </h2>
            <p className="text-xs text-slate-500">
              Click any card to populate the calculator below with live benchmark rates
            </p>
          </div>
          <button
            onClick={() => setIsAddWasteModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
          >
            <span>Have custom scrap? List here</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {WASTE_CATEGORIES.map((cat) => {
            const isSelected = activeCategoryId === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">{cat.name}</span>
                    <span className="text-xs font-black text-emerald-700 tabular-nums bg-emerald-100/60 px-2 py-0.5 rounded-md">
                      ₹{cat.pricePerKg}/kg
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate max-w-[120px]">{cat.exampleItems[0]}</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-0.5">
                    Calculate <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Calculator Section */}
      <section id="scrap-calculator">
        <WasteCalculator initialCategory={activeCategoryId} />
      </section>

      {/* Value Optimization Tips */}
      <section className="bg-slate-100/70 rounded-2xl p-6 sm:p-8 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          Tips to Get Maximum Scrap Value from Your Home
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mb-6">
          Scrap collectors provide peak rates when materials are sorted, clean, and segregated from organic waste.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs mb-2">
              01
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Keep Dry & Flattened</h4>
            <p className="text-xs text-slate-600">
              Flatten delivery cardboard boxes and crush plastic bottles. Wet or dirty paper drops the valuation significantly.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs mb-2">
              02
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Separate High-Value E-Waste</h4>
            <p className="text-xs text-slate-600">
              Motherboards, copper cables, and broken electronic batteries command up to ₹80/kg. Store them separately in dry boxes.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs mb-2">
              03
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Combine Household or Society Lots</h4>
            <p className="text-xs text-slate-600">
              Collectors offer doorstep pickup free of charge for combined lots above 5–10 kg. Pool with neighbors for bonus points!
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
