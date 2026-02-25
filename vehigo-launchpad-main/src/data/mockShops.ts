export interface RepairShop {
  id: string;
  shop_name: string;
  location: string;
  city: string;
  barangay: string;
  services: string[];
  working_hours: string;
  price_range: string;
  lat: number;
  lng: number;
}

export const SERVICES = [
  "Oil Change",
  "Brake Pedal Check",
  "Tire Change",
  "Aircon Service",
  "Full-Body Check-up",
  "Underchassis Inspection",
] as const;

export type ServiceType = typeof SERVICES[number];

export const mockShops: RepairShop[] = [
  {
    id: "1",
    shop_name: "AutoCare Hub Makati",
    location: "123 Ayala Ave, Brgy. Bel-Air, Makati City",
    city: "Makati",
    barangay: "Bel-Air",
    services: ["Oil Change", "Brake Pedal Check", "Aircon Service", "Full-Body Check-up"],
    working_hours: "Mon-Sat 8:00 AM - 6:00 PM",
    price_range: "₱500 - ₱5,000",
    lat: 14.5547,
    lng: 121.0244,
  },
  {
    id: "2",
    shop_name: "QuickFix Auto Center",
    location: "45 Taft Ave, Brgy. 727, Manila",
    city: "Manila",
    barangay: "727",
    services: ["Oil Change", "Tire Change", "Brake Pedal Check", "Underchassis Inspection"],
    working_hours: "Mon-Sun 7:00 AM - 8:00 PM",
    price_range: "₱300 - ₱4,500",
    lat: 14.5631,
    lng: 120.9944,
  },
  {
    id: "3",
    shop_name: "Metro Motors QC",
    location: "88 Commonwealth Ave, Brgy. Holy Spirit, Quezon City",
    city: "Quezon City",
    barangay: "Holy Spirit",
    services: ["Oil Change", "Aircon Service", "Full-Body Check-up", "Tire Change"],
    working_hours: "Mon-Sat 7:30 AM - 5:30 PM",
    price_range: "₱400 - ₱6,000",
    lat: 14.6814,
    lng: 121.0777,
  },
  {
    id: "4",
    shop_name: "DriveRight Auto Services",
    location: "12 Shaw Blvd, Brgy. Wack-Wack, Mandaluyong",
    city: "Mandaluyong",
    barangay: "Wack-Wack Greenhills",
    services: ["Brake Pedal Check", "Tire Change", "Underchassis Inspection", "Full-Body Check-up"],
    working_hours: "Mon-Fri 8:00 AM - 5:00 PM",
    price_range: "₱600 - ₱7,000",
    lat: 14.5794,
    lng: 121.0359,
  },
  {
    id: "5",
    shop_name: "PitStop Garage Pasig",
    location: "56 C. Raymundo Ave, Brgy. Rosario, Pasig City",
    city: "Pasig",
    barangay: "Rosario",
    services: ["Oil Change", "Brake Pedal Check", "Aircon Service", "Tire Change", "Full-Body Check-up", "Underchassis Inspection"],
    working_hours: "Mon-Sun 6:00 AM - 9:00 PM",
    price_range: "₱350 - ₱5,500",
    lat: 14.5764,
    lng: 121.0851,
  },
  {
    id: "6",
    shop_name: "TrustAuto Taguig",
    location: "78 Mckinley Rd, Brgy. Fort Bonifacio, Taguig",
    city: "Taguig",
    barangay: "Fort Bonifacio",
    services: ["Oil Change", "Aircon Service", "Full-Body Check-up", "Underchassis Inspection"],
    working_hours: "Mon-Sat 8:00 AM - 7:00 PM",
    price_range: "₱800 - ₱8,000",
    lat: 14.5365,
    lng: 121.0509,
  },
  {
    id: "7",
    shop_name: "CarSure Parañaque",
    location: "200 Dr. A. Santos Ave, Brgy. San Isidro, Parañaque",
    city: "Parañaque",
    barangay: "San Isidro",
    services: ["Tire Change", "Brake Pedal Check", "Oil Change"],
    working_hours: "Mon-Sat 7:00 AM - 6:00 PM",
    price_range: "₱250 - ₱3,500",
    lat: 14.4793,
    lng: 121.0198,
  },
  {
    id: "8",
    shop_name: "GearUp Auto Caloocan",
    location: "33 Rizal Ave Ext, Brgy. 171, Caloocan",
    city: "Caloocan",
    barangay: "171",
    services: ["Oil Change", "Tire Change", "Aircon Service", "Brake Pedal Check"],
    working_hours: "Mon-Fri 8:00 AM - 5:00 PM",
    price_range: "₱200 - ₱3,000",
    lat: 14.6488,
    lng: 120.9670,
  },
];
