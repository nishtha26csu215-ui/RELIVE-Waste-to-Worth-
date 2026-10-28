import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Printer,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Receipt,
  Download,
  Building,
  User,
  Recycle,
} from 'lucide-react';

export const OrderReceiptModal: React.FC = () => {
  const {
    isReceiptModalOpen,
    setIsReceiptModalOpen,
    selectedReceiptOrder,
    userProfile,
  } = useApp();

  if (!isReceiptModalOpen || !selectedReceiptOrder) return null;

  const order = selectedReceiptOrder;
  const isScrap = order.type === 'scrap';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 print:m-0 print:border-none print:shadow-none">
        
        {/* Header Ribbon */}
        <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                Official Digital Receipt
              </span>
              <h3 className="text-lg font-extrabold text-white">
                {order.orderNumber}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsReceiptModalOpen(false)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Status Badge */}
          <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide block">
                  {order.status === 'completed'
                    ? 'Pickup Verified & Settled'
                    : `Status: ${order.status.replace('_', ' ').toUpperCase()}`}
                </span>
                <span className="text-xs text-emerald-800">
                  {isScrap
                    ? `Payment Status: ${order.paymentStatus === 'paid_upi' ? 'Paid via UPI' : order.paymentStatus === 'cash_collected' ? 'Cash on Spot Handed Over' : 'Settled'}`
                    : 'Non-Profit 80G Tax-Exempt Redistribution Receipt'}
                </span>
              </div>
            </div>
            <span className="text-xl font-black text-emerald-900 tabular-nums">
              {isScrap ? `₹${order.finalAmount || order.estimatedValue}` : '₹0 (Donation)'}
            </span>
          </div>

          {/* Grid: Who & Where */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* WHO Done By */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Pickup Done By (Who)
              </span>
              <p className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                <span>{order.targetName}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600 inline" />
              </p>
              <p className="text-xs text-slate-600 mt-0.5">{order.targetRole}</p>
              {order.collectorAgentName && (
                <p className="text-xs font-semibold text-emerald-800 mt-1">
                  Agent: {order.collectorAgentName}
                </p>
              )}
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>{order.targetPhone}</span>
              </p>
              {order.targetVehicle && (
                <p className="text-[11px] text-slate-500 mt-1">
                  Vehicle: {order.targetVehicle}
                </p>
              )}
            </div>

            {/* WHERE Done At */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Pickup Done Where (Location)
              </span>
              <p className="text-sm font-bold text-slate-900">
                {order.pickupHouseNo ? `${order.pickupHouseNo}, ` : ''}{order.pickupAddress}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                City: {order.pickupCity || 'Gurugram'}
              </p>
              {order.pickupLandmark && (
                <p className="text-xs text-slate-500 mt-1">
                  Landmark: {order.pickupLandmark}
                </p>
              )}
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" />
                <span>Client: {userProfile.name} ({userProfile.phone})</span>
              </p>
            </div>
          </div>

          {/* Date, Time & Payment Information */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Date, Time & Payment Breakdown
            </span>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Pickup Date:</span>
                <span className="font-bold text-slate-900">{order.date}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Pickup Time Slot:</span>
                <span className="font-bold text-slate-900">{order.timeSlot}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Payment Method:</span>
                <span className="font-bold text-slate-900">{order.paymentMethod}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Transaction Reference:</span>
                <span className="font-mono font-bold text-emerald-800">{order.paymentReference}</span>
              </div>
            </div>

            {order.paidAt && (
              <div className="text-xs pt-2 border-t border-slate-200/60 text-slate-500">
                Settlement Completed on: <strong className="text-slate-800">{order.paidAt}</strong>
              </div>
            )}
          </div>

          {/* Itemized Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-2.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider grid grid-cols-12 gap-2">
              <span className="col-span-6">Material / Goods</span>
              <span className="col-span-3 text-center">Quantity</span>
              <span className="col-span-3 text-right">Amount</span>
            </div>
            <div className="p-4 divide-y divide-slate-100 text-xs">
              <div className="py-2 grid grid-cols-12 gap-2 items-center">
                <div className="col-span-6">
                  <p className="font-bold text-slate-900">{order.itemName}</p>
                  <p className="text-[11px] text-slate-500">{order.category}</p>
                </div>
                <div className="col-span-3 text-center font-semibold text-slate-700">
                  {order.weightOrQty}
                </div>
                <div className="col-span-3 text-right font-black text-slate-900 tabular-nums">
                  {isScrap ? `₹${order.finalAmount || order.estimatedValue}` : '₹0.00'}
                </div>
              </div>
              
              <div className="py-2.5 flex items-center justify-between text-xs text-slate-500">
                <span>Green Handling & Platform Logistics Fee</span>
                <span className="text-emerald-700 font-semibold">FREE (₹0)</span>
              </div>

              <div className="py-2.5 flex items-center justify-between text-xs text-slate-500">
                <span>Reward Points Credited</span>
                <span className="font-bold text-emerald-800">+{order.pointsEarned} Eco Points</span>
              </div>

              <div className="pt-3 flex items-center justify-between font-extrabold text-sm text-slate-900">
                <span>Total Net Settled</span>
                <span className="text-base text-emerald-800 tabular-nums">
                  {isScrap ? `₹${order.finalAmount || order.estimatedValue}` : 'Donation Verified'}
                </span>
              </div>
            </div>
          </div>

          {order.notes && (
            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/70 text-xs text-amber-900">
              <strong>Notes / Verification Remarks:</strong> {order.notes}
            </div>
          )}

          {/* Security & Verification Stamp */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] text-emerald-400 uppercase font-mono tracking-widest block">
                Database Verified Transaction
              </span>
              <p className="text-xs font-mono text-slate-300">
                AUTH_HASH: {order.id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 16)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
              ✓ 200
            </div>
          </div>

          {/* Print/Close Action */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download Receipt</span>
            </button>
            <button
              onClick={() => setIsReceiptModalOpen(false)}
              className="px-5 py-3 border border-slate-200 text-slate-700 rounded-xl font-semibold text-xs hover:bg-slate-50"
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
