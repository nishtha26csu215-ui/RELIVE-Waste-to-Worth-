import React from 'react';
import { useApp } from '../context/AppContext';
import { Recycle, Heart, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <Recycle className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                RELIVE
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              “Turn Your Waste Into Worth.” A modern student-friendly waste management platform connecting college campuses and residential neighborhoods with certified scrap collectors and charitable NGOs.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold pt-1">
              <span>Recycle. Donate. Earn. Repeat.</span>
            </div>
          </div>

          {/* Quick Links 1 */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('sell');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Sell Recyclable Waste
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('donate');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Donate to Partner NGOs
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('collectors');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Nearby Scrap Collectors
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('rewards');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  RELIVE Rewards Store
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links 2 */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Community & Safety
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('leaderboard');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Inter-College Leaderboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('dashboard');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Eco-Impact Calculator
                </button>
              </li>
              <li className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Weighing Guarantee</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} RELIVE — Waste to Worth. Built for College Sustainability Hackathon.
          </p>
          <p className="flex items-center gap-1">
            Empowering circular student economies
          </p>
        </div>

      </div>
    </footer>
  );
};
