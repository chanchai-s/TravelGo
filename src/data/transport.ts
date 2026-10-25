export type TransportMode = "rental" | "ride";

export type VehicleSpec = {
  icon: string;
  label: string;
};

export type VendorTone = "red" | "yellow" | "coral";

export type Vehicle = {
  id: string;
  category: string;
  name: string;
  vendor: string;
  vendorTone: VendorTone;
  image: string;
  imageAlt: string;
  overlayBadge: string;
  overlayIcon: string;
  overlayIconClass: string;
  specs: VehicleSpec[];
  pricePerDay: string;
  totalPrice: string;
};

// Mock data (no backend yet)
export const TRANSPORT_SEARCH = {
  pickupLabel: "Pickup & Drop-off",
  pickupValue: "Chiang Mai Intl Airport (CNX)",
  datesLabel: "Dates & Rental Time",
  datesValue: "15 Nov 10:00 - 18 Nov 10:00",
  durationBadge: "3 Days",
  returnSame: "Return to same location",
  coverBadge: "Full Cover",
};

export const RIDE_BANNER = {
  title: "Need a quick ride right now?",
  subtitle: "Instant city pickups with vetted drivers",
};

export const VEHICLE_FILTERS = [
  "All Cars",
  "Economy",
  "Compact SUV",
  "Luxury Sedan",
  "7-Seater Van",
];

export const INVENTORY = {
  count: "24 Vehicles Available",
};

export const VEHICLES: Vehicle[] = [
  {
    id: "yaris-cross",
    category: "Compact SUV",
    name: "Toyota Yaris Cross",
    vendor: "AVIS",
    vendorTone: "red",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD69UBTTzXXJ7Dtq8dVngIlAPxTOWNQehbkvEvq-bROeBuLv1lmKPHXqP4owmg-2BUu5u9PLQwLFMYjhYzoNS_furzMAiuvhnKIjiqK8yZ4ZUsrx6zF_cztays0JY7vD4BH9snh2NugDeFbtoQP2WOkesboAKC-lwbNUyZGMu9aNAjhtLbLQyyRbboC4aGt99WQzFqmytYTTJm_WvaJzAeJKh_Q4wZE4OfKxltD_SE56MvGG9zABhfcsw",
    imageAlt: "Ruby red Toyota Yaris Cross SUV studio shot",
    overlayBadge: "Unlimited KM",
    overlayIcon: "all_inclusive",
    overlayIconClass: "text-secondary-container",
    specs: [
      { icon: "airline_seat_recline_normal", label: "5 Seats" },
      { icon: "luggage", label: "2 Bags" },
      { icon: "settings", label: "Auto" },
    ],
    pricePerDay: "฿1,150",
    totalPrice: "Total ฿3,450 (3 days)",
  },
  {
    id: "civic",
    category: "Sedan",
    name: "Honda Civic",
    vendor: "Hertz",
    vendorTone: "yellow",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCIdArc9hRzQgcGrjp_p4BW9yCIGORQGGJv0TYe2crmpR5zEUkywJaDRXlVtnaqvhii8nNcvBBb8CBTNX2yZlcCNjuLN2mpahKm8lEBW0xwOC7bJDZLAoxJrA1wGqsPJcnah7msV5YSsULZMXUnoZHuEcxZ7FbWprBs20AWhhGinrF3OK70bcuAtwpA7dQsMxtHBbxgf-pAFg5fjECqy-ebiRPuoBjv9S6bqRoGk7gjVJ8YNwP9rGVOQw",
    imageAlt: "Pearl white Honda Civic Sedan on mountain highway",
    overlayBadge: "Free cancellation",
    overlayIcon: "event_available",
    overlayIconClass: "text-primary",
    specs: [
      { icon: "airline_seat_recline_normal", label: "5 Seats" },
      { icon: "luggage", label: "3 Bags" },
      { icon: "settings", label: "Auto" },
    ],
    pricePerDay: "฿1,450",
    totalPrice: "Total ฿4,350 (3 days)",
  },
  {
    id: "fortuner",
    category: "Premium 4WD",
    name: "Toyota Fortuner",
    vendor: "SIXT",
    vendorTone: "coral",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBXxLcPg2UuN9vQ6UsOreSX7tH1xsoleKLSEpE_U_P2Abz46zhQOIOCrwssIktyGQ0LAkSNHQE0KCmvmx6PlPgKzKLR8UpxRwfugi0TcjAvgchb9zAiNPh1ht6lqGGImGDKnm7i_tcpy5-amshXkF0-7wSDNXopapKF6PA8wfok-pJ8qQE4J-aBfKv7wXYiM9UuebuuhPPltm8fr-To7TKggAXtQ9oygrvnSNuO0HxKogZvvRfURVUbJA",
    imageAlt: "Charcoal Toyota Fortuner 4WD at mountain viewpoint",
    overlayBadge: "Instant Confirmation",
    overlayIcon: "bolt",
    overlayIconClass: "text-secondary-container",
    specs: [
      { icon: "airline_seat_recline_normal", label: "7 Seats" },
      { icon: "luggage", label: "4 Bags" },
      { icon: "settings", label: "Auto 4x4" },
    ],
    pricePerDay: "฿2,200",
    totalPrice: "Total ฿6,600 (3 days)",
  },
];

export const TRUST_CARD = {
  title: "100% Price Match Guarantee",
  subtitle: "Zero hidden airport depot fees & 24/7 roadside rescue.",
};
