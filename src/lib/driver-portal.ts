export type DriverAvailability = "Online" | "Offline";

export type DriverRideStatus = "New Request" | "Assigned" | "In Progress" | "Completed" | "Cancelled";

export interface DriverProfile {
  name: string;
  city: string;
  rating: string;
  responseRate: string;
  vehicle: string;
  plate: string;
  memberSince: string;
  totalRides: number;
  initials: string;
}

export interface RideRequest {
  id: string;
  rider: string;
  pickup: string;
  destination: string;
  fare: string;
  distance: string;
  time: string;
  status: DriverRideStatus;
  tier: "Daily" | "EV Eco" | "Luxe";
}

export interface CompletedRide {
  id: string;
  rider: string;
  route: string;
  payout: string;
  rating: string;
  time: string;
  tier: "Daily" | "EV Eco" | "Luxe";
}

export interface AcceptedRide {
  id: string;
  rider: string;
  route: string;
  fare: string;
  eta: string;
  time: string;
  tier: "Daily" | "EV Eco" | "Luxe";
}

export interface EarningsItem {
  label: string;
  value: string;
  note: string;
}

export const driverProfile: DriverProfile = {
  name: "Vikram Malhotra",
  city: "Bengaluru",
  rating: "4.99",
  responseRate: "98%",
  vehicle: "Tesla Model Y",
  plate: "KA 05 HY 5021",
  memberSince: "June 2024",
  totalRides: 1248,
  initials: "VM",
};

export const rideRequests: RideRequest[] = [
  {
    id: "req_1",
    rider: "Ananya Rao",
    pickup: "Indiranagar Metro, Bengaluru",
    destination: "RMZ Ecospace, Bellandur, Bengaluru",
    fare: "₹180",
    distance: "7.4 km",
    time: "Now",
    status: "New Request",
    tier: "EV Eco",
  },
  {
    id: "req_2",
    rider: "Kabir Mehta",
    pickup: "MG Road, Bengaluru",
    destination: "Kempegowda Airport T2, Bengaluru",
    fare: "₹540",
    distance: "34.1 km",
    time: "8 min",
    status: "Assigned",
    tier: "Luxe",
  },
  {
    id: "req_3",
    rider: "Nisha Iyer",
    pickup: "Koramangala 5th Block, Bengaluru",
    destination: "Forum South Mall, Bengaluru",
    fare: "₹240",
    distance: "3.2 km",
    time: "12 min",
    status: "In Progress",
    tier: "Daily",
  },
];

export const completedRides: CompletedRide[] = [
  {
    id: "ride_1",
    rider: "Meera Nair",
    route: "Whitefield to Trinity Circle, Bengaluru",
    payout: "₹320",
    rating: "5.0",
    time: "7:20 PM",
    tier: "EV Eco",
  },
  {
    id: "ride_2",
    rider: "Arjun Sethi",
    route: "HSR Layout to MG Road, Bengaluru",
    payout: "₹280",
    rating: "4.9",
    time: "5:45 PM",
    tier: "Daily",
  },
  {
    id: "ride_3",
    rider: "Sara Khan",
    route: "Jayanagar to UB City, Bengaluru",
    payout: "₹420",
    rating: "5.0",
    time: "2:15 PM",
    tier: "Luxe",
  },
];

export const acceptedRides: AcceptedRide[] = [
  {
    id: "acc_1",
    rider: "Ananya Rao",
    route: "Indiranagar Metro to RMZ Ecospace",
    fare: "₹180",
    eta: "4 min pickup",
    time: "Now",
    tier: "EV Eco",
  },
  {
    id: "acc_2",
    rider: "Kabir Mehta",
    route: "MG Road to Kempegowda Airport T2",
    fare: "₹540",
    eta: "11 min ride",
    time: "8 min ago",
    tier: "Luxe",
  },
];

export const earningsBreakdown: EarningsItem[] = [
  { label: "Base fares", value: "₹4,250", note: "24 completed trips" },
  { label: "Peak bonuses", value: "₹880", note: "4 evening surges" },
  { label: "Tips", value: "₹475", note: "12 rider tips" },
  { label: "Daily total", value: "₹5,605", note: "Expected payout tonight" },
];

export const weeklyPayouts: EarningsItem[] = [
  { label: "Monday", value: "₹4,840", note: "21 trips" },
  { label: "Tuesday", value: "₹4,720", note: "19 trips" },
  { label: "Wednesday", value: "₹5,010", note: "23 trips" },
  { label: "Thursday", value: "₹4,960", note: "22 trips" },
  { label: "Friday", value: "₹5,180", note: "25 trips" },
];

export const monthlyEarnings: EarningsItem[] = [
  { label: "This month", value: "₹34,200", note: "Projected payout" },
  { label: "Last month", value: "₹31,050", note: "Finalized payout" },
];

export const earningsSummaryCards: EarningsItem[] = [
  { label: "Base fares", value: "₹25,400", note: "74% of monthly total" },
  { label: "Peak bonuses", value: "₹4,200", note: "Rush-hour earnings" },
  { label: "Tips", value: "₹2,600", note: "Rider appreciation" },
  { label: "Completed rides", value: "96", note: "This month" },
];
