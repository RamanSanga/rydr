export interface Ride {
  id: string;
  date: string;
  time: string;
  pickup: string;
  destination: string;
  price: string;
  driverName: string;
  driverInitials: string;
  vehicle: string;
  status: "Requested" | "Driver Assigned" | "On The Way" | "Completed" | "Cancelled";
  tier: "Economy" | "Premium" | "XL";
}

// Deterministic Hashed Route Distance in Kilometers (KM)
export function getRouteDistance(pickup: string, destination: string): number {
  const str = (pickup || "") + (destination || "");
  if (!str.trim()) return 5.0;
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const absHash = Math.abs(hash);
  // Returns a deterministic distance between 3.5 and 23.8 KM
  return 3.5 + (absHash % 203) / 10;
}

// Dynamic AI Price Formula based on Distance (KM) and Tier in Indian Rupees (₹)
export function calculateFare(distance: number, rideType: string): string {
  let baseRate = 40;
  let perKmRate = 12;

  if (rideType === "economy") {
    baseRate = 40;
    perKmRate = 12;
  } else if (rideType === "premium") {
    baseRate = 75;
    perKmRate = 18;
  } else {
    // xl
    baseRate = 110;
    perKmRate = 25;
  }

  return Math.floor(baseRate + distance * perKmRate).toString();
}

export interface SavedAddress {
  id: string;
  label: string;
  address: string;
  type: "home" | "work" | "cafe" | "airport";
}

export const riderProfile = {
  name: "Aanya Sharma",
  email: "aanya.sharma@gmail.com",
  phone: "+91 98765 43210",
  rating: "4.95 ★",
  memberSince: "May 2024",
  totalRides: 42,
  walletBalance: "₹4,500.00",
  savedTrees: 18,
  ecoRides: 12,
};

export const savedAddresses: SavedAddress[] = [
  { id: "addr_1", label: "Home", address: "Sector 15, Part 2, Gurugram, Haryana", type: "home" },
  { id: "addr_2", label: "DLF Cyber Hub", address: "Cyber City, Gurugram, Haryana", type: "work" },
  { id: "addr_3", label: "Chai Cafe Spot", address: "Connaught Place, New Delhi", type: "cafe" },
  { id: "addr_4", label: "IGI Airport T3", address: "Departures Lane, Delhi Airport", type: "airport" },
];

export const rides: Ride[] = [
  {
    id: "ride_1",
    date: "May 28, 2026",
    time: "7:30 PM",
    pickup: "DLF Cyber Hub, Gurugram",
    destination: "Connaught Place, New Delhi",
    price: "₹" + calculateFare(getRouteDistance("DLF Cyber Hub, Gurugram", "Connaught Place, New Delhi"), "economy"),
    driverName: "Vikram Malhotra",
    driverInitials: "VM",
    vehicle: "Hyundai Verna (White)",
    status: "Completed",
    tier: "Economy",
  },
  {
    id: "ride_2",
    date: "May 26, 2026",
    time: "8:15 AM",
    pickup: "Sector 15, Gurugram",
    destination: "IGI Airport T3, Delhi",
    price: "₹" + calculateFare(getRouteDistance("Sector 15, Gurugram", "IGI Airport T3, Delhi"), "premium"),
    driverName: "Priya Sharma",
    driverInitials: "PS",
    vehicle: "Honda City (Silver)",
    status: "Completed",
    tier: "Premium",
  },
  {
    id: "ride_3",
    date: "June 2, 2026",
    time: "7:00 PM",
    pickup: "Sector 15, Gurugram",
    destination: "DLF Cyber Hub, Gurugram",
    price: "₹" + calculateFare(getRouteDistance("Sector 15, Gurugram", "DLF Cyber Hub, Gurugram"), "economy"),
    driverName: "Vikram Malhotra",
    driverInitials: "VM",
    vehicle: "Hyundai Verna (White)",
    status: "Driver Assigned",
    tier: "Economy",
  },
  {
    id: "ride_4",
    date: "May 20, 2026",
    time: "9:45 PM",
    pickup: "Noida Sector 18 Mall",
    destination: "Sector 15, Gurugram",
    price: "₹" + calculateFare(getRouteDistance("Noida Sector 18 Mall", "Sector 15, Gurugram"), "xl"),
    driverName: "Karan Singh",
    driverInitials: "KS",
    vehicle: "Toyota Innova (Black)",
    status: "Completed",
    tier: "XL",
  },
  {
    id: "ride_5",
    date: "May 15, 2026",
    time: "6:20 PM",
    pickup: "DLF Cyber Hub, Gurugram",
    destination: "Sector 15, Gurugram",
    price: "₹" + calculateFare(getRouteDistance("DLF Cyber Hub, Gurugram", "Sector 15, Gurugram"), "premium"),
    driverName: "Raj Patel",
    driverInitials: "RP",
    vehicle: "Honda City (White)",
    status: "Cancelled",
    tier: "Premium",
  },
];