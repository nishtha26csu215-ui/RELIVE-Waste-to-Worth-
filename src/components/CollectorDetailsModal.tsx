import React from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_COLLECTORS, WASTE_CATEGORIES } from '../data/mockData';
import {
  X,
  Star,
  MapPin,
  Phone,
  Clock,
  Truck,
  ShieldCheck,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

export const CollectorDetailsModal: React.FC = () => {
  const { viewingCollectorId, setViewingCollectorId, openScheduleModal, openCallModal } = useApp();

  if (!viewingCollectorId) return null;

  const collector = INITIAL_COLLECTORS.find((c) => c.id === viewingCollectorId);
  if (!collector) return null;

  const acceptedCategoryObjects = WASTE_CATEGORIES.filter((c) =>
    collector.acceptedCategories.includes(c.id)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Scrap Collector Profile
              </span>
              {collector.verified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified
                </span>
              )}
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1">
              {collector.name}
            </h3>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1 text-amber-600 font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                {collector.rating} ({collector.reviewsCount} reviews)
              </span>
              <span>·</span>
              <span className="tabular-nums">{collector.distanceKm} km away</span>
              <span>·</span>
              <span>{collector.experienceYears}+ years in business</span>
            </div>
          </div>

          <button
            onClick={() => setViewingCollectorId(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-600">
          
          {/* Key Facts */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Pickup Vehicle
              </span>
              <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>{collector.vehicleType}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Working Hours
              </span>
              <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>{collector.workingHours}</span>
              </div>
            </div>
          </div>

          {/* Address & Phone */}
          <div className="space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">Shop Address: </span>
                <span>{collector.address}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="font-semibold text-slate-800">Phone: </span>
                <span className="tabular-nums font-bold text-slate-900">{collector.phone}</span>
              </div>
            </div>
          </div>

          {/* Accepted Materials with Rates */}
          <div>
            <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider block mb-2">
              Accepted Scrap Materials & Live Rates
            </span>
            <div className="grid grid-cols-2 gap-2">
              {acceptedCategoryObjects.map((cat) => (
                <div
                  key={cat.id}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between"
                >
                  <span className="font-medium text-slate-800">{cat.name}</span>
                  <span className="font-bold text-emerald-700 tabular-nums">
                    ₹{cat.pricePerKg}/kg
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Policy note */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-emerald-900">
            <span className="font-bold block mb-0.5">Verification & Payment Policy</span>
            <p className="text-[11px] leading-relaxed text-emerald-800">
              {collector.pricingInfo}. Scale is certified with annual calibration seal. Digital receipt generated instantly.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2.5">
          <button
            onClick={() => {
              setViewingCollectorId(null);
              openCallModal({
                name: collector.name,
                phone: collector.phone,
                role: 'Scrap Collector',
                hours: collector.workingHours,
              });
            }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Call Collector</span>
          </button>

          <button
            onClick={() => {
              const target = {
                type: 'collector' as const,
                id: collector.id,
                name: collector.name,
                phone: collector.phone,
                address: collector.address,
              };
              setViewingCollectorId(null);
              openScheduleModal(target);
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule Pickup</span>
          </button>
        </div>

      </div>
    </div>
  );
};
