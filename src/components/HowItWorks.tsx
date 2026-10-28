import React from 'react';
import { useApp } from '../context/AppContext';
import { PlusCircle, Calculator, Users, Gift, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const { setActiveTab, setIsAddWasteModalOpen } = useApp();

  const steps = [
    {
      num: '01',
      title: 'List Your Item',
      description: 'Snap or describe the scrap material or reusable household item you want to clear out from your room or apartment.',
      icon: PlusCircle,
      action: 'List item',
      onClick: () => setIsAddWasteModalOpen(true),
    },
    {
      num: '02',
      title: 'Calculate Value',
      description: 'Enter the estimated weight and instantly see live scrap market valuation or potential donor impact score.',
      icon: Calculator,
      action: 'Open calculator',
      onClick: () => {
        setActiveTab('sell');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      num: '03',
      title: 'Connect & Schedule',
      description: 'Browse verified local collectors or partner NGOs. Book a convenient 2-hour doorstep pickup slot.',
      icon: Users,
      action: 'Find collectors',
      onClick: () => {
        setActiveTab('collectors');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      num: '04',
      title: 'Earn & Redeem',
      description: 'Hand over waste, receive instant payment from collectors, collect RELIVE reward points, and redeem gift vouchers.',
      icon: Gift,
      action: 'Explore vouchers',
      onClick: () => {
        setActiveTab('rewards');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
  ];

  return (
    <section className="py-14 sm:py-18 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
            <span>Simple 4-Step Journey</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500 font-medium">How RELIVE Works</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            From Clutter to Real Cash & Good Karma
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            A frictionless loop designed for households, apartments, and residents to turn unused scrap and belongings into tangible value.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-2xl font-black text-slate-300 tabular-nums">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={step.onClick}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
                  >
                    <span>{step.action}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
