import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WasteItem } from '../types';
import { Search, Filter, Tag, MapPin, Calendar, ArrowUpRight, Plus, Sparkles } from 'lucide-react';

interface CommunityFeedSectionProps {
  limit?: number;
  showTitle?: boolean;
}

export const CommunityFeedSection: React.FC<CommunityFeedSectionProps> = ({
  limit,
  showTitle = true,
}) => {
  const { communityFeed, setIsAddWasteModalOpen, openScheduleModal, setActiveTab } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filterOptions = [
    { id: 'all', label: 'All Items' },
    { id: 'plastic', label: 'Plastic' },
    { id: 'paper', label: 'Paper' },
    { id: 'metal', label: 'Metal' },
    { id: 'ewaste', label: 'E-Waste' },
    { id: 'books', label: 'Books' },
    { id: 'household', label: 'Household' },
    { id: 'donate', label: 'Donations Only' },
  ];

  const filteredItems = communityFeed.filter((item) => {
    // Search match
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    // Filter match
    if (activeFilter === 'all') return true;
    if (activeFilter === 'donate') return item.type === 'donate';
    return item.category.toLowerCase() === activeFilter.toLowerCase();
  });

  const displayedItems = limit ? filteredItems.slice(0, limit) : filteredItems;

  return (
    <div className="space-y-6">
      {showTitle && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
              <span>Campus & Neighborhood Activity</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-500 font-medium">Live Feed</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Community Waste Feed
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              See what fellow students and nearby residents are listing for recycling and donation.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddWasteModalOpen(true)}
            className="self-start sm:self-auto py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>List Waste Item</span>
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search waste items by title, category, campus location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills / Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {filterOptions.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeFilter === f.id
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      {displayedItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-900">No waste items match your filter</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms, selecting "All Items", or be the first to list a new scrap or donation lot.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setActiveFilter('all');
            }}
            className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Unboxed Metadata Header (Anti-Pill Rule) */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="capitalize font-bold text-slate-800">{item.categoryName}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums font-semibold text-slate-700">{item.weightKg} kg</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.condition}</span>
                  </div>

                  <span
                    className={`text-[11px] font-bold ${
                      item.type === 'donate' ? 'text-teal-700' : 'text-emerald-700'
                    }`}
                  >
                    {item.type === 'donate' ? 'For Donation' : 'For Sale'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[11px] text-slate-400 tabular-nums">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {item.date}
                    </span>
                    <span
                      className={`text-[11px] font-semibold ${
                        item.status === 'available'
                          ? 'text-emerald-700'
                          : item.status === 'scheduled'
                          ? 'text-amber-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {item.status === 'available'
                        ? 'Available for pickup'
                        : item.status === 'scheduled'
                        ? 'Pickup Scheduled'
                        : 'Collected'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer with Value & Action */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    {item.type === 'donate' ? 'Donation Impact' : 'Est. Value'}
                  </span>
                  <span className="text-base font-extrabold text-slate-900 tabular-nums">
                    {item.type === 'donate' ? 'Free Gift 💚' : `₹${item.estimatedValue}`}
                  </span>
                </div>

                {item.type === 'sell' ? (
                  <button
                    onClick={() => {
                      setActiveTab('collectors');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <span>Connect Collector</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setActiveTab('ngos');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="py-1.5 px-3 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <span>Send to NGO</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
