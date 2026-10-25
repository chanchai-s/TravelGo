export type ServiceTabId = "hotels" | "flights" | "activities" | "transport";

export type ServiceTab = {
  id: ServiceTabId;
  label: string;
  icon: string;
  ctaLabel: string;
};

export type Category = {
  id: string;
  label: string;
  icon: string;
  tileClass: string;
  iconClass: string;
};

export type Destination = {
  id: string;
  name: string;
  country: string;
  avgPrice: string;
  badge: string;
  badgeIcon: string;
  badgeIconClass: string;
  image: string;
  imageAlt: string;
};

export type Stay = {
  id: string;
  tag: string;
  name: string;
  location: string;
  rating: string;
  reviews: string;
  price: string;
  image: string;
  imageAlt: string;
};

export type NavItem = {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: string;
  dot?: boolean;
};

// Mock data (no backend yet)
export const LOGO_URL =
  "https://lh3.googleusercontent.com/aida/AEtjO1U1-MP96BlXSb2UjFpfjLmDZwgXceg_TRS9Sa6n9F8ZGLFO3FfaTnr5jQYzFaOUZmeSDaIq7KVVXid_37Z2Crz1X9Fi3TdbBCzP4JUM9MkKijdj6BgyjgjXES1tqdOnKuWPOaO90Llbntzx__Ic9kOOmQ09BmtiY-faH0wKRtBbFmHW09ETvQICJXp32XWPpH3DBAhgMi3Fl2wgsxCd5pqTOOq76DWivllUeCtmXOUiMoU7JirG27HGtwZy";

export const SERVICE_TABS: ServiceTab[] = [
  { id: "hotels", label: "Hotels", icon: "hotel", ctaLabel: "Search Hotels" },
  { id: "flights", label: "Flights", icon: "flight", ctaLabel: "Search Flights" },
  { id: "activities", label: "Activities", icon: "confirmation_number", ctaLabel: "Find Activities" },
  { id: "transport", label: "Transport", icon: "directions_car", ctaLabel: "Book Transport" },
];

// export const SEARCH_DEFAULTS = {
//   destination: "Chiang Mai, Thailand",
//   dates: "15 Nov - 18 Nov",
//   nights: "3 Nights",
//   guests: "2 Adults, 0 Children • 1 Room",
// };

export const CATEGORIES: Category[] = [
  { id: "stays", label: "Stays", icon: "apartment", tileClass: "bg-primary-fixed", iconClass: "text-on-primary-fixed" },
  { id: "flights", label: "Flights", icon: "flight_takeoff", tileClass: "bg-surface-container-high", iconClass: "text-primary" },
  { id: "day-tours", label: "Day Tours", icon: "tour", tileClass: "bg-surface-container-high", iconClass: "text-secondary" },
  { id: "car-rental", label: "Car Rental", icon: "car_rental", tileClass: "bg-surface-container-high", iconClass: "text-tertiary" },
  { id: "food", label: "Food", icon: "restaurant", tileClass: "bg-surface-container-high", iconClass: "text-secondary-container" },
  { id: "vouchers", label: "Vouchers", icon: "loyalty", tileClass: "bg-secondary-fixed", iconClass: "text-on-secondary-fixed" },
];

export const FLASH_SALE = {
  title: "Weekend Escape 30% OFF",
  couponLabel: "Redeem with coupon code",
  couponCode: "WANDER30",
  initialSeconds: 5 * 3600 + 42 * 60 + 19,
};

