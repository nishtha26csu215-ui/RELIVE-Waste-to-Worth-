import React, { useState } from 'react';
import { useApp, ActiveTab } from '../context/AppContext';
import {
  INITIAL_COLLECTORS,
  INITIAL_NGOS,
  WASTE_CATEGORIES,
  DONATION_CATEGORIES,
} from '../data/mockData';
import {
  Search,
  X,
  Recycle,
  Building2,
  Package,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    communityFeed,
    setActiveTab,
    setSelectedCategoryFilter,
    setViewingCollectorId,
    setViewingNgoId,
  } = useApp();

  const [query, setQuery] = useState('');

  if (!isSearchModalOpen) return null;

  const trimmed = query.trim().toLowerCase();

  // Search Results
  const matchedCategories = trimmed
    ? WASTE_CATEGORIES.filter(
        (c) =>
          c.name.toLowerCase().includes(trimmed) ||
          c.exampleItems.some((ex) => ex.toLowerCase().includes(trimmed))
      )
    : [];

  const matchedCollectors = trimmed
    ? INITIAL_COLLECTORS.filter(
        (c) =>
          c.name.toLowerCase().includes(trimmed) ||
          c.address.toLowerCase().includes(trimmed) ||
          c.acceptedCategories.some((cat) => cat.toLowerCase().includes(trimmed))
      )
    : [];

  const matchedNgos = trimmed
    ? INITIAL_NGOS.filter(
        (n) =>
          n.name.toLowerCase().includes(trimmed) ||
          n.cause.toLowerCase().includes(trimmed) ||
          n.address.toLowerCase().includes(trimmed)
      )
    : [];

  const matchedFeedItems = trimmed
    ? communityFeed.filter(
        (item) =>
          item.title.toLowerCase().includes(trimmed) ||
          item.categoryName.toLowerCase().includes(trimmed) ||
          item.description.toLowerCase().includes(trimmed)
      )
    : [];

  const totalResults =
    matchedCategories.length +
    matchedCollectors.length +
    matchedNgos.length +
    matchedFeedItems.length;

  const handleSelect = (action: () => void) => {
    action();
    setIsSearchModalOpen(false);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 pt-16 sm:pt-24">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search waste categories, collectors, NGOs, or feed items..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1"
            >
              Clear
            </button>
          ) : (
            <span className="text-[11px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">
              ESC
            </span>
          )}
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!trimmed ? (
            <div className="py-6 text-center text-xs text-slate-400">
              <p>Type keywords like "plastic", "textbooks", "Goonj", "e-waste", or "collector"</p>
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {['Plastic', 'E-Waste', 'Textbooks', 'Cardboard', 'Metal', 'NGOs'].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => setQuery(chip)}
                    className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-xs hover:bg-slate-100 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm font-bold text-slate-900">No matching results found</p>
              <p className="text-xs text-slate-500 mt-1">
                Try searching for broader terms like "Paper", "Books", or "Collector".
              </p>
            </div>
          ) : (
            <>
              {/* Categories */}
              {matchedCategories.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Waste Categories ({matchedCategories.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {matchedCategories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() =>
                          handleSelect(() => {
                            setSelectedCategoryFilter(c.id);
                            setActiveTab('sell');
                          })
                        }
                        className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition-colors flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900">{c.name}</p>
                          <p className="text-[11px] text-slate-500 truncate max-w-[200px]">
                            {c.exampleItems.join(', ')}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-emerald-700">
                          ₹{c.pricePerKg}/kg
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Collectors */}
              {matchedCollectors.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Scrap Collectors ({matchedCollectors.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedCollectors.map((c) => (
                      <button
                        key={c.id}
                        onClick={() =>
                          handleSelect(() => {
                            setViewingCollectorId(c.id);
                            setActiveTab('collectors');
                          })
                        }
                        className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <Recycle className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{c.name}</p>
                            <p className="text-[11px] text-slate-500">{c.address} · ⭐ {c.rating}</p>
                          </div>
                        </div>
                        <span className="text-xs text-slate-500 tabular-nums">
                          {c.distanceKm} km
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* NGOs */}
              {matchedNgos.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Nearby NGOs ({matchedNgos.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedNgos.map((n) => (
                      <button
                        key={n.id}
                        onClick={() =>
                          handleSelect(() => {
                            setViewingNgoId(n.id);
                            setActiveTab('ngos');
                          })
                        }
                        className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 text-left transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{n.name}</p>
                            <p className="text-[11px] text-slate-500">{n.cause}</p>
                          </div>
                        </div>
                        <span className="text-xs text-slate-500 tabular-nums">
                          {n.distanceKm} km
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Feed Items */}
              {matchedFeedItems.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Community Waste Feed ({matchedFeedItems.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedFeedItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() =>
                          handleSelect(() => {
                            setActiveTab('feed');
                          })
                        }
                        className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-left transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="text-xs font-bold text-slate-900">{item.title}</p>
                            <p className="text-[11px] text-slate-500">
                              {item.categoryName} · {item.weightKg} kg · {item.location}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-800">
                          {item.type === 'donate' ? 'Donation' : `₹${item.estimatedValue}`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};
