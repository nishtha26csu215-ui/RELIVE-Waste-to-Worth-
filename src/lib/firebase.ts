import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  onSnapshot,
  query,
  where,
  deleteDoc,
  getDocFromServer,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserOrder, UserProfile } from '../types';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with specific databaseId as specified in config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Error Handling Enum and Function required by skill guidelines
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot as required by skill
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firestore connection verified successfully.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore client appears offline. Please check your network or credentials.');
    }
    return false;
  }
}
testConnection();

// Initial seed orders for demonstration of the timeline
export const INITIAL_PREVIOUS_ORDERS: UserOrder[] = [
  {
    id: 'ord-2026-001',
    userId: 'default-user',
    orderNumber: 'RLV-2026-9841',
    type: 'scrap',
    targetId: 'col-1',
    targetName: 'GreenCycle Scrap Services',
    targetRole: 'Verified Scrap Collector',
    targetPhone: '+91 98765 43210',
    targetAddress: 'Shop 14, Sector 15 Market, Gurugram',
    targetVehicle: 'Zero-Emission Cargo E-Rickshaw (#HR-26-EC-4412)',
    collectorAgentName: 'Rajesh Kumar (Gold Partner)',
    itemName: 'Polyethylene Bottles & Heavy Cardboard Cartons',
    category: 'Plastic & Cardboard',
    weightOrQty: '14.5 kg',
    estimatedValue: 180,
    finalAmount: 195,
    paymentStatus: 'paid_upi',
    paymentMethod: 'Instant UPI to Bank Account',
    paymentReference: 'UPI/REL-99214482910',
    paidAt: 'Oct 24, 2026 at 11:42 AM',
    pickupAddress: 'Palm Grove Heights, Golf Course Road, Sector 54',
    pickupHouseNo: 'Flat 402, Tower B',
    pickupCity: 'Gurugram',
    pickupLandmark: 'Opposite Central Clubhouse, Gate 2',
    date: 'Oct 24, 2026',
    timeSlot: '11:00 AM – 1:00 PM',
    completedAt: 'Oct 24, 2026 at 11:45 AM',
    status: 'completed',
    pointsEarned: 60,
    notes: 'Materials were segregated and dry. Digital scale calibration verified on spot.',
    createdAt: '2026-10-23T14:10:00Z',
    milestones: [
      {
        title: 'Order Placed & Scheduled',
        description: 'Doorstep pickup requested for 14.5 kg recyclable scrap.',
        timestamp: 'Oct 23, 2026 · 2:10 PM',
        completed: true,
        where: 'Online via RELIVE App',
      },
      {
        title: 'Collector Assigned',
        description: 'GreenCycle verified partner Rajesh Kumar accepted the pickup.',
        timestamp: 'Oct 23, 2026 · 3:30 PM',
        completed: true,
        who: 'Rajesh Kumar (+91 98765 43210)',
      },
      {
        title: 'Arrived at Doorstep',
        description: 'Collector reached Flat 402, Tower B with certified digital scale.',
        timestamp: 'Oct 24, 2026 · 11:20 AM',
        completed: true,
        where: 'Flat 402, Palm Grove Heights',
      },
      {
        title: 'Weighing & Quality Inspection',
        description: 'Verified 8.5 kg cardboard + 6.0 kg clean plastic bottles.',
        timestamp: 'Oct 24, 2026 · 11:35 AM',
        completed: true,
        who: 'Rajesh Kumar',
      },
      {
        title: 'Payment Disbursed & Received',
        description: 'Settled ₹195 directly via UPI (Ref: UPI/REL-99214482910).',
        timestamp: 'Oct 24, 2026 · 11:42 AM',
        completed: true,
        who: 'GreenCycle Account -> User Account',
      },
      {
        title: 'Order Successfully Completed',
        description: '+60 RELIVE Eco Points credited to user balance.',
        timestamp: 'Oct 24, 2026 · 11:45 AM',
        completed: true,
      },
    ],
  },
  {
    id: 'ord-2026-002',
    userId: 'default-user',
    orderNumber: 'RLV-2026-9210',
    type: 'donation',
    targetId: 'ngo-3',
    targetName: 'Vidyarthi Book Bank & Literacy Trust',
    targetRole: 'Registered Non-Profit NGO',
    targetPhone: '+91 98711 55667',
    targetAddress: 'Library Complex Basement, Central University Campus',
    targetVehicle: 'Mobile Book & Literacy Van (#DL-1C-BK-8821)',
    collectorAgentName: 'Ananya Deshmukh (Volunteer Lead)',
    itemName: 'Higher Secondary & GATE Preparation Textbooks',
    category: 'Books & Stationery',
    weightOrQty: '8 units (9.0 kg)',
    estimatedValue: 0,
    finalAmount: 0,
    paymentStatus: 'free_donation',
    paymentMethod: 'Tax-Exempt 80G Receipt & Digital Certificate',
    paymentReference: 'VBB-DON-88412',
    paidAt: 'Oct 18, 2026 at 3:15 PM',
    pickupAddress: 'Palm Grove Heights, Golf Course Road, Sector 54',
    pickupHouseNo: 'Flat 402, Tower B',
    pickupCity: 'Gurugram',
    pickupLandmark: 'Guard Desk / Reception Intercom 402',
    date: 'Oct 18, 2026',
    timeSlot: '2:30 PM – 4:30 PM',
    completedAt: 'Oct 18, 2026 at 3:20 PM',
    status: 'completed',
    pointsEarned: 50,
    notes: 'Textbooks in excellent reusable condition with handwritten study sheets included.',
    createdAt: '2026-10-17T09:00:00Z',
    milestones: [
      {
        title: 'Donation Scheduled',
        description: 'Book bank pickup booked for 8 engineering and school textbooks.',
        timestamp: 'Oct 17, 2026 · 9:00 AM',
        completed: true,
        where: 'Online via RELIVE App',
      },
      {
        title: 'NGO Confirmation',
        description: 'Vidyarthi Book Bank team acknowledged and queued van visit.',
        timestamp: 'Oct 17, 2026 · 11:15 AM',
        completed: true,
        who: 'Ananya Deshmukh (Vidyarthi Trust)',
      },
      {
        title: 'Doorstep Collection',
        description: 'Van arrived and volunteer collected books from reception.',
        timestamp: 'Oct 18, 2026 · 3:00 PM',
        completed: true,
        where: 'Palm Grove Heights Guard Desk',
      },
      {
        title: 'Receipt & Impact Certificate Issued',
        description: 'Generated 80G digital receipt #VBB-DON-88412.',
        timestamp: 'Oct 18, 2026 · 3:15 PM',
        completed: true,
        who: 'Vidyarthi Trust Accounts',
      },
      {
        title: 'Donation Completed',
        description: '+50 RELIVE Points credited & books redistributed to rural students.',
        timestamp: 'Oct 18, 2026 · 3:20 PM',
        completed: true,
      },
    ],
  },
  {
    id: 'ord-2026-003',
    userId: 'default-user',
    orderNumber: 'RLV-2026-8740',
    type: 'scrap',
    targetId: 'col-3',
    targetName: 'E-Waste Smart Safe Drop & Pick',
    targetRole: 'Government Authorized E-Waste Recycler',
    targetPhone: '+91 97112 34567',
    targetAddress: 'Electronic City Phase 2, Industrial Sector 18',
    targetVehicle: 'Certified Hazardous Containment Van (#HR-55-EV-1029)',
    collectorAgentName: 'Vikas Mehra (Lead Technical Assessor)',
    itemName: 'Old CRT Monitor, Motherboards & Defunct UPS Battery',
    category: 'E-Waste',
    weightOrQty: '7.8 kg',
    estimatedValue: 240,
    finalAmount: 260,
    paymentStatus: 'paid_upi',
    paymentMethod: 'Instant UPI to Bank Account',
    paymentReference: 'UPI/EWS-77491204',
    paidAt: 'Oct 10, 2026 at 4:30 PM',
    pickupAddress: 'Palm Grove Heights, Golf Course Road, Sector 54',
    pickupHouseNo: 'Flat 402, Tower B',
    pickupCity: 'Gurugram',
    pickupLandmark: 'Basement Parking Slot B-14',
    date: 'Oct 10, 2026',
    timeSlot: '3:00 PM – 5:00 PM',
    completedAt: 'Oct 10, 2026 at 4:35 PM',
    status: 'completed',
    pointsEarned: 40,
    notes: 'Safe handling certificate provided for lithium cells and monitor glass tube.',
    createdAt: '2026-10-09T16:20:00Z',
    milestones: [
      {
        title: 'E-Waste Pickup Booked',
        description: 'Requested hazardous e-waste pickup with certificate.',
        timestamp: 'Oct 09, 2026 · 4:20 PM',
        completed: true,
        where: 'RELIVE Online Portal',
      },
      {
        title: 'Assessor Dispatched',
        description: 'Vikas Mehra scheduled with containment vehicle.',
        timestamp: 'Oct 10, 2026 · 1:00 PM',
        completed: true,
        who: 'Vikas Mehra (+91 97112 34567)',
      },
      {
        title: 'Doorstep Testing & Weight Check',
        description: 'Certified 7.8 kg electronic scrap tested with digital meter.',
        timestamp: 'Oct 10, 2026 · 4:10 PM',
        completed: true,
        where: 'Flat 402 / Basement B-14',
      },
      {
        title: 'UPI Payout Completed',
        description: 'Transferred ₹260 directly to user UPI ID.',
        timestamp: 'Oct 10, 2026 · 4:30 PM',
        completed: true,
        who: 'E-Waste Smart Settlement Gateway',
      },
      {
        title: 'Order Finalized',
        description: 'Safe destruction certificate emailed & +40 points rewarded.',
        timestamp: 'Oct 10, 2026 · 4:35 PM',
        completed: true,
      },
    ],
  },
  {
    id: 'ord-2026-004',
    userId: 'default-user',
    orderNumber: 'RLV-2026-7910',
    type: 'scrap',
    targetId: 'col-4',
    targetName: 'Swachh Bharat Campus Recyclers',
    targetRole: 'Student-Run Campus Recycler',
    targetPhone: '+91 98990 12345',
    targetAddress: 'Student Centre Kiosk 4, University North Gate',
    targetVehicle: 'Cargo E-Bike with Trailer',
    collectorAgentName: 'Karan Verma (Eco Club Rep)',
    itemName: 'Old Examination Papers, Dockets & Magazines',
    category: 'Paper',
    weightOrQty: '18.0 kg',
    estimatedValue: 270,
    finalAmount: 270,
    paymentStatus: 'cash_collected',
    paymentMethod: 'Cash on Spot Settlement',
    paymentReference: 'CASH-REC-10492',
    paidAt: 'Sep 29, 2026 at 10:20 AM',
    pickupAddress: 'Hostel Block 4, North Campus',
    pickupHouseNo: 'Room 218',
    pickupCity: 'Gurugram',
    pickupLandmark: 'Hostel 4 Reception Guard Desk',
    date: 'Sep 29, 2026',
    timeSlot: '9:30 AM – 11:30 AM',
    completedAt: 'Sep 29, 2026 at 10:25 AM',
    status: 'completed',
    pointsEarned: 60,
    notes: 'Bulk paper bundle bundled with jute ropes.',
    createdAt: '2026-09-28T11:00:00Z',
    milestones: [
      {
        title: 'Pickup Requested',
        description: 'Campus scrap pickup requested for 18 kg paper.',
        timestamp: 'Sep 28, 2026 · 11:00 AM',
        completed: true,
        where: 'Hostel 4, Room 218',
      },
      {
        title: 'Student Volunteer Assigned',
        description: 'Karan Verma confirmed visit on E-Bike.',
        timestamp: 'Sep 28, 2026 · 2:30 PM',
        completed: true,
        who: 'Karan Verma (+91 98990 12345)',
      },
      {
        title: 'Collection & Cash Handover',
        description: 'Exact ₹270 handed over in cash with paper receipt.',
        timestamp: 'Sep 29, 2026 · 10:20 AM',
        completed: true,
        who: 'Karan Verma',
        where: 'Hostel 4 Reception',
      },
      {
        title: 'Completed',
        description: '+60 Points added.',
        timestamp: 'Sep 29, 2026 · 10:25 AM',
        completed: true,
      },
    ],
  },
  {
    id: 'ord-2026-005',
    userId: 'default-user',
    orderNumber: 'RLV-2026-6630',
    type: 'donation',
    targetId: 'ngo-1',
    targetName: 'Goonj Campus Chapter',
    targetRole: 'Clothing & Disaster Relief Support',
    targetPhone: '+91 99112 00334',
    targetAddress: 'Community Center 2, Vasant Vihar Extension',
    targetVehicle: 'NGO Relief Transport Van',
    collectorAgentName: 'Pooja Iyer (Coordinator)',
    itemName: 'Winter Woolens, Jackets & Blankets Drive',
    category: 'Clothes & Household',
    weightOrQty: '6 units (5.2 kg)',
    estimatedValue: 0,
    finalAmount: 0,
    paymentStatus: 'free_donation',
    paymentMethod: 'Official Donor Appreciation Acknowledgement',
    paymentReference: 'GNJ-DEL-33910',
    paidAt: 'Sep 15, 2026 at 1:45 PM',
    pickupAddress: 'Palm Grove Heights, Golf Course Road, Sector 54',
    pickupHouseNo: 'Flat 402, Tower B',
    pickupCity: 'Gurugram',
    pickupLandmark: 'Tower B Main Lobby',
    date: 'Sep 15, 2026',
    timeSlot: '1:00 PM – 3:00 PM',
    completedAt: 'Sep 15, 2026 at 1:50 PM',
    status: 'completed',
    pointsEarned: 50,
    notes: 'Washed and sanitised clothing sets packed in bags.',
    createdAt: '2026-09-14T10:30:00Z',
    milestones: [
      {
        title: 'Donation Scheduled',
        description: 'Winter relief clothing drive pickup booked.',
        timestamp: 'Sep 14, 2026 · 10:30 AM',
        completed: true,
        where: 'RELIVE Web Portal',
      },
      {
        title: 'Doorstep Pickup Completed',
        description: 'Goonj van collected boxed clothes.',
        timestamp: 'Sep 15, 2026 · 1:45 PM',
        completed: true,
        who: 'Pooja Iyer (+91 99112 00334)',
        where: 'Tower B Lobby',
      },
      {
        title: 'Relief Receipt Delivered',
        description: 'Certificate and +50 points issued.',
        timestamp: 'Sep 15, 2026 · 1:50 PM',
        completed: true,
      },
    ],
  },
];

