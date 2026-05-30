export interface TeamRide {
  id: string;
  employee: string;
  department: string;
  route: string;
  date: string;
  time: string;
  status: "Completed" | "Scheduled" | "In Review";
  cost: string;
}

export interface BillingItem {
  label: string;
  value: string;
  note: string;
}

export const businessOverview = {
  company: "Rydr Studio",
  month: "May 2026",
  totalTrips: 186,
  activeEmployees: 42,
  monthlySpend: "$8,420.00",
  avgTripCost: "$45.30",
};

export const teamRides: TeamRide[] = [
  {
    id: "team_1",
    employee: "Priya Menon",
    department: "Design",
    route: "Indiranagar Office to Koramangala",
    date: "May 29, 2026",
    time: "7:20 PM",
    status: "Completed",
    cost: "$18.40",
  },
  {
    id: "team_2",
    employee: "Arjun Rao",
    department: "Sales",
    route: "Airport to Downtown Hotel",
    date: "May 29, 2026",
    time: "6:05 PM",
    status: "Scheduled",
    cost: "$32.00",
  },
  {
    id: "team_3",
    employee: "Sara Khan",
    department: "Operations",
    route: "Whitefield to HSR Layout",
    date: "May 28, 2026",
    time: "9:10 PM",
    status: "In Review",
    cost: "$24.75",
  },
  {
    id: "team_4",
    employee: "Kunal Iyer",
    department: "Finance",
    route: "MG Road to Bellandur",
    date: "May 28, 2026",
    time: "5:45 PM",
    status: "Completed",
    cost: "$14.90",
  },
];

export const billingSummary: BillingItem[] = [
  { label: "Trips this month", value: "186", note: "Across all departments" },
  { label: "Outstanding balance", value: "$1,240.00", note: "Due in 7 days" },
  { label: "Approved spend", value: "$7,180.00", note: "Already invoiced" },
  { label: "Average trip cost", value: "$45.30", note: "Before tax and fees" },
];

export const departmentSpend = [
  { label: "Design", value: "$2,040.00" },
  { label: "Sales", value: "$2,920.00" },
  { label: "Operations", value: "$1,680.00" },
  { label: "Finance", value: "$1,780.00" },
];
