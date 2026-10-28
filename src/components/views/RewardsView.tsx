import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { POINT_RULES } from '../../data/mockData';
import {
  Sparkles,
  Gift,
  Award,
  CheckCircle2,
  Lock,
  Copy,
  Check,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  X,
  CreditCard,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';

export const RewardsView: React.FC = () => {
  const {
    points,
    totalWasteKg,
    totalItemsDonated,
    moneyEarned,
    badges,
    vouchers,
    redeemedVouchers,
    redeemVoucher,
    addToast,
    setActiveTab,
  } = useApp();

  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('all');
  const [successModalData, setSuccessModalData] = useState<{
    title: string;
    code: string;
    brand: string;
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Milestone Progress
  const currentLevelTarget = 2000;
  const currentLevelStart = 1000;
  const pointsInCurrentTier = Math.max(0, points - currentLevelStart);
  const pointsNeeded = Math.max(0, currentLevelTarget - points);
  const progressPercent = Math.min(100, Math.round((pointsInCurrentTier / 1000) * 100));

  const handleRedeem = (voucherId: string) => {
    const voucher = vouchers.find((v) => v.id === voucherId);
    if (!voucher) return;

    const result = redeemVoucher(voucherId);
    if (result.success && result.code) {
      setSuccessModalData({
        title: voucher.title,
        code: result.code,
        brand: voucher.brand,
      });
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    addToast('Voucher code copied to clipboard!', 'info');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const categories = ['all', 'Shopping', 'Food', 'Entertainment', 'Eco Store', 'Campus Café'];

  const filteredVouchers = vouchers.filter((v) =>
    activeCategoryTab === 'all' ? true : v.category === activeCategoryTab
  );

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Hero Banner: Points Dashboard */}
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Points Display */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>RELIVE Rewards Club · Community Green Tier</span>
            </div>

            <div>
              <span className="text-xs text-slate-300 uppercase font-semibold">Available Balance</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-5xl sm:text-6xl font-black tracking-tight tabular-nums text-white">
                  {points.toLocaleString()}
                </span>
                <span className="text-xl font-bold text-emerald-300">RELIVE Points</span>
              </div>
            </div>

            {/* Progress Bar to Next Tier */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 max-w-lg">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-emerald-200">
                  Tier Progress: Silver Recycler
                </span>
                <span className="font-bold text-white tabular-nums">
                  {points} / {currentLevelTarget} pts
                </span>
              </div>
              <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-teal-300 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(10, progressPercent)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-300 mt-2">
                {pointsNeeded > 0
                  ? `${pointsNeeded} more points to unlock your Gold Eco-Pass and premium vouchers!`
                  : 'Congratulations! You reached the Gold Tier!'}
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <span className="text-[11px] font-semibold text-slate-300 block">Total Recycled</span>
              <span className="text-2xl font-black text-white tabular-nums mt-0.5 block">
                {totalWasteKg} kg
              </span>
              <span className="text-[10px] text-emerald-300">Diverted from landfill</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <span className="text-[11px] font-semibold text-slate-300 block">Items Donated</span>
              <span className="text-2xl font-black text-white tabular-nums mt-0.5 block">
                {totalItemsDonated}
              </span>
              <span className="text-[10px] text-teal-300">Given to NGOs</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <span className="text-[11px] font-semibold text-slate-300 block">Scrap Money Made</span>
              <span className="text-2xl font-black text-white tabular-nums mt-0.5 block">
                ₹{moneyEarned}
              </span>
              <span className="text-[10px] text-amber-300">Instant cash / UPI</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <span className="text-[11px] font-semibold text-slate-300 block">Points This Month</span>
              <span className="text-2xl font-black text-emerald-300 tabular-nums mt-0.5 block">
                +320
              </span>
              <span className="text-[10px] text-slate-300">From 3 pickups</span>
            </div>
          </div>

        </div>
      </div>

      {/* Point Earning Rules Guide */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              How to Earn RELIVE Points
            </h2>
            <p className="text-xs text-slate-500">
              Every kilogram recycled and item donated directly boosts your balance
            </p>
          </div>
          <button
            onClick={() => setActiveTab('sell')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Start Recycling Scrap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Scrap Tiers */}
          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
            <h3 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              Recycling Weight Rewards
            </h3>
            <div className="space-y-2 text-xs">
              {POINT_RULES.scrapTiers.map((tier, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-white border border-emerald-100/80 font-medium"
                >
                  <span className="text-slate-700">
                    {tier.min}–{tier.max === 999 ? '20+' : tier.max} kg recycled
                  </span>
                  <span className="font-extrabold text-emerald-700 tabular-nums">
                    +{tier.points} points
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Donation Bonuses */}
          <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100">
            <h3 className="text-xs font-extrabold text-teal-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-600" />
              Donation Bonus Points
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-teal-100/80 font-medium">
                <span className="text-slate-700">Small donation (1–2 items / books)</span>
                <span className="font-extrabold text-teal-700 tabular-nums">
                  +{POINT_RULES.donationBonus.small} points
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-teal-100/80 font-medium">
                <span className="text-slate-700">Medium donation (3–5 books / clothes)</span>
                <span className="font-extrabold text-teal-700 tabular-nums">
                  +{POINT_RULES.donationBonus.medium} points
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-teal-100/80 font-medium">
                <span className="text-slate-700">Large donation (6+ items or electronics)</span>
                <span className="font-extrabold text-teal-700 tabular-nums">
                  +{POINT_RULES.donationBonus.large} points
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-teal-100/80 font-medium">
                <span className="text-slate-700">First pickup scheduled bonus</span>
                <span className="font-extrabold text-amber-600 tabular-nums">
                  +10 bonus points
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievement Badges */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Eco Badges & Milestones
            </h2>
            <p className="text-xs text-slate-500">
              Celebrate your sustainability milestones in your neighborhood
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-between transition-all ${
                b.unlocked
                  ? 'bg-white border-emerald-200 shadow-2xs hover:shadow-sm'
                  : 'bg-slate-50 border-slate-200 opacity-75'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl mb-2 relative">
                <span>{b.emoji}</span>
                {!b.unlocked && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center">
                    <Lock className="w-3 h-3" />
                  </div>
                )}
              </div>

              <h4 className="text-xs font-bold text-slate-900 leading-snug">
                {b.title}
              </h4>
              <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                {b.description}
              </p>

              <div className="mt-3 w-full pt-2 border-t border-slate-100">
                {b.unlocked ? (
                  <span className="text-[10px] font-bold text-emerald-700 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Unlocked
                  </span>
                ) : (
                  <div className="space-y-1">
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-1.5 rounded-full"
                        style={{ width: `${Math.round((b.progress / b.maxProgress) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[9px] font-semibold text-slate-400 tabular-nums block">
                      {b.progress}/{b.maxProgress}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rewards Store */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
              <span>Redeem Points</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-500 font-medium">RELIVE Rewards Store</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Exchange Points for Real Vouchers
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Direct vouchers for neighborhood cafés, online grocery, book orders, and zero-waste stores.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategoryTab(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeCategoryTab === c
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {c === 'all' ? 'All Rewards' : c}
              </button>
            ))}
          </div>
        </div>

        {/* Vouchers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVouchers.map((voucher) => {
            const canAfford = points >= voucher.pointsCost;
            const pointsShort = voucher.pointsCost - points;

            return (
              <div
                key={voucher.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                        {voucher.category}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 mt-1.5">
                        {voucher.title}
                      </h3>
                      <p className="text-xs font-semibold text-slate-600">
                        {voucher.brand}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-lg font-black text-emerald-700 tabular-nums block">
                        {voucher.pointsCost}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        points
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {voucher.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                    <span>Valid for {voucher.expiryDays} days · {voucher.terms}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-900">
                    Worth: <span className="text-emerald-700 tabular-nums">₹{voucher.valueRupees}</span>
                  </div>

                  <button
                    onClick={() => handleRedeem(voucher.id)}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                      canAfford
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200 cursor-pointer'
                    }`}
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>{canAfford ? 'Redeem Voucher' : `Need ${pointsShort} pts`}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Redeemed Vouchers History */}
      {redeemedVouchers.length > 0 && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <span>My Active Vouchers & Coupons ({redeemedVouchers.length})</span>
            </h3>
            <span className="text-xs text-slate-500">Show code at checkout</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {redeemedVouchers.map((rv) => (
              <div
                key={rv.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    {rv.brand}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-0.5">{rv.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Expires: {rv.expiryDate}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="font-mono font-bold text-xs bg-white px-2.5 py-1 rounded-lg border border-slate-300 text-slate-900 tracking-wider">
                    {rv.code}
                  </span>

                  <button
                    onClick={() => handleCopyCode(rv.code)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 rounded-lg transition-colors flex items-center gap-1 text-xs"
                    title="Copy code"
                  >
                    {copiedCode === rv.code ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span className="text-[11px]">{copiedCode === rv.code ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Success Modal upon Redemption */}
      {successModalData && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-2xl overflow-hidden p-6 text-center animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setSuccessModalData(null)}
              className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-slate-700"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-4">
              <Sparkles className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-extrabold text-slate-900">
              Reward Redeemed! 🎉
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              You redeemed {successModalData.title} from {successModalData.brand}.
            </p>

            <div className="mt-5 p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block mb-1">
                Your Voucher Code
              </span>
              <p className="font-mono text-xl font-black text-emerald-950 tracking-widest tabular-nums">
                {successModalData.code}
              </p>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => handleCopyCode(successModalData.code)}
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Voucher Code</span>
              </button>
              <button
                onClick={() => setSuccessModalData(null)}
                className="py-2.5 px-4 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