// Save User signup information directly to Firestore database
export async function saveUserToDatabase(user: UserProfile): Promise<boolean> {
  const path = `users/${user.id}`;
  try {
    const userRef = doc(db, 'users', user.id);
    await setDoc(
      userRef,
      {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        houseNo: user.houseNo,
        address: user.address,
        city: user.city,
        role: user.role,
        avatarInitials: user.avatarInitials,
        points: user.points ?? 1250,
        totalWasteKg: user.totalWasteKg ?? 34.0,
        totalItemsDonated: user.totalItemsDonated ?? 12,
        moneyEarned: user.moneyEarned ?? 780,
        joinedDate: user.joinedDate || 'Today',
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );
    console.log(`User ${user.id} (${user.email}) successfully persisted to Firestore.`);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Fetch user profile from database
export async function getUserFromDatabase(userId: string): Promise<UserProfile | null> {
  const path = `users/${userId}`;
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// Save or Update Order in database
export async function saveOrderToDatabase(order: UserOrder): Promise<boolean> {
  const path = `orders/${order.id}`;
  try {
    const orderRef = doc(db, 'orders', order.id);
    await setDoc(orderRef, order, { merge: true });
    console.log(`Order ${order.id} saved to Firestore successfully.`);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Delete an order
export async function deleteOrderFromDatabase(orderId: string): Promise<boolean> {
  const path = `orders/${orderId}`;
  try {
    const orderRef = doc(db, 'orders', orderId);
    await deleteDoc(orderRef);
    console.log(`Order ${orderId} removed from Firestore.`);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Subscribe to orders in real-time
export function subscribeToOrders(
  onOrdersUpdate: (orders: UserOrder[]) => void,
  userId?: string
) {
  const path = 'orders';
  try {
    const ordersCol = collection(db, 'orders');
    return onSnapshot(
      ordersCol,
      (snapshot) => {
        if (snapshot.empty) {
          // If Firestore collection is empty, automatically seed initial previous orders
          console.log('No orders in database, seeding realistic previous orders timeline...');
          INITIAL_PREVIOUS_ORDERS.forEach(async (ord) => {
            try {
              const seedRef = doc(db, 'orders', ord.id);
              await setDoc(seedRef, ord);
            } catch (err) {
              console.error('Seed order error:', err);
            }
          });
          onOrdersUpdate(INITIAL_PREVIOUS_ORDERS);
        } else {
          const list: UserOrder[] = [];
          snapshot.forEach((d) => {
            list.push(d.data() as UserOrder);
          });
          // Sort by creation or date descending
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          onOrdersUpdate(list);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}
