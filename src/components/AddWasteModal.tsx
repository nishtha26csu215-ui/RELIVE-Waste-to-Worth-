import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WASTE_CATEGORIES, DONATION_CATEGORIES } from '../data/mockData';
import { WasteCategoryId, DonationCategoryId } from '../types';
import { X, Plus, Sparkles, Scale, Info, Check } from 'lucide-react';

export const AddWasteModal: React.FC = () => {
  const { isAddWasteModalOpen, setIsAddWasteModalOpen, addWasteItem, userProfile } = useApp();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<'sell' | 'donate'>('sell');
  const [category, setCategory] = useState<string>('plastic');
  const [weightKg, setWeightKg] = useState<number>(3.5);
  const [condition, setCondition] = useState<'Good' | 'Fair' | 'Scrap' | 'Reusable'>('Good');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(
    userProfile.houseNo ? `${userProfile.houseNo}, ${userProfile.address}` : userProfile.address
  );
  const [error, setError] = useState<string | null>(null);

  if (!isAddWasteModalOpen) return null;

  const currentCategoryObj = WASTE_CATEGORIES.find((c) => c.id === category);
  const currentPricePerKg = currentCategoryObj ? currentCategoryObj.pricePerKg : 15;
  const estimatedValue = type === 'sell' ? Math.round(weightKg * currentPricePerKg) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide an item name.');
      return;
    }
    if (weightKg <= 0) {
      setError('Weight must be greater than 0 kg.');
      return;
    }

    const matchedWasteCat = WASTE_CATEGORIES.find((c) => c.id === category);
    const matchedDonationCat = DONATION_CATEGORIES.find((c) => c.id === category);
    const categoryName = matchedWasteCat?.name || matchedDonationCat?.name || 'Scrap';

    addWasteItem({
      title: title.trim(),
      category: category as WasteCategoryId | DonationCategoryId,
      categoryName,
      weightKg,
      type,
      estimatedValue,
      condition,
      description: description.trim() || `${condition} condition ${categoryName.toLowerCase()} ready for collection.`,
      location: location.trim() || 'Campus area',
    });

    // Reset & close
    setTitle('');
    setDescription('');
    setError(null);
    setIsAddWasteModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              List Your Waste or Donable Item
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Instantly broadcast to nearby verified scrap collectors and NGOs
            </p>
          </div>
          <button
            onClick={() => setIsAddWasteModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          {/* Sell vs Donate Toggle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Listing Goal
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setType('sell');
                  setCategory('plastic');
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  type === 'sell'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sell to Scrap Collector (Cash)
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('donate');
                  setCategory('books');
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  type === 'donate'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Donate to NGO (Gift 💚)
              </button>
            </div>
          </div>

          {/* Item Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Item Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder={type === 'sell' ? 'e.g. Clean PET Water Bottles & Jars' : 'e.g. 5x Semester Engineering Textbooks'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category Dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {type === 'sell' ? (
                  <>
                    <option value="plastic">Plastic (₹7/kg)</option>
                    <option value="paper">Paper (₹7/kg)</option>
                    <option value="cardboard">Cardboard (₹12/kg)</option>
                    <option value="metal">Metal (₹20/kg)</option>
                    <option value="glass">Glass (₹10/kg)</option>
                    <option value="ewaste">E-Waste (₹20/kg)</option>
                    <option value="books">Books / Notes (₹15/kg)</option>
                    <option value="household">Household Items (₹15/kg)</option>
                    <option value="clothes">Clothes Scrap (₹20/kg)</option>
                    <option value="other">Other Scrap (₹10/kg)</option>
                  </>
                ) : (
                  <>
                    <option value="books">Books & Guides</option>
                    <option value="clothes">Wearable Clothes</option>
                    <option value="toys">Toys & Games</option>
                    <option value="stationery">Stationery & Art Supplies</option>
                    <option value="furniture">Study Furniture</option>
                    <option value="electronics">Working Gadgets</option>
                    <option value="household">Kitchen & Home Items</option>
                    <option value="other">Other Essentials</option>
                  </>
                )}
              </select>
            </div>

            {/* Weight (kg) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Approx Weight (kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0.1"
                  max="500"
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0.5)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none">
                  kg
                </span>
              </div>
            </div>
          </div>

          {/* Condition & Campus Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Good">Good (Clean & intact)</option>
                <option value="Fair">Fair (Slight wear)</option>
                <option value="Scrap">Scrap (For melting/recycling)</option>
                <option value="Reusable">Reusable (Ideal for donation)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Pickup Address / House No.
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. House No. 42-B, Green Glen Residency"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Short Description / Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Stored inside cardboard box, ready for doorstep weighing..."
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          {/* Dynamic Valuation Pill */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">
              {type === 'sell' ? 'Calculated Resale Value:' : 'Estimated Impact:'}
            </span>
            <span className="font-extrabold text-emerald-900 text-sm tabular-nums">
              {type === 'sell' ? `₹${estimatedValue}` : 'Direct NGO Donation 💚'}
            </span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddWasteModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item to Feed</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
