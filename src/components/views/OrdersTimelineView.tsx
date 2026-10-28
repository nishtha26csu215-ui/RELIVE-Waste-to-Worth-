import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserOrder, OrderStatus, PaymentStatus } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Receipt,
  Search,
  Filter,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Trash2,
  Plus,
  Database,
  ArrowRight,
  Sparkles,
  Truck,
  Coins,
  Gift,
  Building,
  User,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';

export const OrdersTimelineView: React.FC = () => {
  const {
    orders,
    userProfile,
    setIsProfileDbModalOpen,
    setIsAddOrderModalOpen,
    setSelectedReceiptOrder,
    setIsReceiptModalOpen,
    openCallModal,
    updateOrderStatusInDb,
    deleteOrderFromDb,
    addToast,
    isDatabaseConnected,
    setActiveTab,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'scrap' | 'donation' | 'completed' | 'active'>('all');
  const [expandedOrderIds, setExpandedOrderIds] = useState<Record<string, boolean>>({
    'ord-2026-001': true, // Keep latest expanded by default
  });

  const toggleExpand = (id: string) => {
    setExpandedOrderIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter orders
  const filteredOrders = orders.filter((ord) => {
    // Search query matches who, where, item, or orderNumber
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(query) ||
      ord.targetName.toLowerCase().includes(query) ||
      (ord.collectorAgentName && ord.collectorAgentName.toLowerCase().includes(query)) ||
      ord.pickupAddress.toLowerCase().includes(query) ||
      ord.pickupHouseNo.toLowerCase().includes(query) ||
      ord.itemName.toLowerCase().includes(query) ||
      ord.date.toLowerCase().includes(query);

    if (!matchesSearch) return false;

    if (filterType === 'scrap') return ord.type === 'scrap';
    if (filterType === 'donation') return ord.type === 'donation';
    if (filterType === 'completed') return ord.status === 'completed';
    if (filterType === 'active') return ord.status !== 'completed' && ord.status !== 'cancelled';
    return true;
  });

  // Calculate totals
  const totalSettledRupees = orders
    .filter((o) => o.type === 'scrap' && (o.status === 'completed' || o.paymentStatus === 'paid_upi' || o.paymentStatus === 'cash_collected'))
    .reduce((sum, o) => sum + (o.finalAmount || o.estimatedValue || 0), 0);

  const completedCount = orders.filter((o) => o.status === 'completed').length;
  const totalPointsAwarded = orders.reduce((sum, o) => sum + (o.pointsEarned || 0), 0);

  const handleAdvanceStatus = async (order: UserOrder) => {
    const cycle: Record<OrderStatus, OrderStatus> = {
      scheduled: 'confirmed',
      confirmed: 'on_the_way',
      on_the_way: 'collected',
      collected: 'completed',
      completed: 'scheduled',
      cancelled: 'scheduled',
    };
    const nextStatus = cycle[order.status] || 'completed';
    await updateOrderStatusInDb(order.id, nextStatus);
    addToast(`Order ${order.orderNumber} status updated to "${nextStatus.replace('_', ' ')}" in Firestore!`);
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Page Header with Database Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Firestore Database Connected
              </span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-500 font-medium">Order History</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Previous Orders & Doorstep Pickups Timeline
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-3xl">
              Chronological ledger of all past and active pickups with recorded <strong className="text-slate-900">Dates</strong>, <strong className="text-slate-900">Times</strong>, <strong className="text-slate-900">Payment Settlements</strong>, and <strong className="text-slate-900">Who & Where</strong> doorstep collections were performed.
            </p>
          </div>

          {/* Quick Database Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsProfileDbModalOpen(true)}
              className="py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-2xs"
              title="Inspect Sign-up information stored in Firestore"
            >
              <Database className="w-4 h-4 text-emerald-700" />
              <span>Database Sign-Up Info</span>
            </button>

            <button
              onClick={() => setIsAddOrderModalOpen(true)}
              className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2"
              title="Record or simulate a new order in database"
            >
              <Plus className="w-4 h-4" />
              <span>+ Record New Order</span>
            </button>
          </div>
        </div>

        {/* User Sign-up Data Strip */}
        <div className="mt-6 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-xs">
              {userProfile.avatarInitials}
            </div>
            <div>
              <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <span>{userProfile.name}</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-normal">
                  {userProfile.role}
                </span>
              </p>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Registered Phone: <span className="text-slate-700 font-medium">{userProfile.phone}</span> · Email: <span className="text-slate-700 font-medium">{userProfile.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="text-slate-400 text-[11px]">Primary Address:</span>
            <span className="font-semibold text-slate-800 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
              {userProfile.houseNo ? `${userProfile.houseNo}, ` : ''}{userProfile.address}, {userProfile.city}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Orders in DB
          </span>
          <span className="text-3xl font-black text-slate-900 tabular-nums">
            {orders.length}
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
            {completedCount} completed successfully
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Money Settled
          </span>
          <span className="text-3xl font-black text-slate-900 tabular-nums">
            ₹{totalSettledRupees}
          </span>
          <span className="text-[11px] text-amber-700 font-semibold block mt-1">
            Paid via instant UPI & cash
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Donation Pickups
          </span>
          <span className="text-3xl font-black text-teal-800 tabular-nums">
            {orders.filter((o) => o.type === 'donation').length}
          </span>
          <span className="text-[11px] text-teal-700 font-semibold block mt-1">
            Free NGO charity distributions
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Points Credited
          </span>
          <span className="text-3xl font-black text-emerald-800 tabular-nums">
            +{totalPointsAwarded}
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
            RELIVE Eco Rewards awarded
          </span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Collector (who), Address (where), Item or Ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterType === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setFilterType('scrap')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterType === 'scrap'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Scrap Sales ({orders.filter((o) => o.type === 'scrap').length})
          </button>
          <button
            onClick={() => setFilterType('donation')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterType === 'donation'
                ? 'bg-teal-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Donations ({orders.filter((o) => o.type === 'donation').length})
          </button>
          <button
            onClick={() => setFilterType('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterType === 'completed'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Completed ({completedCount})
          </button>
          <button
            onClick={() => setFilterType('active')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterType === 'active'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            In-Progress ({orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled').length})
          </button>
        </div>
      </div>

      {/* The Visual Timeline Stream */}
      <div className="space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No matching orders found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your filter or search query, or record a new doorstep pickup order.
            </p>
            <button
              onClick={() => setIsAddOrderModalOpen(true)}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
            >
              + Record an Order
            </button>
          </div>
        ) : (
          <div className="relative pl-4 sm:pl-8 border-l-2 border-emerald-500/30 space-y-8 ml-2 sm:ml-4">
            {filteredOrders.map((order, index) => {
              const isExpanded = !!expandedOrderIds[order.id];
              const isScrap = order.type === 'scrap';

              return (
                <div key={order.id} className="relative">
                  
                  {/* Timeline Pulse Marker */}
                  <div
                    className={`absolute -left-[25px] sm:-left-[41px] top-6 w-5 h-5 rounded-full border-4 border-white flex items-center justify-center ${
                      order.status === 'completed'
                        ? 'bg-emerald-600 shadow-xs'
                        : 'bg-amber-500 ring-4 ring-amber-400/20'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  </div>

                  {/* Main Card */}
                  <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow overflow-hidden">
                    
                    {/* Top Row: Date, Time & Order ID */}
                    <div className="p-5 sm:p-6 bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      
                      {/* Date & Time Badges */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-xl text-xs font-extrabold text-slate-900 shadow-2xs">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{order.date}</span>
                        </div>

                        <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{order.timeSlot}</span>
                        </div>

                        <span className="text-xs font-mono font-bold text-slate-500">
                          #{order.orderNumber}
                        </span>
                      </div>

                      {/* Status & Type Pill */}
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            isScrap
                              ? 'bg-emerald-100 text-emerald-900'
                              : 'bg-teal-100 text-teal-900'
                          }`}
                        >
                          {isScrap ? 'Scrap Sale' : 'Donation'}
                        </span>

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            order.status === 'completed'
                              ? 'bg-emerald-500 text-slate-950 font-black'
                              : order.status === 'cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Middle Section: Who, Where & Payment Cards */}
                    <div className="p-5 sm:p-6 space-y-6">
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        
                        {/* WHO: Collector or NGO Details */}
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                              Pickup Done By (Who)
                            </span>
                            <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1">
                              <span>{order.targetName}</span>
                              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 inline" />
                            </h4>
                            <p className="text-xs text-slate-600 mt-0.5">
                              {order.targetRole}
                            </p>
                            {order.collectorAgentName && (
                              <p className="text-xs font-semibold text-emerald-800 mt-1">
                                Field Lead: {order.collectorAgentName}
                              </p>
                            )}
                            {order.targetVehicle && (
                              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                                <Truck className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">{order.targetVehicle}</span>
                              </p>
                            )}
                          </div>

                          <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                            <span className="text-[11px] font-mono text-slate-600">
                              {order.targetPhone}
                            </span>
                            <button
                              onClick={() =>
                                openCallModal({
                                  name: order.targetName,
                                  phone: order.targetPhone,
                                  role: order.targetRole,
                                  hours: 'Active on Doorstep Coordination',
                                })
                              }
                              className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-800 transition-colors flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3 text-emerald-600" />
                              <span>Call</span>
                            </button>
                          </div>
                        </div>

                        {/* WHERE: Doorstep Location Details */}
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                              Pickup Done Where (Location)
                            </span>
                            <p className="text-sm font-bold text-slate-900 leading-snug">
                              {order.pickupHouseNo ? `${order.pickupHouseNo}, ` : ''}{order.pickupAddress}
                            </p>
                            <p className="text-xs text-slate-600 mt-0.5">
                              {order.pickupCity || 'Gurugram'}
                            </p>
                            {order.pickupLandmark && (
                              <p className="text-xs text-slate-500 mt-1 italic">
                                Landmark: {order.pickupLandmark}
                              </p>
                            )}
                          </div>

                          <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] text-slate-500">
                            <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>Verified Doorstep Address</span>
                          </div>
                        </div>

                        {/* PAYMENT: Settlement Details */}
                        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                              Payment & Settlement
                            </span>
                            
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-black text-emerald-950 tabular-nums">
                                {isScrap ? `₹${order.finalAmount || order.estimatedValue}` : '₹0.00'}
                              </span>
                              <span className="text-xs font-bold text-emerald-800">
                                {isScrap
                                  ? order.paymentStatus === 'paid_upi'
                                    ? 'Paid via UPI'
                                    : order.paymentStatus === 'cash_collected'
                                    ? 'Cash on Spot'
                                    : 'Settled'
                                  : 'Free Donation'}
                              </span>
                            </div>

                            <p className="text-xs text-slate-700 mt-1">
                              {order.paymentMethod}
                            </p>
                            <p className="text-[11px] font-mono text-emerald-900 mt-0.5">
                              Ref: {order.paymentReference}
                            </p>
                          </div>

                          <div className="mt-3 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs">
                            <span className="text-emerald-800 font-bold">
                              +{order.pointsEarned} Eco Points
                            </span>
                            <button
                              onClick={() => {
                                setSelectedReceiptOrder(order);
                                setIsReceiptModalOpen(true);
                              }}
                              className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-900 rounded-lg font-bold text-[11px] border border-emerald-200 transition-colors flex items-center gap-1"
                            >
                              <Receipt className="w-3 h-3 text-emerald-700" />
                              <span>View Receipt</span>
                            </button>
                          </div>
                        </div>

                      </div>

                      {/* Items Summary Bar */}
                      <div className="p-3.5 bg-slate-100/70 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900">{order.itemName}</span>
                          <span className="text-slate-400">·</span>
                          <span className="font-semibold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                            {order.category}
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="font-bold text-slate-900 tabular-nums">{order.weightOrQty}</span>
                        </div>

                        {order.notes && (
                          <span className="text-slate-500 italic truncate max-w-sm">
                            “{order.notes}”
                          </span>
                        )}
                      </div>

                      {/* Expandable Lifecycle Milestones */}
                      {isExpanded && (
                        <div className="pt-4 border-t border-slate-100 space-y-4">
                          <div className="flex items-center justify-between">
                            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                              Doorstep Lifecycle & Event Audit Log
                            </h5>
                            <button
                              onClick={() => handleAdvanceStatus(order)}
                              className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1"
                              title="Simulate step advance in database"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Advance Status in DB</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {order.milestones?.map((m, idx) => (
                              <div
                                key={idx}
                                className={`p-3 rounded-xl border text-xs ${
                                  m.completed
                                    ? 'bg-slate-50 border-slate-200/90'
                                    : 'bg-slate-50/40 border-dashed border-slate-200 opacity-60'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                                    <CheckCircle2
                                      className={`w-3.5 h-3.5 ${
                                        m.completed ? 'text-emerald-600' : 'text-slate-300'
                                      }`}
                                    />
                                    <span>{m.title}</span>
                                  </span>
                                </div>
                                <p className="text-slate-600 text-[11px] mt-0.5">{m.description}</p>
                                <span className="text-[10px] text-slate-400 block mt-1.5 font-mono">
                                  {m.timestamp}
                                </span>
                                {m.who && (
                                  <span className="text-[10px] text-emerald-800 font-semibold block mt-0.5">
                                    By: {m.who}
                                  </span>
                                )}
                                {m.where && (
                                  <span className="text-[10px] text-slate-500 block mt-0.5">
                                    At: {m.where}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Card Footer Toggles & Actions */}
                      <div className="pt-2 flex items-center justify-between text-xs">
                        <button
                          onClick={() => toggleExpand(order.id)}
                          className="text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1 transition-colors"
                        >
                          <span>{isExpanded ? 'Hide Lifecycle Steps' : 'View Lifecycle Milestones'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedReceiptOrder(order);
                              setIsReceiptModalOpen(true);
                            }}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition-colors flex items-center gap-1.5"
                          >
                            <Receipt className="w-3.5 h-3.5 text-slate-600" />
                            <span>Digital Receipt</span>
                          </button>

                          <button
                            onClick={async () => {
                              if (window.confirm(`Delete order ${order.orderNumber} from database?`)) {
                                await deleteOrderFromDb(order.id);
                                addToast(`Order ${order.orderNumber} removed from database.`);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                            title="Delete order from Firestore"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
