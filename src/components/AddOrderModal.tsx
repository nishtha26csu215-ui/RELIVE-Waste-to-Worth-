import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserOrder, OrderStatus, PaymentStatus } from '../types';
import { INITIAL_COLLECTORS, INITIAL_NGOS, WASTE_CATEGORIES } from '../data/mockData';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Truck,
  Building,
} from 'lucide-react';

export const AddOrderModal: React.FC = () => {
  const {
    isAddOrderModalOpen,
    setIsAddOrderModalOpen,
    createManualOrder,
    userProfile,
    addToast,
  } = useApp();

  const [type, setType] = useState<'scrap' | 'donation'>('scrap');
  const [targetId, setTargetId] = useState(INITIAL_COLLECTORS[0].id);
  const [itemName, setItemName] = useState('Corrugated Cardboard & Mixed Bottles');
  const [category, setCategory] = useState('Cardboard & Plastic');
  const [weightOrQty, setWeightOrQty] = useState('10.0 kg');
  const [finalAmount, setFinalAmount] = useState<number>(150);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('paid_upi');
  const [paymentMethod, setPaymentMethod] = useState('Instant UPI to Bank Account');
  const [date, setDate] = useState('Oct 28, 2026');
  const [timeSlot, setTimeSlot] = useState('10:00 AM – 12:00 PM');
  const [pickupHouseNo, setPickupHouseNo] = useState(userProfile.houseNo || 'Flat 402, Tower B');
  const [pickupAddress, setPickupAddress] = useState(userProfile.address || 'Palm Grove Heights, Sector 54');
  const [pickupCity, setPickupCity] = useState(userProfile.city || 'Gurugram');
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('completed');
  const [notes, setNotes] = useState('Verified weighing scale at doorstep.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAddOrderModalOpen) return null;

  const currentCollector = INITIAL_COLLECTORS.find((c) => c.id === targetId);
  const currentNgo = INITIAL_NGOS.find((n) => n.id === targetId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderNum = 'RLV-2026-' + Math.floor(1000 + Math.random() * 9000);
      const paymentRef =
        paymentStatus === 'paid_upi'
          ? 'UPI/REL-' + Math.floor(1000000000 + Math.random() * 9000000000)
          : paymentStatus === 'cash_collected'
          ? 'CASH-REC-' + Math.floor(10000 + Math.random() * 90000)
          : 'NGO-CERT-' + Math.floor(10000 + Math.random() * 90000);

      const targetName =
        type === 'scrap'
          ? currentCollector?.name || 'GreenCycle Scrap Services'
          : currentNgo?.name || 'Vidyarthi Book Bank';

      const targetRole =
        type === 'scrap'
          ? 'Verified Scrap Collector'
          : 'Registered Non-Profit NGO';

      const targetPhone =
        type === 'scrap'
          ? currentCollector?.phone || '+91 98765 43210'
          : currentNgo?.phone || '+91 98711 55667';

      const targetAddress =
        type === 'scrap'
          ? currentCollector?.address || 'Sector 15 Market, Gurugram'
          : currentNgo?.address || 'Central University Campus';

      const targetVehicle =
        type === 'scrap'
          ? currentCollector?.vehicleType || 'Cargo E-Rickshaw'
          : 'Donation Relief Van';

      const newOrder: UserOrder = {
        id: 'ord-' + Date.now(),
        userId: userProfile.id,
        orderNumber: orderNum,
        type,
        targetId,
        targetName,
        targetRole,
        targetPhone,
        targetAddress,
        targetVehicle,
        collectorAgentName: type === 'scrap' ? 'Sunil Kumar (Field Partner)' : 'Ananya Rao (Volunteer)',
        itemName: itemName.trim(),
        category,
        weightOrQty: weightOrQty.trim(),
        estimatedValue: type === 'scrap' ? finalAmount : 0,
        finalAmount: type === 'scrap' ? finalAmount : 0,
        paymentStatus: type === 'scrap' ? paymentStatus : 'free_donation',
        paymentMethod: type === 'scrap' ? paymentMethod : 'Tax-Exempt 80G Receipt',
        paymentReference: paymentRef,
        paidAt: `${date} at ${timeSlot.split('–')[0].trim()}`,
        pickupAddress: pickupAddress.trim(),
        pickupHouseNo: pickupHouseNo.trim(),
        pickupCity: pickupCity.trim(),
        date,
        timeSlot,
        completedAt: orderStatus === 'completed' ? `${date} at ${timeSlot}` : undefined,
        status: orderStatus,
        pointsEarned: type === 'scrap' ? 45 : 50,
        notes: notes.trim(),
        createdAt: new Date().toISOString(),
        milestones: [
          {
            title: 'Order Placed & Scheduled',
            description: `Pickup requested for ${itemName}.`,
            timestamp: `${date} · Slot: ${timeSlot}`,
            completed: true,
            where: `${pickupHouseNo}, ${pickupAddress}`,
          },
          {
            title: 'Assigned Partner (Who)',
            description: `${targetName} accepted pickup.`,
            timestamp: `${date}`,
            completed: true,
            who: `${targetName} (${targetPhone})`,
          },
          {
            title: 'Doorstep Pickup (Where)',
            description: `Collection executed at ${pickupAddress}.`,
            timestamp: `${date} · ${timeSlot}`,
            completed: orderStatus === 'completed',
            where: `${pickupHouseNo}, ${pickupAddress}, ${pickupCity}`,
          },
          {
            title: 'Payment & Settlement',
            description: type === 'scrap' ? `Paid ₹${finalAmount} via ${paymentMethod}` : 'Tax-exempt 80G certificate issued.',
            timestamp: `${date}`,
            completed: orderStatus === 'completed',
            who: targetName,
          },
          {
            title: 'Lifecycle Completed',
            description: `Reward points awarded and logged in Firestore database.`,
            timestamp: `${date}`,
            completed: orderStatus === 'completed',
          },
        ],
      };

      await createManualOrder(newOrder);
      addToast(`Order ${orderNum} created and saved to Firestore database!`);
      setIsAddOrderModalOpen(false);
    } catch (err) {
      console.error(err);
      addToast('Failed to save order to database', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
              Firestore Database Entry
            </span>
            <h3 className="text-lg font-extrabold text-white mt-0.5">
              Record / Add Order to Timeline
            </h3>
          </div>
          <button
            onClick={() => setIsAddOrderModalOpen(false)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Order Type Toggle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Order Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setType('scrap');
                  setTargetId(INITIAL_COLLECTORS[0].id);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  type === 'scrap'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-950 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Scrap Sale (Paid Pickup)
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('donation');
                  setTargetId(INITIAL_NGOS[0].id);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  type === 'donation'
                    ? 'bg-teal-50 border-teal-600 text-teal-950 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                NGO Donation (Free Pickup)
              </button>
            </div>
          </div>

          {/* WHO: Assign Collector or NGO */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Pickup Done By (Who) <span className="text-rose-500">*</span>
            </label>
            <select
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {type === 'scrap'
                ? INITIAL_COLLECTORS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.vehicleType} ({c.phone})
                    </option>
                  ))
                : INITIAL_NGOS.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.name} — {n.cause}
                    </option>
                  ))}
            </select>
          </div>

          {/* Materials & Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Item / Material Name
              </label>
              <input
                type="text"
                required
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Weight / Quantity
              </label>
              <input
                type="text"
                required
                value={weightOrQty}
                onChange={(e) => setWeightOrQty(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
              />
            </div>
          </div>

          {/* DATE & TIME */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Pickup Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="e.g. Oct 28, 2026"
                  className="w-full pl-8 pr-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Pickup Time Slot <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  required
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  placeholder="e.g. 10:00 AM – 12:00 PM"
                  className="w-full pl-8 pr-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* PAYMENT DETAILS */}
          {type === 'scrap' && (
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Payment Details
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Amount Paid (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={finalAmount}
                    onChange={(e) => setFinalAmount(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="paid_upi">Paid via Instant UPI</option>
                    <option value="cash_collected">Cash on Spot</option>
                    <option value="credited_wallet">Credited to Wallet</option>
                    <option value="pending">Pending Settlement</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Payment Method Description
                </label>
                <input
                  type="text"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  placeholder="e.g. Instant UPI to Bank Account"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {/* WHERE: PICKUP LOCATION */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Pickup Location (Where)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                required
                value={pickupHouseNo}
                onChange={(e) => setPickupHouseNo(e.target.value)}
                placeholder="House / Flat / Tower No."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="text"
                required
                value={pickupCity}
                onChange={(e) => setPickupCity(e.target.value)}
                placeholder="City / Town"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <input
              type="text"
              required
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              placeholder="Street / Society Address"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* ORDER STATUS */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Initial Order Status
            </label>
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="completed">Completed (Previous Historical Order)</option>
              <option value="collected">Collected (Inspection Completed)</option>
              <option value="on_the_way">On the Way (Collector In Transit)</option>
              <option value="confirmed">Confirmed (Scheduled Slot Confirmed)</option>
              <option value="scheduled">Scheduled (New Order)</option>
            </select>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Doorstep Notes / Verification Remarks
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* CTA Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddOrderModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving to Firestore...' : 'Save to Timeline'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
