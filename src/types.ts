export type UserRole = 'owner' | 'agent' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyName?: string;
  phone?: string;
  avatar?: string;
}

export type VesselType = 'Container' | 'Bulk Carrier' | 'LCT' | 'Tug & Barge' | 'General Cargo' | 'Tanker';
export type VesselStatus = 'Underway' | 'Moored' | 'Anchored' | 'Docking' | 'Maintenance';

export interface Vessel {
  id: string;
  name: string;
  callSign: string;
  mmsi: string;
  imo: string;
  type: VesselType;
  flag: string;
  dwt: number; // Deadweight tonnage in tons
  capacityTeu?: number; // For container ships
  capacityTon?: number;
  yearBuilt: number;
  status: VesselStatus;
  speedKnots: number;
  headingDeg: number;
  currentLocationName: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  captainName: string;
  crewCount: number;
  fuelLevelPercent: number;
  lastUpdated: string;
  destinationPort: string;
  eta: string;
  photoUrl?: string;
}

export interface Voyage {
  id: string;
  voyageNumber: string;
  vesselId: string;
  vesselName: string;
  originPort: string;
  destinationPort: string;
  etd: string; // Estimated Time of Departure
  eta: string; // Estimated Time of Arrival
  actualDeparture?: string;
  actualArrival?: string;
  status: 'Scheduled' | 'Loading' | 'En Route' | 'Discharging' | 'Completed' | 'Delayed';
  totalCapacityTeu: number;
  bookedCapacityTeu: number;
  pricePerTeu: number; // in IDR
  pricePerTon: number; // in IDR
  transitDays: number;
  notes?: string;
}

export type CargoType = 'Dry Container 20ft' | 'Dry Container 40ft' | 'Reefer Container' | 'General Cargo' | 'Heavy Equipment / Vehicles' | 'Bulk Cargo (Curah)';
export type BookingStatus = 'Pending' | 'Confirmed' | 'Port Gate-In' | 'Loaded' | 'In Transit' | 'Arrived' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Unpaid' | 'Deposit Paid' | 'Paid in Full' | 'Overdue';

export interface TrackingEvent {
  id: string;
  timestamp: string;
  title: string;
  location: string;
  description: string;
  completed: boolean;
}

export interface Booking {
  id: string;
  bookingNumber: string; // e.g. BKG-2026-0881
  blNumber: string; // Bill of Lading e.g. BL-NSM-99124
  customerId: string;
  customerName: string;
  customerCompany: string;
  customerPhone: string;
  customerEmail: string;
  agentId?: string;
  agentName?: string;
  voyageId: string;
  vesselId: string;
  vesselName: string;
  originPort: string;
  destinationPort: string;
  cargoType: CargoType;
  cargoDescription: string;
  quantity: number; // Number of containers or items
  weightTons: number;
  volumeCbm?: number;
  hasInsurance: boolean;
  totalCost: number; // IDR
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  createdAt: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  consigneeName: string; // Penerima
  consigneePhone: string;
  trackingHistory: TrackingEvent[];
}

export type TransactionType = 'Income' | 'Expense';
export type ExpenseCategory = 'Fuel / Bunkering' | 'Port Dues & Pilotage' | 'Crew Salaries & Meals' | 'Vessel Maintenance & Dok' | 'Insurance & Licensing' | 'Agency Commission' | 'Handling & Stevedoring' | 'Other';
export type IncomeCategory = 'Freight Payment' | 'Demurrage / Detention' | 'Handling Fee' | 'Charter Contract' | 'Other Income';

export interface FinancialTransaction {
  id: string;
  transactionNumber: string;
  date: string;
  type: TransactionType;
  category: ExpenseCategory | IncomeCategory;
  amount: number; // IDR
  vesselId?: string;
  vesselName?: string;
  voyageId?: string;
  bookingId?: string;
  description: string;
  status: 'Pending' | 'Approved' | 'Settled';
  receiptUrl?: string;
  approvedBy?: string;
}

export interface FinancialSummary {
  totalRevenue: number;
  totalExpense: number;
  netProfit: number;
  profitMarginPercent: number;
  unpaidReceivables: number;
  monthlyData: {
    month: string;
    revenue: number;
    expense: number;
    profit: number;
  }[];
  expenseBreakdown: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  vesselProfitability: {
    vesselId: string;
    vesselName: string;
    revenue: number;
    expense: number;
    profit: number;
  }[];
}
