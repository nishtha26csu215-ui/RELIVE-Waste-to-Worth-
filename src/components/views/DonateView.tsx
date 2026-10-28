import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DONATION_CATEGORIES, INITIAL_NGOS } from '../../data/mockData';
import { DonationCategoryId } from '../../types';
import {
  Heart,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Gift,
  Building2,
  BookOpen,
  Shirt,
  Gamepad2,
  PenTool,
  Armchair,
  Laptop,
  Home,
  Package,
} from 'lucide-react';

export const DonateView: React.FC = () => {
  const { setActiveTab, setSelectedCategoryFilter, openScheduleModal, addToast, addWasteItem, userProfile } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<DonationCategoryId>('books');

  // Form state
  const [itemName, setItemName] = useState('Calculus & Data Structures Textbooks');
  const [quantity, setQuantity] = useState('4 books');
  const [condition, setCondition] = useState<'Good' | 'Fair' | 'Reusable'>('Good');
  const [description, setDescription] = useState('Clean books in readable condition for learners and community libraries.');
  const [pickupAddress, setPickupAddress] = useState(
    userProfile.houseNo ? `${userProfile.houseNo}, ${userProfile.address}` : userProfile.address
  );

  const categoryIcons: Record<DonationCategoryId, React.ElementType> = {
    books: BookOpen,
    clothes: Shirt,
    toys: Gamepad2,
    stationery: PenTool,
    furniture: Armchair,
    electronics: Laptop,
    household: Home,
    other: Package,
  };

  const handleSelectCategory = (catId: DonationCategoryId) => {
    setSelectedCategory(catId);
    if (catId === 'books') {
      setItemName('Calculus & Data Structures Textbooks');
      setQuantity('4 books');
    } else if (catId === 'clothes') {
      setItemName('Winter Sweaters & Jackets');
      setQuantity('3 items');
    } else if (catId === 'stationery') {
      setItemName('Scientific Calculator & Geometry Box');
      setQuantity('1 set');
    } else if (catId === 'electronics') {
      setItemName('Working Android Smartphone & Charger');
      setQuantity('1 device');
    }
  };

  const handleFindNgos = () => {
    setSelectedCategoryFilter(selectedCategory);
    setActiveTab('ngos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDirectSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const matchingNgo = INITIAL_NGOS.find((n) =>
      n.acceptedCategories.includes(selectedCategory)
    ) || INITIAL_NGOS[0];

    openScheduleModal({
      type: 'ngo',
      id: matchingNgo.id,
      name: matchingNgo.name,
      phone: matchingNgo.phone,
      address: matchingNgo.address,
      defaultCategory: selectedCategory,
    });
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Top Banner with Headline & Community Impact Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs overflow-hidden">
        <div className="lg:col-span-7">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-800 uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-teal-600" />
            <span>Community Giving Hub</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500 font-medium">Donate Instead of Discarding</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            “Your unwanted item could be someone else’s need.”
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
            Pass on textbooks, wearable winter clothing, working gadgets, and household supplies directly to verified partner NGOs working with community schools, shelters, and local learning centers.
          </p>

          <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>100% Free Doorstep Pickup</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Earn +25 to +50 RELIVE Points</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Verified Non-Profit Partners</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-gradient-to-br from-teal-50 via-emerald-50/60 to-white rounded-2xl p-6 border border-teal-100/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-teal-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-teal-900">Doorstep NGO Network</span>
            </div>
            <span className="text-[11px] font-bold text-teal-700 bg-teal-100/80 px-2 py-0.5 rounded-md">8 Verified NGOs Active</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-teal-100">
              <span className="text-[10px] font-semibold text-slate-400 block uppercase">Donations Completed</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">5,420+</span>
              <span className="text-[10px] text-emerald-700 font-medium">Across all localities</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-teal-100">
              <span className="text-[10px] font-semibold text-slate-400 block uppercase">Doorstep Pickup</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">0 ₹</span>
              <span className="text-[10px] text-teal-700 font-medium">100% Free collection</span>
            </div>
          </div>

          <div className="p-3 bg-white/90 rounded-xl border border-teal-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
              💚
            </div>
            <div className="text-xs">
              <p className="font-bold text-slate-800">Direct NGO Verification</p>
              <p className="text-slate-500 text-[11px]">Volunteers weigh and inspect items at your door with complete transparency.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Select Item Categories */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Select What You Want to Donate
            </h2>
            <p className="text-xs text-slate-500">
              Choose an item category to customize your donation details
            </p>
          </div>
          <button
            onClick={() => setActiveTab('ngos')}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800"
          >
            <span>View All Partner NGOs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {DONATION_CATEGORIES.map((cat) => {
            const Icon = categoryIcons[cat.id] || Package;
            const isSelected = selectedCategory === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/70 shadow-sm ring-1 ring-teal-600'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-teal-100/60 text-teal-800 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{cat.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 truncate max-w-[100px]">
                    {cat.exampleItems[0]}
                  </span>
                  <span className="font-semibold text-teal-700">Select</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Donation Form Card */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block mb-1">
            Step 2: Customize Your Donation
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Tell Us About Your Items
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Provide details so our local NGO volunteers know what transport capacity is needed.
          </p>
        </div>

        <form onSubmit={handleDirectSchedule} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Item Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Set of 4 Engineering Textbooks"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Quantity / Estimate
              </label>
              <input
                type="text"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 4 books, 2 pairs, 1 box"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 tabular-nums"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Item Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Good">Gently Used & Clean (Ready for handover)</option>
                <option value="Reusable">Functional with Minor Marks</option>
                <option value="Fair">Fair (Wearable / Readable)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Pickup Address (House / Flat / Society)
              </label>
              <input
                type="text"
                required
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="e.g. House No. 42-B, Green Glen Residency, Sector 15"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Description / Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Cleanly packed in a reusable cloth tote bag, ready for pickup..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>

          <div className="p-4 bg-teal-50/70 border border-teal-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Ready to book doorstep donation collection?
                </p>
                <p className="text-[11px] text-slate-500">
                  Earn +25 RELIVE Points instantly upon NGO coordinator verification.
                </p>
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleFindNgos}
                className="flex-1 sm:flex-none py-2.5 px-4 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors whitespace-nowrap"
              >
                Find Nearby NGOs →
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-none py-2.5 px-5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>Schedule Pickup</span>
              </button>
            </div>
          </div>
        </form>
      </section>

    </div>
  );
};
