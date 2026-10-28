import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PickupStep, WasteItem } from '../../types';
import {
  Recycle,
  Gift,
  Coins,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Trash2,
  Plus,
  ArrowRight,
  TrendingUp,
  Leaf,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Database,
  Receipt,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    points,
    totalWasteKg,
    totalItemsDonated,
    moneyEarned,
    pickups,
    updatePickupStatus,
    cancelPickup,
    userItems,
    deleteUserItem,
    setIsAddWasteModalOpen,
    setActiveTab,
    openScheduleModal,
    userProfile,
    orders,
    setIsProfileDbModalOpen,
    setSelectedReceiptOrder,
    setIsReceiptModalOpen,
  } = useApp();

  const [activeTrackingPickupId, setActiveTrackingPickupId] = useState<string | null>(
    pickups.length > 0 ? pickups[0].id : null
  );

  const selectedPickup = pickups.find((p) => p.id === activeTrackingPickupId) || pickups[0];

  const stepsList: { key: PickupStep; label: string }[] = [
    { key: 'scheduled', label: 'Scheduled' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'on_the_way', label: 'On the Way' },
    { key: 'collected', label: 'Collected' },
    { key: 'completed', label: 'Completed' },
  ];

  const advanceStatus = (current: PickupStep): PickupStep => {
    switch (current) {
      case 'scheduled':
        return 'confirmed';
      case 'confirmed':
        return 'on_the_way';
      case 'on_the_way':
        return 'collected';
      case 'collected':
        return 'completed';
      case 'completed':
        return 'scheduled';
    }
  };

  const estimatedCo2Saved = (totalWasteKg * 1.42).toFixed(1);

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header Profile Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
            {userProfile.avatarInitials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900">
                {userProfile.name}
              </h1>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                Eco-Leader #4
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {userProfile.houseNo ? `${userProfile.houseNo}, ${userProfile.address}, ${userProfile.city}` : userProfile.address}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsProfileDbModalOpen(true)}
            className="py-2.5 px-3.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Inspect user signup data stored in Firestore database"
          >
            <Database className="w-3.5 h-3.5 text-emerald-700" />
            <span>Database Sign-Up</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className="py-2.5 px-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Open orders history timeline"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Orders Timeline ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className="py-2.5 px-3.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition-colors flex items-center gap-1.5"
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Leaderboard</span>
          </button>

          <button
            onClick={() => setIsAddWasteModalOpen(true)}
            className="py-2.5 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>List Waste</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Waste Recycled
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Recycle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-black text-slate-900 tabular-nums">
            {totalWasteKg} <span className="text-sm font-semibold text-slate-400">kg</span>
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
            Diverted from landfills
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Items Donated
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Gift className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-black text-slate-900 tabular-nums">
            {totalItemsDonated} <span className="text-sm font-semibold text-slate-400">units</span>
          </span>
          <span className="text-[11px] text-teal-700 font-semibold block mt-1">
            Textbooks, clothes & gear
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Money Earned
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-black text-slate-900 tabular-nums">
            ₹{moneyEarned}
          </span>
          <span className="text-[11px] text-amber-700 font-semibold block mt-1">
            Paid via instant UPI
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              RELIVE Points
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-black text-emerald-800 tabular-nums">
            {points.toLocaleString()}
          </span>
          <button
            onClick={() => setActiveTab('rewards')}
            className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 mt-1"
          >
            <span>Redeem for vouchers</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Upcoming Pickup Live Tracker Card */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
              <span>Active Doorstep Service</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-500 font-medium">Pickup Schedule</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Upcoming Pickups ({pickups.length})
            </h2>
          </div>

          {pickups.length > 1 && (
            <div className="flex gap-2">
              {pickups.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setActiveTrackingPickupId(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    selectedPickup?.id === p.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Pickup #{idx + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedPickup ? (
          <div className="space-y-6">
            {/* Pickup Details Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  {selectedPickup.type === 'scrap' ? 'Assigned Collector' : 'Partner NGO'}
                </span>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                  {selectedPickup.targetName}
                </p>
                <p className="text-xs text-slate-500">{selectedPickup.targetPhone}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Material & Quantity
                </span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {selectedPickup.itemName}
                </p>
                <p className="text-xs text-slate-500">
                  {selectedPickup.weightOrQty} {selectedPickup.estimatedValue > 0 ? `· Est: ₹${selectedPickup.estimatedValue}` : ''}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Scheduled Time & Spot
                </span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {selectedPickup.date}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {selectedPickup.timeSlot} · {selectedPickup.pickupAddress}
                </p>
              </div>
            </div>

            {/* Live Interactive Step Tracker */}
            <div className="p-6 bg-slate-900 text-white rounded-2xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs text-emerald-400 uppercase font-bold tracking-wider">
                    Doorstep Progress Tracker
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    Current Status: <span className="text-emerald-300 capitalize">{selectedPickup.status.replace('_', ' ')}</span>
                  </h3>
                </div>

                {/* Hackathon Interactive Simulator Button */}
                <button
                  onClick={() =>
                    updatePickupStatus(
                      selectedPickup.id,
                      advanceStatus(selectedPickup.status)
                    )
                  }
                  className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors self-start sm:self-auto flex items-center gap-1 shadow-xs"
                  title="Simulate step transition for demonstration"
                >
                  <span>Simulate Next Step →</span>
                </button>
              </div>

              {/* Steps Visual */}
              <div className="grid grid-cols-5 gap-2 relative">
                {stepsList.map((step, idx) => {
                  const currentIdx = stepsList.findIndex((s) => s.key === selectedPickup.status);
                  const isDone = idx < currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={step.key} className="flex flex-col items-center text-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isDone
                            ? 'bg-emerald-500 text-slate-950'
                            : isCurrent
                            ? 'bg-emerald-400 text-slate-950 ring-4 ring-emerald-400/30 font-black'
                            : 'bg-slate-800 text-slate-500 border border-slate-700'
                        }`}
                      >
                        {isDone ? '✓' : idx + 1}
                      </div>
                      <span
                        className={`text-[11px] font-semibold mt-2 ${
                          isCurrent
                            ? 'text-emerald-300 font-bold'
                            : isDone
                            ? 'text-slate-300'
                            : 'text-slate-500'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cancel Action */}
            <div className="flex justify-end">
              <button
                onClick={() => cancelPickup(selectedPickup.id)}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
              >
                Cancel this pickup request
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-900">No active pickups scheduled</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Ready to sell scrap or donate items? Browse local collectors or NGOs to book a 2-hour doorstep slot.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <button
                onClick={() => setActiveTab('collectors')}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                Find Collectors
              </button>
              <button
                onClick={() => setActiveTab('ngos')}
                className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"
              >
                Find NGOs
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Previous Orders & Doorstep Pickups Timeline Preview Section */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>Database Ledger</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-500 font-medium">Order History</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Previous Orders & Doorstep Pickups ({orders.length})
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Permanent chronological records with Date, Time, Payment Settlement, and Who & Where doorstep pickups took place.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('orders');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>View Full Interactive Timeline</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {orders.slice(0, 3).map((order) => {
            const isScrap = order.type === 'scrap';
            return (
              <div key={order.id} className="py-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-xs text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-emerald-600" />
                      {order.date}
                    </span>
                    <span className="text-xs font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {order.timeSlot}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400 font-bold">
                      #{order.orderNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        order.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 truncate">
                    {order.itemName} <span className="font-semibold text-slate-500 text-xs">({order.weightOrQty})</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-0.5">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-slate-400 font-medium">Done by (Who):</span>
                      <strong className="text-slate-900 font-bold truncate">{order.targetName}</strong>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 inline" />
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{order.pickupHouseNo ? `${order.pickupHouseNo}, ` : ''}{order.pickupAddress}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <span className="text-base font-black text-emerald-950 tabular-nums block">
                      {isScrap ? `₹${order.finalAmount || order.estimatedValue}` : 'Donation'}
                    </span>
                    <span className="text-[11px] text-emerald-800 font-semibold block">
                      {isScrap
                        ? order.paymentStatus === 'paid_upi'
                          ? 'Paid via UPI'
                          : order.paymentStatus === 'cash_collected'
                          ? 'Cash on Spot'
                          : 'Settled'
                        : '80G Certificate'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedReceiptOrder(order);
                      setIsReceiptModalOpen(true);
                    }}
                    className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Receipt</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Environmental Impact Section */}
      <section className="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 rounded-3xl border border-emerald-100 p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span>Community Sustainability Metrics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Your Personal Eco-Impact
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            “You have helped divert <strong className="text-slate-900">{totalWasteKg} kg</strong> of waste from municipal landfill.”
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Waste Diverted
            </span>
            <span className="text-2xl font-black text-emerald-900 tabular-nums mt-1 block">
              {totalWasteKg} kg
            </span>
            <p className="text-[11px] text-slate-500 mt-1">
              Plastics, paper, metal & e-waste
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Items Reused
            </span>
            <span className="text-2xl font-black text-teal-900 tabular-nums mt-1 block">
              {totalItemsDonated} items
            </span>
            <p className="text-[11px] text-slate-500 mt-1">
              Benefiting community students
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Estimated CO₂ Saved
            </span>
            <span className="text-2xl font-black text-slate-900 tabular-nums mt-1 block">
              ~{estimatedCo2Saved} kg
            </span>
            <p className="text-[11px] text-slate-500 mt-1">
              Greenhouse gas emissions spared
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Household Eco Score
            </span>
            <span className="text-2xl font-black text-emerald-700 tabular-nums mt-1 block">
              88 / 100
            </span>
            <p className="text-[11px] text-slate-500 mt-1">
              Top 5% among community households
            </p>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 mt-4 text-center sm:text-left">
          * Environmental savings figures are calculated estimates based on standard lifecycle analysis (LCA) factors for recycled polymers, pulp paper, and scrap metals.
        </p>
      </section>

      {/* My Listed Items Section */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              My Listed Items ({userItems.length})
            </h2>
            <p className="text-xs text-slate-500">
              Scrap and reusable lots listed by you on the RELIVE community feed
            </p>
          </div>

          <button
            onClick={() => setIsAddWasteModalOpen(true)}
            className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>List Another Item</span>
          </button>
        </div>

        {userItems.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-xs text-slate-500">You haven’t listed any items yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {userItems.map((item) => (
              <div
                key={item.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-bold text-slate-800 capitalize">
                      {item.categoryName}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums font-semibold">{item.weightKg} kg</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={`font-semibold ${
                        item.type === 'donate' ? 'text-teal-700' : 'text-emerald-700'
                      }`}
                    >
                      {item.type === 'donate' ? 'Donation' : `Est: ₹${item.estimatedValue}`}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mt-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => {
                      if (item.type === 'sell') {
                        setActiveTab('collectors');
                      } else {
                        setActiveTab('ngos');
                      }
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Schedule
                  </button>

                  <button
                    onClick={() => deleteUserItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete listing"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
