export type WasteCategoryId =
  | 'plastic'
  | 'paper'
  | 'cardboard'
  | 'metal'
  | 'glass'
  | 'ewaste'
  | 'books'
  | 'household'
  | 'clothes'
  | 'other';

export interface WasteCategory {
  id: WasteCategoryId;
  name: string;
  pricePerKg: number;
  unit: string;
  exampleItems: string[];
  description: string;
  co2SavedPerKg: number; // in kg CO2e
  color: string;
}

export type DonationCategoryId =
  | 'books'
  | 'clothes'
  | 'toys'
  | 'stationery'
  | 'furniture'
  | 'electronics'
  | 'household'
  | 'other';

export interface DonationCategory {
  id: DonationCategoryId;
  name: string;
  exampleItems: string[];
  description: string;
  color: string;
}

export interface WasteItem {
  id: string;
  title: string;
  category: WasteCategoryId | DonationCategoryId;
  categoryName: string;
  weightKg: number;
  type: 'sell' | 'donate';
  estimatedValue: number;
  condition: 'Good' | 'Fair' | 'Scrap' | 'Reusable';
  description: string;
  location: string;
  date: string;
  status: 'available' | 'scheduled' | 'collected' | 'donated';
  userCreated?: boolean;
}

export interface ScrapCollector {
  id: string;
  name: string;
  rating: number;
  reviewsCount: number;
  distanceKm: number;
  address: string;
  phone: string;
  acceptedCategories: WasteCategoryId[];
  workingHours: string;
  availableToday: boolean;
  verified: boolean;
  vehicleType: string;
  pricingInfo: string;
  experienceYears: number;
}

export interface NGO {
  id: string;
  name: string;
  cause: string;
  rating: number;
  reviewsCount: number;
  distanceKm: number;
  address: string;
  phone: string;
  acceptedCategories: DonationCategoryId[];
  workingHours: string;
  pickupAvailable: boolean;
  verified: boolean;
  description: string;
  itemsReceivedCount: number;
}

export type PickupStep = 'scheduled' | 'confirmed' | 'on_the_way' | 'collected' | 'completed';

export interface PickupSchedule {
  id: string;
  type: 'scrap' | 'donation';
  targetId: string;
  targetName: string;
  targetPhone: string;
  targetAddress: string;
  itemName: string;
  category: string;
  weightOrQty: string;
  estimatedValue: number;
  pickupAddress: string;
  date: string;
  timeSlot: string;
  phone: string;
  status: PickupStep;
  createdAt: string;
  notes?: string;
}

export interface RewardBadge {
  id: string;
  title: string;
  emoji: string;
  description: string;
  requirement: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  unlockedDate?: string;
}

export interface Voucher {
  id: string;
  title: string;
  brand: string;
  category: 'Shopping' | 'Food' | 'Entertainment' | 'Eco Store' | 'Campus Café';
  pointsCost: number;
  valueRupees: number;
  description: string;
  expiryDays: number;
  terms: string;
}

export interface RedeemedVoucher {
  id: string;
  voucherId: string;
  title: string;
  brand: string;
  valueRupees: number;
  code: string;
  redeemedAt: string;
  expiryDate: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  college: string;
  wasteRecycledKg: number;
  itemsDonated: number;
  points: number;
  isCurrentUser?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'pickup' | 'points' | 'donation' | 'badge' | 'system';
  timestamp: string;
  read: boolean;
  actionTab?: string;
}

export type PaymentStatus =
  | 'paid_upi'
  | 'cash_collected'
  | 'free_donation'
  | 'pending'
  | 'credited_wallet';

export type OrderStatus =
  | 'scheduled'
  | 'confirmed'
  | 'on_the_way'
  | 'collected'
  | 'completed'
  | 'cancelled';

export interface OrderTimelineMilestone {
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  who?: string;
  where?: string;
}

export interface UserOrder {
  id: string;
  userId: string;
  orderNumber: string;
  type: 'scrap' | 'donation';
  // WHO
  targetId: string;
  targetName: string;
  targetRole: string;
  targetPhone: string;
  targetAddress: string;
  targetVehicle: string;
  collectorAgentName?: string;
  // ITEM & QUANTITY
  itemName: string;
  category: string;
  weightOrQty: string;
  // PAYMENT
  estimatedValue: number;
  finalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  paymentReference: string;
  paidAt?: string;
  // WHERE
  pickupAddress: string;
  pickupHouseNo: string;
  pickupCity: string;
  pickupLandmark?: string;
  // DATE & TIME
  date: string;
  timeSlot: string;
  completedAt?: string;
  // STATUS & REWARDS
  status: OrderStatus;
  pointsEarned: number;
  notes?: string;
  createdAt: string;
  // LIFECYCLE MILESTONES
  milestones?: OrderTimelineMilestone[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  houseNo: string;
  address: string;
  city: string;
  phone: string;
  role: 'Resident' | 'Household' | 'Student' | 'Collector' | 'Volunteer';
  avatarInitials: string;
  joinedDate: string;
  isLoggedIn: boolean;
  points?: number;
  totalWasteKg?: number;
  totalItemsDonated?: number;
  moneyEarned?: number;
  databaseSynced?: boolean;
  lastSyncedAt?: string;
}
