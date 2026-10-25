export type BookingTabId = "upcoming" | "completed" | "cancelled";

export type BookingTab = {
  id: BookingTabId;
  label: string;
  count: string;
};

// Mock data (no backend yet)
export const BOOKING_HEADER = {
  eyebrow: "WanderPass Vault",
  title: "My Bookings",
};

export const BOOKING_TABS: BookingTab[] = [
  { id: "upcoming", label: "Upcoming", count: "2" },
  { id: "completed", label: "Completed", count: "5" },
  { id: "cancelled", label: "Cancelled", count: "1" },
];

export const LIVE_ALERT = {
  tag: "LIVE UPDATE",
  title: "Flight TG 110 Gate Assigned",
  subtitle: "Suvarnabhumi Airport (BKK) Concourse B • On Schedule",
};

export const COMBO_BOOKING = {
  tag: "Combo Package",
  status: "Confirmed",
  destination: "Chiang Mai, Thailand",
  nights: "3 Nights",
  dates: "15 Nov – 18 Nov 2025 • Ref #WG-89241",
  flight: {
    airline: "Thai Airways • TG 110",
    aircraft: "Airbus A350-900 • Economy Classic",
    seats: "Seat 14A, 14B",
    departTime: "08:30",
    departCode: "BKK",
    departCity: "Bangkok",
    arriveTime: "09:45",
    arriveCode: "CNX",
    arriveCity: "Chiang Mai",
    duration: "1h 15m non-stop",
    status: "On Time",
  },
  hotel: {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBYIF8r7v8CBTphUuFo6War7zgFWYsALiuyNPLG3dPhJy3fYZkL6HlVeJ3Gdu1JWZ4_lQCqGRdHayakZ_6u5k940bik0pWxGLeERybWaCKomNmRivuEp5kKONThYSf1dsWPJxQJ4eW6apAT-WXw5Dl1jNyXiqJkcDppTfIaWvlgjzSXHxwFX3EA-J0Zm5mjO6p2MnkMUFAU1TmLqjYSsCsbPGXybjg0PLj91jK7x21BGCuLQ7B6z76WdA",
    imageAlt: "Anantara Chiang Mai resort pool at dusk",
    rating: "5.0 Luxury Resort",
    name: "Anantara Chiang Mai Resort",
    room: "Deluxe King Suite • River View",
    checkin: "Check-in: 15 Nov, 14:00",
  },
  qr: {
    title: "Fast-Pass QR Docket",
    subtitle: "Tap to expand for Airport & Resort desk",
  },
};

export const ACTIVITY_BOOKING = {
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD34ABA1aE-9e9T9LhI1YXp7SVpZTxKWUDtJOerjgpXq03BU1FTp4rzbtnWn7jlcVJdrdM30--b-GeXaKdzArmDQYiPpjGrqHjGByPWQnQWUCv14u1fZVzOp5jw-wCnCPoZQar9Q4zasLz3SEe_GF2ESZ80DwqArqB-fPApPV9uxUrQfkH8kryuFq-vpnC5suRwAvUcKaUfIXif5oth9CZcaUwg4_4wqGiawyrd3lTMuKC2mqpdiJCEBg",
  imageAlt: "Speedboat heading to Maya Bay limestone cliffs",
  tag: "Activity Voucher",
  status: "Confirmed",
  date: "04 Dec 2025 • Ref #WG-65412",
  title: "Phi Phi Islands & Maya Bay Speedboat Tour",
  group: "2 Adults",
  groupNote: "(Snorkeling Gear Incl.)",
  pickup: "07:30 AM Pick-up",
  checkinTitle: "Fast Pier Check-in",
  checkinSub: "Royal Phuket Marina • Pier 4",
};

export const PAST_TRAVELS = {
  title: "Past Travels",
  viewAll: "View All (5)",
  card: {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDfe3QKZduZxSfCHh4Tj-bsU-dplA63XZ-T_Pmg01NSu0AwV5-yi4foYoDSHz8ucVFlVYz24InpsIVteem_D1798MgM0aDRprh440v2YF20iToSe_9g6ETxBsKsKo8ayA_gL1ZOv8S7DLeeuvd2PAD6c9mhP0xET1JFEpqe7X4YzmAHzSjBi36lwiNry1KHQNdLfPRQaCwq81WUOqnZK8T8_ENKgKxmXW08zJ11lGVbqGTA9lCtHWvlgA",
    imageAlt: "Phuket beachfront villa at sunset",
    badge: "Completed • Oct 2025",
    nights: "4 Nights",
    name: "Phuket Beach Villa Escape",
    place: "Kata Noi Beach • Private Pool Villa",
    paid: "Paid $1,420 • E-Receipt Ready",
  },
};

export const CONCIERGE = {
  title: "24/7 Travel Concierge",
  subtitle: "Disruptions? Instant flight rebooking",
  cta: "Call Help",
};
