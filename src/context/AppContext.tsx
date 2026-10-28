import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  WasteItem,
  PickupSchedule,
  RewardBadge,
  Voucher,
  RedeemedVoucher,
  NotificationItem,
  LeaderboardEntry,
  UserProfile,
  UserOrder,
  OrderStatus,
} from '../types';
import {
  INITIAL_WASTE_FEED,
  INITIAL_USER_ITEMS,
  INITIAL_PICKUPS,
  INITIAL_BADGES,
  AVAILABLE_VOUCHERS,
  INITIAL_REDEEMED_VOUCHERS,
  INITIAL_LEADERBOARD,
  INITIAL_NOTIFICATIONS,
  POINT_RULES,
  DEFAULT_USER_PROFILE,
  INITIAL_COLLECTORS,
  INITIAL_NGOS,
} from '../data/mockData';
import {
  saveUserToDatabase,
  saveOrderToDatabase,
  deleteOrderFromDatabase,
  subscribeToOrders,
  INITIAL_PREVIOUS_ORDERS,
  testConnection,
} from '../lib/firebase';

export type ActiveTab =
  | 'home'
  | 'sell'
  | 'donate'
  | 'collectors'
  | 'ngos'
  | 'orders'
  | 'feed'
  | 'rewards'
  | 'dashboard'
  | 'leaderboard';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  // Pre-filtered state when navigating across tabs
  selectedCategoryFilter: string | null;
  setSelectedCategoryFilter: (cat: string | null) => void;

  // User Profile & Authentication (Backed by Firestore database)
  userProfile: UserProfile;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authMode: 'signin' | 'signup';
  setAuthMode: (mode: 'signin' | 'signup') => void;
  openSignIn: () => void;
  openSignUp: () => void;
  signIn: (email: string, password?: string) => { success: boolean; message: string };
  signUp: (userData: {
    name: string;
    email: string;
    houseNo: string;
    address: string;
    city: string;
    phone: string;
  }) => Promise<{ success: boolean; message: string }>;
  signOut: () => void;
  updateUserProfileInDb: (updates: Partial<UserProfile>) => Promise<void>;

  // Orders Timeline (Backed by Firestore database)
  orders: UserOrder[];
  isDatabaseConnected: boolean;
  updateOrderStatusInDb: (orderId: string, status: OrderStatus) => Promise<void>;
  deleteOrderFromDb: (orderId: string) => Promise<void>;
  createManualOrder: (order: UserOrder) => Promise<void>;

  // Waste Items & Feed
  communityFeed: WasteItem[];
  userItems: WasteItem[];
  addWasteItem: (item: Omit<WasteItem, 'id' | 'date' | 'status' | 'userCreated'>) => void;
  deleteUserItem: (id: string) => void;

  // Pickups
  pickups: PickupSchedule[];
  schedulePickup: (pickupData: Omit<PickupSchedule, 'id' | 'createdAt' | 'status'>) => PickupSchedule;
  updatePickupStatus: (id: string, status: PickupSchedule['status']) => void;
  cancelPickup: (id: string) => void;

  // Rewards & Points
  points: number;
  totalWasteKg: number;
  totalItemsDonated: number;
  moneyEarned: number;
  badges: RewardBadge[];
  vouchers: Voucher[];
  redeemedVouchers: RedeemedVoucher[];
  redeemVoucher: (voucherId: string) => { success: boolean; code?: string; message: string };

  // Leaderboard
  leaderboard: LeaderboardEntry[];

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationsCount: number;

  // Modals & UI Controls
  isAddWasteModalOpen: boolean;
  setIsAddWasteModalOpen: (open: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isProfileDbModalOpen: boolean;
  setIsProfileDbModalOpen: (open: boolean) => void;
  isAddOrderModalOpen: boolean;
  setIsAddOrderModalOpen: (open: boolean) => void;
  isReceiptModalOpen: boolean;
  setIsReceiptModalOpen: (open: boolean) => void;
  selectedReceiptOrder: UserOrder | null;
  setSelectedReceiptOrder: (order: UserOrder | null) => void;

  // Modal helpers for scheduling & dialing
  schedulingTarget: { type: 'collector' | 'ngo'; id: string; name: string; phone: string; address: string; defaultCategory?: string } | null;
  openScheduleModal: (target: { type: 'collector' | 'ngo'; id: string; name: string; phone: string; address: string; defaultCategory?: string }) => void;
  closeScheduleModal: () => void;

  callingTarget: { name: string; phone: string; role: string; hours: string } | null;
  openCallModal: (target: { name: string; phone: string; role: string; hours: string }) => void;
  closeCallModal: () => void;

  // Details Modal
  viewingCollectorId: string | null;
  setViewingCollectorId: (id: string | null) => void;
  viewingNgoId: string | null;
  setViewingNgoId: (id: string | null) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);

  // Firestore Live State
  const [orders, setOrders] = useState<UserOrder[]>(INITIAL_PREVIOUS_ORDERS);
  const [isDatabaseConnected, setIsDatabaseConnected] = useState<boolean>(true);

  // Base Data states
  const [communityFeed, setCommunityFeed] = useState<WasteItem[]>(INITIAL_WASTE_FEED);
  const [userItems, setUserItems] = useState<WasteItem[]>(INITIAL_USER_ITEMS);
  const [pickups, setPickups] = useState<PickupSchedule[]>(INITIAL_PICKUPS);
  const [points, setPoints] = useState<number>(1250);
  const [totalWasteKg, setTotalWasteKg] = useState<number>(34.0);
  const [totalItemsDonated, setTotalItemsDonated] = useState<number>(12);
  const [moneyEarned, setMoneyEarned] = useState<number>(780);
  const [badges, setBadges] = useState<RewardBadge[]>(INITIAL_BADGES);
  const [redeemedVouchers, setRedeemedVouchers] = useState<RedeemedVoucher[]>(INITIAL_REDEEMED_VOUCHERS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [leaderboard] = useState<LeaderboardEntry[]>(INITIAL_LEADERBOARD);

  // User Profile & Authentication state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    ...DEFAULT_USER_PROFILE,
    databaseSynced: true,
    lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Modals state
  const [isAddWasteModalOpen, setIsAddWasteModalOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isProfileDbModalOpen, setIsProfileDbModalOpen] = useState<boolean>(false);
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState<boolean>(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<UserOrder | null>(null);

  const [schedulingTarget, setSchedulingTarget] = useState<{
    type: 'collector' | 'ngo';
    id: string;
    name: string;
    phone: string;
    address: string;
    defaultCategory?: string;
  } | null>(null);
  const [callingTarget, setCallingTarget] = useState<{
    name: string;
    phone: string;
    role: string;
    hours: string;
  } | null>(null);
  const [viewingCollectorId, setViewingCollectorId] = useState<string | null>(null);
  const [viewingNgoId, setViewingNgoId] = useState<string | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Subscribe to real-time orders in Firestore
  useEffect(() => {
    // Check initial connection
    testConnection().then((connected) => {
      setIsDatabaseConnected(connected);
      // Persist initial user profile so document exists in database
      saveUserToDatabase(DEFAULT_USER_PROFILE).catch(console.error);
    });

    const unsubscribe = subscribeToOrders((liveOrders) => {
      if (liveOrders && liveOrders.length > 0) {
        setOrders(liveOrders);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Add waste item
  const addWasteItem = (itemData: Omit<WasteItem, 'id' | 'date' | 'status' | 'userCreated'>) => {
    const newItem: WasteItem = {
      ...itemData,
      id: 'item-' + Date.now(),
      date: 'Just now',
      status: 'available',
      userCreated: true,
    };

    setCommunityFeed((prev) => [newItem, ...prev]);
    setUserItems((prev) => [newItem, ...prev]);

    const listingBonus = 10;
    setPoints((prev) => prev + listingBonus);

    const newNotification: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: 'Waste item listed',
      message: `"${newItem.title}" was added to the live feed. Earned +${listingBonus} bonus points!`,
      type: 'points',
      timestamp: 'Just now',
      read: false,
      actionTab: 'feed',
    };
    setNotifications((prev) => [newNotification, ...prev]);
    addToast('Waste item listed successfully!');
  };

  // Delete user item
  const deleteUserItem = (id: string) => {
    setUserItems((prev) => prev.filter((item) => item.id !== id));
    setCommunityFeed((prev) => prev.filter((item) => item.id !== id));
    addToast('Item removed from listings', 'info');
  };

  // Schedule pickup & persist as a new UserOrder in Firestore database
  const schedulePickup = (pickupData: Omit<PickupSchedule, 'id' | 'createdAt' | 'status'>) => {
    const pickupId = 'pk-' + Date.now();
    const newPickup: PickupSchedule = {
      ...pickupData,
      id: pickupId,
      createdAt: 'Just now',
      status: 'scheduled',
    };

    setPickups((prev) => [newPickup, ...prev]);

    // Calculate reward points
    let earnedPoints = 15;
    if (newPickup.type === 'scrap') {
      const weightNum = parseFloat(newPickup.weightOrQty) || 5;
      const tier = POINT_RULES.scrapTiers.find((t) => weightNum >= t.min && weightNum <= t.max);
      earnedPoints = tier ? tier.points : 25;
      setTotalWasteKg((prev) => Number((prev + weightNum).toFixed(1)));
      if (newPickup.estimatedValue > 0) {
        setMoneyEarned((prev) => prev + newPickup.estimatedValue);
      }
    } else {
      earnedPoints = POINT_RULES.donationBonus.medium;
      setTotalItemsDonated((prev) => prev + 3);
    }

    setPoints((prev) => prev + earnedPoints);

    // Save also as a persistent UserOrder in Firestore database
    const orderNumber = 'RLV-2026-' + Math.floor(1000 + Math.random() * 9000);
    const collectorObj = INITIAL_COLLECTORS.find((c) => c.id === newPickup.targetId);
    const ngoObj = INITIAL_NGOS.find((n) => n.id === newPickup.targetId);

    const newOrder: UserOrder = {
      id: 'ord-' + Date.now(),
      userId: userProfile.id,
      orderNumber,
      type: newPickup.type,
      targetId: newPickup.targetId,
      targetName: newPickup.targetName,
      targetRole: newPickup.type === 'scrap' ? 'Verified Scrap Collector' : 'Registered Non-Profit NGO',
      targetPhone: newPickup.targetPhone,
      targetAddress: newPickup.targetAddress,
      targetVehicle: newPickup.type === 'scrap' ? collectorObj?.vehicleType || 'Cargo E-Rickshaw' : 'Donation Van',
      collectorAgentName: newPickup.type === 'scrap' ? 'Field Coordinator' : 'Volunteer Lead',
      itemName: newPickup.itemName,
      category: newPickup.category,
      weightOrQty: newPickup.weightOrQty,
      estimatedValue: newPickup.estimatedValue,
      finalAmount: newPickup.estimatedValue,
      paymentStatus: newPickup.type === 'scrap' ? 'pending' : 'free_donation',
      paymentMethod: newPickup.type === 'scrap' ? 'Instant UPI to Bank Account' : 'Tax-Exempt 80G Receipt',
      paymentReference: 'PENDING-' + Math.floor(10000 + Math.random() * 90000),
      pickupAddress: newPickup.pickupAddress,
      pickupHouseNo: userProfile.houseNo || 'House / Flat',
      pickupCity: userProfile.city || 'Gurugram',
      date: newPickup.date,
      timeSlot: newPickup.timeSlot,
      status: 'scheduled',
      pointsEarned: earnedPoints,
      notes: newPickup.notes || 'Scheduled via RELIVE app',
      createdAt: new Date().toISOString(),
      milestones: [
        {
          title: 'Order Placed & Scheduled',
          description: `Doorstep pickup requested for ${newPickup.itemName}.`,
          timestamp: `${newPickup.date} · ${newPickup.timeSlot}`,
          completed: true,
          where: newPickup.pickupAddress,
        },
        {
          title: 'Partner Assigned (Who)',
          description: `${newPickup.targetName} assigned to pickup.`,
          timestamp: `${newPickup.date}`,
          completed: true,
          who: newPickup.targetName,
        },
        {
          title: 'Doorstep Collection (Where)',
          description: `Collector in transit to ${newPickup.pickupAddress}.`,
          timestamp: 'Scheduled',
          completed: false,
          where: newPickup.pickupAddress,
        },
        {
          title: 'Weighing & Payment Settlement',
          description: newPickup.type === 'scrap' ? `Estimated ₹${newPickup.estimatedValue} payout upon digital verification.` : '80G Donation receipt to be issued.',
          timestamp: 'Pending',
          completed: false,
        },
      ],
    };

    saveOrderToDatabase(newOrder).catch(console.error);

    // Badges update
    setBadges((prev) =>
      prev.map((b) => {
        if (b.id === 'b-5') {
          const newProg = Math.min(b.maxProgress, b.progress + 5);
          return { ...b, progress: newProg, unlocked: newProg >= b.maxProgress };
        }
        return b;
      })
    );

    // Notification
    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: `${newPickup.type === 'scrap' ? 'Scrap' : 'Donation'} pickup scheduled`,
      message: `Pickup scheduled with ${newPickup.targetName} for ${newPickup.date}. Saved to Firestore database timeline!`,
      type: 'pickup',
      timestamp: 'Just now',
      read: false,
      actionTab: 'orders',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addToast(
      `${newPickup.type === 'scrap' ? 'Scrap' : 'Donation'} scheduled & saved to Database Timeline! +${earnedPoints} Points 🎉`,
      'success'
    );
    return newPickup;
  };

  // Update pickup status
  const updatePickupStatus = (id: string, status: PickupSchedule['status']) => {
    setPickups((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
    addToast(`Pickup status updated to: ${status.replace('_', ' ')}`, 'info');
  };

  // Cancel pickup
  const cancelPickup = (id: string) => {
    setPickups((prev) => prev.filter((p) => p.id !== id));
    addToast('Pickup request cancelled', 'info');
  };

  // Update order status directly in Firestore database
  const updateOrderStatusInDb = async (orderId: string, status: OrderStatus) => {
    const orderToUpdate = orders.find((o) => o.id === orderId);
    if (!orderToUpdate) return;

    const updated: UserOrder = {
      ...orderToUpdate,
      status,
      completedAt: status === 'completed' ? new Date().toLocaleString() : orderToUpdate.completedAt,
      paymentStatus:
        status === 'completed' && orderToUpdate.type === 'scrap'
          ? 'paid_upi'
          : orderToUpdate.paymentStatus,
      milestones: orderToUpdate.milestones?.map((m, idx) => {
        if (status === 'completed') return { ...m, completed: true };
        if (status === 'collected' && idx <= 3) return { ...m, completed: true };
        if (status === 'on_the_way' && idx <= 2) return { ...m, completed: true };
        return m;
      }),
    };

    setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    await saveOrderToDatabase(updated);
  };

  // Delete order directly from Firestore database
  const deleteOrderFromDb = async (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    await deleteOrderFromDatabase(orderId);
  };

  // Create manual/test order in Firestore
  const createManualOrder = async (newOrder: UserOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    await saveOrderToDatabase(newOrder);
  };

  // Update user profile in Firestore
  const updateUserProfileInDb = async (updates: Partial<UserProfile>) => {
    const updated: UserProfile = {
      ...userProfile,
      ...updates,
      databaseSynced: true,
      lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setUserProfile(updated);
    await saveUserToDatabase(updated);
  };

  // Redeem voucher
  const redeemVoucher = (voucherId: string) => {
    const voucher = AVAILABLE_VOUCHERS.find((v) => v.id === voucherId);
    if (!voucher) {
      return { success: false, message: 'Voucher not found.' };
    }

    if (points < voucher.pointsCost) {
      const needed = voucher.pointsCost - points;
      const errorMsg = `You need ${needed} more RELIVE points to redeem this voucher.`;
      addToast(errorMsg, 'error');
      return { success: false, message: errorMsg };
    }

    setPoints((prev) => prev - voucher.pointsCost);

    const randomCode =
      'RELIVE-' +
      Math.random().toString(36).substring(2, 6).toUpperCase() +
      Math.floor(10 + Math.random() * 90);

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + voucher.expiryDays);
    const expiryStr = expiryDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const redeemed: RedeemedVoucher = {
      id: 'red-' + Date.now(),
      voucherId: voucher.id,
      title: voucher.title,
      brand: voucher.brand,
      valueRupees: voucher.valueRupees,
      code: randomCode,
      redeemedAt: 'Just now',
      expiryDate: expiryStr,
    };

    setRedeemedVouchers((prev) => [redeemed, ...prev]);

    const notif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: 'Voucher Redeemed!',
      message: `You redeemed ${voucher.title}. Code: ${randomCode}`,
      type: 'points',
      timestamp: 'Just now',
      read: false,
      actionTab: 'rewards',
    };
    setNotifications((prev) => [notif, ...prev]);

    addToast(`Reward Redeemed! Code: ${randomCode}`, 'success');
    return { success: true, code: randomCode, message: 'Reward Redeemed! 🎉' };
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('All notifications marked as read', 'info');
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const openScheduleModal = (target: {
    type: 'collector' | 'ngo';
    id: string;
    name: string;
    phone: string;
    address: string;
    defaultCategory?: string;
  }) => {
    setSchedulingTarget(target);
  };

  const closeScheduleModal = () => {
    setSchedulingTarget(null);
  };

  const openCallModal = (target: {
    name: string;
    phone: string;
    role: string;
    hours: string;
  }) => {
    setCallingTarget(target);
  };

  const closeCallModal = () => {
    setCallingTarget(null);
  };

  const openSignIn = () => {
    setAuthMode('signin');
    setIsAuthModalOpen(true);
  };

  const openSignUp = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };

  const signIn = (email: string, _password?: string) => {
    setUserProfile((prev) => ({
      ...prev,
      email,
      isLoggedIn: true,
      databaseSynced: true,
      lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));
    setIsAuthModalOpen(false);
    addToast(`Welcome back, ${userProfile.name}! 👋 Logged into database.`, 'success');
    return { success: true, message: 'Signed in successfully.' };
  };

  // Sign up and write input information to Firestore database
  const signUp = async (userData: {
    name: string;
    email: string;
    houseNo: string;
    address: string;
    city: string;
    phone: string;
  }) => {
    const initials =
      userData.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2) || 'RS';

    const newProfile: UserProfile = {
      id: 'usr-' + Date.now(),
      name: userData.name,
      email: userData.email,
      houseNo: userData.houseNo,
      address: userData.address,
      city: userData.city,
      phone: userData.phone,
      role: 'Resident',
      avatarInitials: initials,
      joinedDate: 'Today',
      isLoggedIn: true,
      databaseSynced: true,
      lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setUserProfile(newProfile);
    const signupBonus = 100;
    setPoints((prev) => prev + signupBonus);

    // Save input sign up information directly into Cloud Firestore database!
    try {
      await saveUserToDatabase(newProfile);
      console.log('User successfully registered in Firestore users collection.');
    } catch (err) {
      console.error('Failed to write signup data to Firestore:', err);
    }

    const welcomeNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: 'Welcome to RELIVE! 🎉',
      message: `Account created & saved in Firestore database. You earned +${signupBonus} welcome bonus points!`,
      type: 'points',
      timestamp: 'Just now',
      read: false,
      actionTab: 'rewards',
    };
    setNotifications((prev) => [welcomeNotif, ...prev]);

    setIsAuthModalOpen(false);
    addToast(`Account created & saved in Firestore! +${signupBonus} Welcome Points added 🎉`, 'success');
    return { success: true, message: 'Account created successfully in database!' };
  };

  const signOut = () => {
    setUserProfile((prev) => ({
      ...prev,
      isLoggedIn: false,
    }));
    addToast('Signed out of RELIVE', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        userProfile,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        openSignIn,
        openSignUp,
        signIn,
        signUp,
        signOut,
        updateUserProfileInDb,
        orders,
        isDatabaseConnected,
        updateOrderStatusInDb,
        deleteOrderFromDb,
        createManualOrder,
        communityFeed,
        userItems,
        addWasteItem,
        deleteUserItem,
        pickups,
        schedulePickup,
        updatePickupStatus,
        cancelPickup,
        points,
        totalWasteKg,
        totalItemsDonated,
        moneyEarned,
        badges,
        vouchers: AVAILABLE_VOUCHERS,
        redeemedVouchers,
        redeemVoucher,
        leaderboard,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationsCount,
        isAddWasteModalOpen,
        setIsAddWasteModalOpen,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isProfileDbModalOpen,
        setIsProfileDbModalOpen,
        isAddOrderModalOpen,
        setIsAddOrderModalOpen,
        isReceiptModalOpen,
        setIsReceiptModalOpen,
        selectedReceiptOrder,
        setSelectedReceiptOrder,
        schedulingTarget,
        openScheduleModal,
        closeScheduleModal,
        callingTarget,
        openCallModal,
        closeCallModal,
        viewingCollectorId,
        setViewingCollectorId,
        viewingNgoId,
        setViewingNgoId,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
