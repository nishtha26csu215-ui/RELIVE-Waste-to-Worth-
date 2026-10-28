import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WASTE_CATEGORIES } from '../data/mockData';
import { WasteCategoryId } from '../types';
import { Calculator, ArrowRight, Minus, Plus, Info, Sparkles, CheckCircle2 } from 'lucide-react';

interface WasteCalculatorProps {
  initialCategory?: WasteCategoryId;
  compact?: boolean;
}

export const WasteCalculator: React.FC<WasteCalculatorProps> = ({
  initialCategory = 'plastic',
  compact = false,
}) => {
  const { setActiveTab, setSelectedCategoryFilter, openScheduleModal, setIsAddWasteModalOpen } = useApp();
  const [selectedCategoryId, setSelectedCategoryId] = useState<WasteCategoryId>(initialCategory);
  const [weightKg, setWeightKg] = useState<number>(5);

  const selectedCategory =
    WASTE_CATEGORIES.find((cat) => cat.id === selectedCategoryId) || WASTE_CATEGORIES[0];

  const estimatedValue = Math.round(weightKg * selectedCategory.pricePerKg);
  const estimatedCo2 = (weightKg * selectedCategory.co2SavedPerKg).toFixed(1);

  // Approximate points earned
  let pointsPreview = 15;
  if (weightKg <= 2) pointsPreview = 5;
  else if (weightKg <= 5) pointsPreview = 15;
  else if (weightKg <= 10) pointsPreview = 30;
  else if (weightKg <= 20) pointsPreview = 60;
  else pointsPreview = 100;

  const handleIncrement = (amount: number) => {
    setWeightKg((prev) => Math.max(0.5, Math.min(250, Number((prev + amount).toFixed(1)))));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeightKg(parseFloat(e.target.value));
  };

  const handleFindCollectors = () => {
    setSelectedCategoryFilter(selectedCategoryId);
    setActiveTab('collectors');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-sm ${compact ? 'p-5' : 'p-6 sm:p-8'}`}>
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Interactive Scrap Calculator
            </h3>
            <p className="text-xs text-slate-500">
              Calculate instant resale value & potential RELIVE points
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-lg text-emerald-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verified Scrap Rates</span>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {/* Category Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Select Waste Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {WASTE_CATEGORIES.map((cat) => {
              const isSelected = cat.id === selectedCategoryId;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`px-3 py-2.5 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/80 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <span className={`font-bold ${isSelected ? 'text-emerald-950' : 'text-slate-800'}`}>
                    {cat.name}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 tabular-nums mt-1">
                    ₹{cat.pricePerKg}/kg
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Weight Controls */}
        <div className="bg-slate-50/80 rounded-xl p-4 sm:p-5 border border-slate-200/70">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Estimated Weight
              </label>
              <p className="text-xs text-slate-500 mt-0.5">
                Adjust with buttons or enter kilograms
              </p>
            </div>

            {/* Stepper + Input */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleIncrement(-1)}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold transition-colors active:scale-95 shadow-xs"
                aria-label="Decrease weight by 1 kg"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="relative">
                <input
                  type="number"
                  min="0.5"
                  max="250"
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setWeightKg(isNaN(val) ? 0.5 : Math.max(0.1, Math.min(500, val)));
                  }}
                  className="w-24 h-10 text-center font-bold text-slate-900 bg-white border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums shadow-xs"
                />
                <span className="absolute right-2 top-2.5 text-xs font-medium text-slate-400 pointer-events-none">
                  kg
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleIncrement(1)}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold transition-colors active:scale-95 shadow-xs"
                aria-label="Increase weight by 1 kg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Slider */}
          <div className="mt-4 pt-3 border-t border-slate-200/50">
            <input
              type="range"
              min="0.5"
              max="50"
              step="0.5"
              value={weightKg}
              onChange={handleSliderChange}
              className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1 tabular-nums font-medium">
              <span>0.5 kg (Small bag)</span>
              <span>15 kg (Room cleanup)</span>
              <span>30 kg (Hostel haul)</span>
              <span>50+ kg (Bulk)</span>
            </div>
          </div>
        </div>

        {/* Dynamic Calculation Result Card */}
        <div className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-7 relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-44 h-44 rounded-full bg-emerald-600/20 blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            {/* Primary Value */}
            <div className="sm:col-span-2">
              <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold block">
                Estimated Value ({selectedCategory.name})
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl sm:text-5xl font-extrabold tracking-tight tabular-nums text-white">
                  ₹{estimatedValue.toLocaleString()}
                </span>
                <span className="text-xs text-emerald-300 font-normal">
                  ({weightKg} kg × ₹{selectedCategory.pricePerKg}/kg)
                </span>
              </div>

              {/* Eco & Points Sub-stats */}
              <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-emerald-800/80 text-xs text-emerald-200">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    <strong className="text-white tabular-nums">+{pointsPreview}</strong> RELIVE Points
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong className="text-white tabular-nums">~{estimatedCo2} kg</strong> CO₂ Diverted
                  </span>
                </div>
              </div>
            </div>

            {/* CTA action */}
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleFindCollectors}
                className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm active:scale-95 whitespace-nowrap"
              >
                <span>Find Nearby Collectors</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsAddWasteModalOpen(true)}
                className="w-full py-2.5 px-4 bg-emerald-900/60 hover:bg-emerald-900 text-emerald-200 rounded-xl font-medium text-xs transition-colors text-center border border-emerald-800"
              >
                + List This Item in Feed
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p>
            Estimated price — actual amount may vary depending on material quality, moisture, pickup location, and real-time scrap market rates upon physical scale verification.
          </p>
        </div>
      </div>
    </div>
  );
};
