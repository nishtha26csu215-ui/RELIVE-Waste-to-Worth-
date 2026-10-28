import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WASTE_CATEGORIES } from '../data/mockData';
import { PickupSchedule, PickupStep } from '../types';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Package,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const SchedulePickupModal: React.FC = () => {
  const {
    schedulingTarget,
    closeScheduleModal,
    schedulePickup,
    userItems,
    setActiveTab,
    userProfile,
  } = useApp();

  const [selectedItemName, setSelectedItemName] = useState('Mixed Scrap & Recyclables');
  const [weightOrQty, setWeightOrQty] = useState('5 kg');
  const [pickupAddress, setPickupAddress] = useState(
    userProfile.houseNo ? `${userProfile.houseNo}, ${userProfile.address}, ${userProfile.city}` : `${userProfile.address}, ${userProfile.city}`
  );
  const [phone, setPhone] = useState(userProfile.phone || '+91 98765 11223');
  const [selectedDate, setSelectedDate] = useState('Tomorrow, Oct 29');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('11:00 AM – 1:00 PM');
  const [notes, setNotes] = useState('Please call upon reaching gate/door.');
  const [confirmedPickup, setConfirmedPickup] = useState<PickupSchedule | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!schedulingTarget) return null;

  const isScrap = schedulingTarget.type === 'collector';

  const timeSlots = [
    '9:00 AM – 11:00 AM',
    '11:00 AM – 1:00 PM',
    '2:00 PM – 4:00 PM',
    '4:00 PM – 6:00 PM',
    '6:00 PM – 8:00 PM',
  ];

  const dateOptions = [
    'Today (Express Evening)',
    'Tomorrow, Oct 29',
    'Wed, Oct 30',
    'Thu, Oct 31',
    'Fri, Nov 1',
  ];

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupAddress.trim()) {
      setError('Please provide a valid pickup address.');
      return;
    }
    if (!phone.trim() || phone.length < 8) {
      setError('Please enter a valid phone number for the collector/NGO to coordinate.');
      return;
    }

    const weightNum = parseFloat(weightOrQty) || 5;
    const catObj = WASTE_CATEGORIES.find((c) =>
      schedulingTarget.defaultCategory
        ? c.id === schedulingTarget.defaultCategory
        : true
    );
    const estVal = isScrap ? Math.round(weightNum * (catObj?.pricePerKg || 20)) : 0;

    const created = schedulePickup({
      type: isScrap ? 'scrap' : 'donation',
      targetId: schedulingTarget.id,
      targetName: schedulingTarget.name,
      targetPhone: schedulingTarget.phone,
      targetAddress: schedulingTarget.address,
      itemName: selectedItemName,
      category: catObj?.name || 'Recyclables',
      weightOrQty,
      estimatedValue: estVal,
      pickupAddress: pickupAddress.trim(),
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      phone: phone.trim(),
      notes: notes.trim(),
    });

    setConfirmedPickup(created);
  };

  const statusSteps: { key: PickupStep; label: string }[] = isScrap
    ? [
        { key: 'scheduled', label: 'Scheduled' },
        { key: 'confirmed', label: 'Confirmed' },
        { key: 'on_the_way', label: 'On the Way' },
        { key: 'collected', label: 'Collected' },
        { key: 'completed', label: 'Completed' },
      ]
    : [
        { key: 'scheduled', label: 'Requested' },
        { key: 'confirmed', label: 'Accepted' },
        { key: 'on_the_way', label: 'Pickup Ready' },
        { key: 'collected', label: 'Collected' },
        { key: 'completed', label: 'Donated 💚' },
      ];

  const handleClose = () => {
    setConfirmedPickup(null);
    closeScheduleModal();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
              {isScrap ? 'Verified Doorstep Scrap Pickup' : 'Free Doorstep Donation Pickup'}
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
              {isScrap ? 'Schedule Scrap Pickup' : 'Schedule Donation Pickup'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Confirmation View */}
        {confirmedPickup ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-extrabold text-slate-900">
                {isScrap ? 'Pickup Scheduled Successfully! 🎉' : 'Donation Scheduled Successfully! 💚'}
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                {confirmedPickup.targetName} has been notified and will arrive within your chosen time slot.
              </p>
            </div>

            {/* Status Tracker */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-3 text-center">
                Live Status Tracker
              </span>
              <div className="flex items-center justify-between relative">
                <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-200 -translate-y-1/2 -z-0" />
                {statusSteps.map((s, idx) => {
                  const isCurrent = s.key === confirmedPickup.status;
                  const isPassed = idx === 0;
                  return (
                    <div key={s.key} className="flex flex-col items-center relative z-10">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isPassed || isCurrent
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <span className="text-[10px] font-semibold text-slate-700 mt-1 text-center whitespace-nowrap">
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary Details */}
            <div className="space-y-2.5 text-xs text-slate-600 border border-slate-100 rounded-xl p-4 bg-slate-50/50">
              <div className="flex justify-between">
                <span className="text-slate-400">Partner:</span>
                <span className="font-bold text-slate-900">{confirmedPickup.targetName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date & Time:</span>
                <span className="font-semibold text-slate-900">
                  {confirmedPickup.date} · {confirmedPickup.timeSlot}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Address:</span>
                <span className="font-semibold text-slate-900 truncate max-w-[200px]">
                  {confirmedPickup.pickupAddress}
                </span>
              </div>
              {isScrap && confirmedPickup.estimatedValue > 0 && (
                <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-emerald-800">
                  <span>Estimated Payout:</span>
                  <span className="tabular-nums">₹{confirmedPickup.estimatedValue}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  handleClose();
                  setActiveTab('dashboard');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm transition-colors text-center shadow-xs"
              >
                Track in Dashboard →
              </button>
              <button
                onClick={handleClose}
                className="px-4 py-3 border border-slate-200 text-slate-700 rounded-xl font-semibold text-xs hover:bg-slate-50"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleConfirm} className="p-5 sm:p-6 space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                {error}
              </div>
            )}

            {/* Selected Target Banner */}
            <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase">
                  {isScrap ? 'Assigned Scrap Collector' : 'Assigned Partner NGO'}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                  {schedulingTarget.name}
                </h4>
                <p className="text-[11px] text-slate-500">{schedulingTarget.address}</p>
              </div>
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            {/* Waste Item & Weight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Item Description
                </label>
                <input
                  type="text"
                  required
                  value={selectedItemName}
                  onChange={(e) => setSelectedItemName(e.target.value)}
                  placeholder="e.g. Cardboard boxes & textbooks"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Approx Weight / Qty
                </label>
                <input
                  type="text"
                  required
                  value={weightOrQty}
                  onChange={(e) => setWeightOrQty(e.target.value)}
                  placeholder="e.g. 5 kg or 4 bags"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                />
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Preferred Date
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {dateOptions.map((date) => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Slot Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Preferred Time Slot
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {timeSlots.map((slot) => {
                  const isSelected = selectedTimeSlot === slot;
                  return (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`px-3 py-2 text-xs font-semibold rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 inline mr-1.5 text-emerald-600" />
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pickup Address & Phone */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Pickup Address (House / Flat / Society) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    placeholder="e.g. House No. 42-B, Green Glen Residency, Sector 15"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Contact Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                  />
                </div>
              </div>
            </div>

            {/* Driver Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Special Instructions (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Leave with security guard, call before coming"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Pickup</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
