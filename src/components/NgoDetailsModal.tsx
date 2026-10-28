import React from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_NGOS, DONATION_CATEGORIES } from '../data/mockData';
import {
  X,
  Star,
  MapPin,
  Phone,
  Clock,
  Heart,
  ShieldCheck,
  Calendar,
  Gift,
} from 'lucide-react';

export const NgoDetailsModal: React.FC = () => {
  const { viewingNgoId, setViewingNgoId, openScheduleModal, openCallModal } = useApp();

  if (!viewingNgoId) return null;

  const ngo = INITIAL_NGOS.find((n) => n.id === viewingNgoId);
  if (!ngo) return null;

  const acceptedCategoryObjects = DONATION_CATEGORIES.filter((c) =>
    ngo.acceptedCategories.includes(c.id)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                NGO Partner Profile
              </span>
              {ngo.verified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  Verified Non-Profit
                </span>
              )}
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1">
              {ngo.name}
            </h3>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1 text-amber-600 font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                {ngo.rating} ({ngo.reviewsCount} donor ratings)
              </span>
              <span>·</span>
              <span className="tabular-nums">{ngo.distanceKm} km away</span>
              <span>·</span>
              <span>{ngo.itemsReceivedCount.toLocaleString()}+ items channeled</span>
            </div>
          </div>

          <button
            onClick={() => setViewingNgoId(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-600">
          
          {/* Mission & Cause */}
          <div className="p-3.5 bg-teal-50/60 rounded-xl border border-teal-100">
            <span className="text-[10px] uppercase font-bold text-teal-800 block mb-1">
              Core Mission
            </span>
            <p className="text-slate-800 font-semibold text-xs leading-relaxed">
              {ngo.cause}
            </p>
            <p className="text-slate-600 text-xs mt-1 leading-relaxed">
              {ngo.description}
            </p>
          </div>

          {/* Key Facts */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Doorstep Pickup
              </span>
              <span className="text-slate-900 font-semibold">
                {ngo.pickupAvailable ? 'Free Doorstep Collection Available' : 'Drop-off at Center'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Volunteer Center Hours
              </span>
              <span className="text-slate-900 font-semibold">{ngo.workingHours}</span>
            </div>
          </div>

          {/* Address & Phone */}
          <div className="space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">Donation Center: </span>
                <span>{ngo.address}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="font-semibold text-slate-800">Volunteer Hotline: </span>
                <span className="tabular-nums font-bold text-slate-900">{ngo.phone}</span>
              </div>
            </div>
          </div>

          {/* Accepted Donation Categories */}
          <div>
            <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider block mb-2">
              Accepted Reusable Goods
            </span>
            <div className="grid grid-cols-2 gap-2">
              {acceptedCategoryObjects.map((cat) => (
                <div
                  key={cat.id}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between"
                >
                  <span className="font-medium text-slate-800">{cat.name}</span>
                  <Heart className="w-3.5 h-3.5 text-teal-600" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2.5">
          <button
            onClick={() => {
              setViewingNgoId(null);
              openCallModal({
                name: ngo.name,
                phone: ngo.phone,
                role: 'NGO Volunteer Coordinator',
                hours: ngo.workingHours,
              });
            }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Call NGO</span>
          </button>

          <button
            onClick={() => {
              const target = {
                type: 'ngo' as const,
                id: ngo.id,
                name: ngo.name,
                phone: ngo.phone,
                address: ngo.address,
              };
              setViewingNgoId(null);
              openScheduleModal(target);
            }}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Gift className="w-4 h-4" />
            <span>Donate Now</span>
          </button>
        </div>

      </div>
    </div>
  );
};
