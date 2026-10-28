import React, { useState, useRef, useEffect } from 'react';
import { useApp, ActiveTab } from '../context/AppContext';
import {
  Recycle,
  Search,
  Bell,
  Sparkles,
  Menu,
  X,
  Plus,
  Check,
  Calendar,
  Gift,
  Award,
  ChevronRight,
  User,
  LogOut,
  LogIn,
  Database,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    points,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setIsAddWasteModalOpen,
    setIsSearchModalOpen,
    setIsProfileDbModalOpen,
    userProfile,
    openSignIn,
    openSignUp,
    signOut,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'sell', label: 'Sell Waste' },
    { id: 'donate', label: 'Donate' },
    { id: 'collectors', label: 'Collectors' },
    { id: 'ngos', label: 'NGOs' },
    { id: 'orders', label: 'Order Timeline' },
    { id: 'feed', label: 'Waste Feed' },
    { id: 'rewards', label: 'Rewards' },
    { id: 'dashboard', label: 'Dashboard' },
  ];

  const handleNavClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
              <Recycle className="w-5 h-5 transition-transform duration-500 group-hover:rotate-45" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1">
                RELIVE
              </span>
              <span className="text-[10px] font-medium text-emerald-700 tracking-wide -mt-1 hidden sm:inline">
                Waste to Worth
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-emerald-700 bg-emerald-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions Cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Global Search Button */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Search waste, collectors & NGOs"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications Popover */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">Notifications</span>
                      {unreadNotificationsCount > 0 && (
                        <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                          {unreadNotificationsCount} new
                        </span>
                      )}
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-sm text-slate-400">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            if (notif.actionTab) {
                              handleNavClick(notif.actionTab as ActiveTab);
                            }
                            setNotificationsOpen(false);
                          }}
                          className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex gap-3 ${
                            !notif.read ? 'bg-emerald-50/50' : ''
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {notif.type === 'pickup' && (
                              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                <Calendar className="w-4 h-4" />
                              </div>
                            )}
                            {notif.type === 'points' && (
                              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                                <Sparkles className="w-4 h-4" />
                              </div>
                            )}
                            {notif.type === 'donation' && (
                              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center">
                                <Gift className="w-4 h-4" />
                              </div>
                            )}
                            {notif.type === 'badge' && (
                              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
                                <Award className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={`text-xs ${!notif.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                                {notif.title}
                              </p>
                              <span className="text-[10px] text-slate-400 tabular-nums">
                                {notif.timestamp}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                              {notif.message}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
                    <button
                      onClick={() => {
                        handleNavClick('dashboard');
                        setNotificationsOpen(false);
                      }}
                      className="text-xs font-semibold text-slate-700 hover:text-emerald-700 transition-colors flex items-center justify-center gap-1 w-full py-1"
                    >
                      View in Dashboard <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Points pill */}
            <button
              onClick={() => handleNavClick('rewards')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg hover:bg-emerald-100 transition-colors"
              title="Your RELIVE Rewards Points"
            >
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold tabular-nums">{points.toLocaleString()}</span>
              <span className="text-[11px] font-semibold text-emerald-700">pts</span>
            </button>

            {/* Profile Avatar / Auth Buttons */}
            {userProfile.isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2 sm:pr-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors focus:outline-none"
                  aria-label="User Account"
                >
                  <span className="hidden md:inline text-xs font-bold text-slate-800 max-w-[90px] truncate">
                    {userProfile.name}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-extrabold text-[11px] shadow-xs">
                    {userProfile.avatarInitials}
                  </div>
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="p-4 bg-slate-50 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                          {userProfile.avatarInitials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {userProfile.name}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {userProfile.email}
                          </p>
                          <p className="text-[10px] text-emerald-700 font-semibold mt-0.5 truncate">
                            {userProfile.houseNo ? `${userProfile.houseNo}, ${userProfile.address}` : userProfile.address}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-1.5 space-y-0.5 text-xs">
                      <button
                        onClick={() => {
                          handleNavClick('dashboard');
                          setProfileMenuOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left rounded-lg text-slate-700 hover:bg-slate-100 flex items-center gap-2 font-medium"
                      >
                        <User className="w-4 h-4 text-slate-500" />
                        <span>My Dashboard & Eco Score</span>
                      </button>

                      <button
                        onClick={() => {
                          handleNavClick('orders');
                          setProfileMenuOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left rounded-lg text-slate-700 hover:bg-slate-100 flex items-center gap-2 font-medium"
                      >
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span>Previous Orders Timeline</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsProfileDbModalOpen(true);
                          setProfileMenuOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left rounded-lg text-slate-700 hover:bg-slate-100 flex items-center gap-2 font-medium"
                      >
                        <Database className="w-4 h-4 text-emerald-600" />
                        <span>Database Sign-Up Info</span>
                      </button>

                      <button
                        onClick={() => {
                          handleNavClick('rewards');
                          setProfileMenuOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left rounded-lg text-slate-700 hover:bg-slate-100 flex items-center justify-between font-medium"
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-600" />
                          <span>Rewards & Vouchers</span>
                        </div>
                        <span className="font-bold text-emerald-700 tabular-nums">
                          {points} pts
                        </span>
                      </button>

                      <div className="pt-1 mt-1 border-t border-slate-100">
                        <button
                          onClick={() => {
                            signOut();
                            setProfileMenuOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left rounded-lg text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={openSignIn}
                  className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
                >
                  Sign In
                </button>
                <button
                  onClick={openSignUp}
                  className="px-3 py-1.5 text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 rounded-lg transition-colors whitespace-nowrap"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Primary CTA: + List Waste */}
            <button
              onClick={() => setIsAddWasteModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>List Waste</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            {userProfile.isLoggedIn ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  {userProfile.avatarInitials}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{userProfile.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {userProfile.houseNo ? `${userProfile.houseNo}, ${userProfile.city}` : userProfile.city}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openSignIn();
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 rounded-lg"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openSignUp();
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg"
                >
                  Sign Up (+100 Pts)
                </button>
              </div>
            )}
            <button
              onClick={() => handleNavClick('rewards')}
              className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-800 text-xs font-bold tabular-nums"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              {points} pts
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsAddWasteModalOpen(true);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold shadow-sm"
            >
              <Plus className="w-4 h-4" /> List Waste Item
            </button>
            {userProfile.isLoggedIn && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut();
                }}
                className="p-2.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
