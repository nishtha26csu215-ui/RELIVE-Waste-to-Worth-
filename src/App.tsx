import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HowItWorks } from './components/HowItWorks';
import { WasteCalculator } from './components/WasteCalculator';
import { CommunityFeedSection } from './components/CommunityFeedSection';
import { SellWasteView } from './components/views/SellWasteView';
import { DonateView } from './components/views/DonateView';
import { CollectorsView } from './components/views/CollectorsView';
import { NGOsView } from './components/views/NGOsView';
import { RewardsView } from './components/views/RewardsView';
import { DashboardView } from './components/views/DashboardView';
import { LeaderboardView } from './components/views/LeaderboardView';
import { OrdersTimelineView } from './components/views/OrdersTimelineView';
import { AddWasteModal } from './components/AddWasteModal';
import { SchedulePickupModal } from './components/SchedulePickupModal';
import { CollectorDetailsModal } from './components/CollectorDetailsModal';
import { NgoDetailsModal } from './components/NgoDetailsModal';
import { CallModal } from './components/CallModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { AuthModal } from './components/AuthModal';
import { OrderReceiptModal } from './components/OrderReceiptModal';
import { UserDatabaseProfileModal } from './components/UserDatabaseProfileModal';
import { AddOrderModal } from './components/AddOrderModal';
import { ToastContainer } from './components/Toast';
import { Footer } from './components/Footer';
import { Plus, Sparkles, ArrowRight, HeartHandshake, ShieldCheck } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, setIsAddWasteModalOpen } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Global Responsive Navigation */}
      <Navbar />

      {/* Main View Switcher */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            {/* Hero Section */}
            <HeroSection />

            {/* How It Works */}
            <HowItWorks />

            {/* Interactive Scrap Calculator Spotlight */}
            <section className="py-14 sm:py-20 bg-white border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mb-8">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                    <span>Instant Price Discovery</span>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-500 font-medium">Scrap Calculator</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Check What Your Household Scrap is Worth
                  </h2>
                  <p className="mt-2 text-sm sm:text-base text-slate-600">
                    Select a waste category, adjust the weight slider, and see instant valuation before booking a collector.
                  </p>
                </div>

                <WasteCalculator compact={false} />
              </div>
            </section>

            {/* Live Waste Feed Preview */}
            <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <CommunityFeedSection limit={6} showTitle={true} />
                
                <div className="mt-10 text-center">
                  <button
                    onClick={() => {
                      setActiveTab('feed');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="py-3 px-6 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-bold transition-colors inline-flex items-center gap-2 shadow-xs"
                  >
                    <span>View All Community Listings</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>

            {/* Donation Teaser Banner */}
            <section className="py-14 sm:py-18 bg-white border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-r from-teal-900 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-lg">
                  <div className="max-w-2xl relative z-10">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-300 block mb-2">
                      Non-Profit Redistribution
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                      Don’t Scrap What Can Be Reused.
                    </h2>
                    <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                      Have educational books, clean apparel, or working electronics you no longer need? Local partner NGOs will collect them directly from your doorstep for community schools and welfare drives.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        onClick={() => {
                          setActiveTab('donate');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="py-3 px-6 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-sm flex items-center gap-2"
                      >
                        <HeartHandshake className="w-4 h-4" />
                        <span>Donate Reusable Goods</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('ngos');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="py-3 px-5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors border border-white/20"
                      >
                        Explore Partner NGOs
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'sell' && <SellWasteView />}
        {activeTab === 'donate' && <DonateView />}
        {activeTab === 'collectors' && <CollectorsView />}
        {activeTab === 'ngos' && <NGOsView />}
        {activeTab === 'orders' && <OrdersTimelineView />}
        {activeTab === 'feed' && (
          <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CommunityFeedSection showTitle={true} />
          </div>
        )}
        {activeTab === 'rewards' && <RewardsView />}
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'leaderboard' && <LeaderboardView />}
      </main>

      {/* Floating Action Button (+ List a Waste Item) in Bottom-Right Corner */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setIsAddWasteModalOpen(true)}
          className="group flex items-center gap-2.5 py-3 px-4 sm:px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-95 font-bold text-xs sm:text-sm border border-emerald-500/40"
          title="List a Waste Item"
        >
          <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          <span className="tracking-wide">+ List a Waste Item</span>
        </button>
      </div>

      {/* Global Modals */}
      <AddWasteModal />
      <SchedulePickupModal />
      <CollectorDetailsModal />
      <NgoDetailsModal />
      <CallModal />
      <GlobalSearchModal />
      <AuthModal />
      <OrderReceiptModal />
      <UserDatabaseProfileModal />
      <AddOrderModal />

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