export const DESTINATIONS: Destination[] = [
  {
    id: "phuket",
    name: "Phuket",
    country: "Thailand",
    avgPrice: "฿1,200",
    badge: "Top Pick",
    badgeIcon: "trending_up",
    badgeIconClass: "text-secondary-container",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAKT5ltpGBPW8bhcyHdNoY_hlNNMjfVr9enwTfwu2LQaFK7pYvDrfVPF9T8Bwl_fGpCKVbiwrlTsyCF0Z7_-zcFbTWxLpV7va5U3InEHiO04q2bSJRNQr6curO5NmB9jtfQOVtPLwXywNE6LhfhHBJ0d4o2YJaNh8L3Czk_mUut5V_Oa__APg-jE1hJSJiZTPoFikFLL39cyNI70wYhTF8-XCJyJX3CDnRfzs5iyxk1c9IgzdrLJu_BJQ",
    imageAlt: "Aerial view of Phuket turquoise ocean and longtail boats",
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    avgPrice: "฿3,500",
    badge: "Hot",
    badgeIcon: "local_fire_department",
    badgeIconClass: "text-primary",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAvoV_aB-szqncZvt38TXT9QVA9gDYxOJ0U6pjnkE_n23M83B33NGO6OfesNYem6dpfzxxRHV7UMH1bICCkYUyYe1hqZwJSBfVLt96NsPfKFunQFjpfPyXPIrUBWJT7ZQToXJl72zaeCn7W-6XObH7f_1wOjcUB90PNcyfcdNtYPKX6Shi5ajs72cOuFf4LrTwv-XXipgkkf9tgO5LROYSz8tcn439i0o_PeGkRvuWa122SURC_m1PV6w",
    imageAlt: "Shinjuku Tokyo neon night cityscape",
  },
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    avgPrice: "฿1,850",
    badge: "Relax",
    badgeIcon: "spa",
    badgeIconClass: "text-tertiary",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBTx61wH_EYVmdHsuAJX5wfITYxTszT3Gjiw4oOWMmJNxFALteSxSiBqT4XPGHW0TXYv29zyG6ADYBN70zUO_svFf5yQ2l4XPxFAyd1jiBBjds3yfZPLOM_b-2rMgEVVOxj2g6g3B9-suLHLUmN5acrTGc-an9yGYWtWqF9B46ucnBtxpX399HhxGp959aWCyArhQOG_armz7JEucPNh2hFRs03dQYWmsMSkTKkpxV33R1mlmOXGQkUDw",
    imageAlt: "Tegallalang rice terraces in Ubud Bali at sunrise",
  },
  {
    id: "chiang-mai",
    name: "Chiang Mai",
    country: "Thailand",
    avgPrice: "฿950",
    badge: "Culture",
    badgeIcon: "explore",
    badgeIconClass: "text-secondary",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBfiJCGrz82dKTZkqmaoAdMlO1dTrwozsZVlePI2HgszkOflQVKy5pNL88JFhiry6jaOjbnJPMpx8UPU4sah16T3QexSDwW957cufVLOotnpollQS_K_vQPlAJ0H-IVsFO8XaKglRsfLasp3vjYAFYbDPUawNg4jsH6bOwkUJCRP-guewCUbjialkTRHaFEAkZ3Lwc_QnSFUmE8t-QKfts08GXT9SHJU5DvcwEp04DdSdGSfXnMVn55Bg",
    imageAlt: "Golden temple in Chiang Mai with mountains",
  },
];

export const STAYS: Stay[] = [
  {
    id: "anantara",
    tag: "Luxury Villa",
    name: "Anantara Cliffside Pool Resort",
    location: "Kamala Beach, Phuket",
    rating: "4.9",
    reviews: "128",
    price: "฿4,800",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDKYCd9IrsuUqBh1lSl9L1QIaNbi9MkcN0OElo_Dt_8r1hv6P0dHPPz99KrKiyQBOVgQKaglyOa2-Wg2_MtKBX_GHJcz0HdAFEgwocUHegunt26E1vb2kDiT87uBk7n8GiAnZOIDcBpkubIMZmopMKtTq0ZLoMhXcOWTfyGVQ35Vk4sMzlHYVrbitQHqiVZPKoaefitnoFMMsKXrvKGbJyHyew9CeQ_wH-DD0EGvDMSkXNuLmkVhYpuQw",
    imageAlt: "Luxury infinity pool villa overlooking Andaman Sea",
  },
  {
    id: "komorebi",
    tag: "Boutique Ryokan",
    name: "Komorebi Zen Heritage Retreat",
    location: "Gion District, Kyoto",
    rating: "4.9",
    reviews: "94",
    price: "฿5,250",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCOyZ41ymovaNS-PfUlP-Zt2TYtXkk51_0JjqJnHyao18PMvPebdtoh2SpLOQLZQJMg7KGq7Xw2YFaWilcyKkAuJbsglkuOTCu5Pi9umhL0aPbP33VoisJ2Tlt5OUlpcrWWw9cC8z6E-m4xMaorDAjwJoVp8FewPyDXToS4355ewIF99zvIvms-zSY3yP--Nt7WSUFnYwSVpaBICE9wlohiY2Cogg8ajkJX70f5VruTOU7fKTcs-wLGVQ",
    imageAlt: "Minimalist boutique hotel room interior in Kyoto",
  },
  {
    id: "hanging-gardens",
    tag: "Eco Sanctuary",
    name: "Hanging Gardens Jungle Haven",
    location: "Ubud, Bali",
    rating: "4.9",
    reviews: "210",
    price: "฿3,190",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAHJseJKnQGvuxopn4qsnMh4qZ7WmWkHHyIkMqrqx2EOBahfQE6cRd5A0p84QAK1SWXYRGrUanmL-8hu_liuiFs6hzo1OrQR7jCzoOv6hilQcPPX_An9kE5SsyktTxVH_XyzdWZsexuQgqvpWVkj5c1pBq7x2KJT-FHMOCO8ZwdwcMVwM4-Oj2BDKTEbtgn8ziS3MqsvQrEhYXM251P7u6PEGJnxO7YLEj8ECpQYf8-LH9oGZiG0kFCsA",
    imageAlt: "Bohemian eco-lodge in Ubud rainforest",
  },
];

export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", icon: "home", href: "/homepage" },
  { id: "my-trips", label: "My Trips", icon: "confirmation_number", href: "#", dot: true },
  { id: "saved", label: "Saved", icon: "favorite", href: "#" },
  { id: "cart", label: "Cart", icon: "shopping_bag", href: "#", badge: "2" },
  { id: "login", label: "Login", icon: "login", href: "/login" },
];
