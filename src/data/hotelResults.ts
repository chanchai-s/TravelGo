export type HotelResult = {
  id: string;
  name: string;
  location: string;
  country: string;
  stars: number;
  rating: number;
  reviews: number;
  tag: string;
  price: number;
  originalPrice: number;
  image: string;
  imageAlt: string;
  features: string[];
  distance: string;
};

export const hotelResults: HotelResult[] = [
  {
    id: "bkk-riverside-suites",
    name: "Bangkok Riverside Suites",
    location: "Bangkok Riverside",
    country: "Thailand",
    stars: 5,
    rating: 9.3,
    reviews: 1248,
    tag: "Best Seller",
    price: 2200,
    originalPrice: 3200,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Hotel exterior with pool and city skyline",
    features: ["Free Wi‑Fi", "Pool", "Breakfast", "Airport Transfer"],
    distance: "2.8 km from city center",
  },
  {
    id: "bkk-siam-park-hotel",
    name: "Siam Park Hotel",
    location: "Siam District",
    country: "Thailand",
    stars: 4,
    rating: 8.9,
    reviews: 932,
    tag: "Great Value",
    price: 1850,
    originalPrice: 2500,
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Modern hotel tower with city lights",
    features: ["Gym", "Smart TV", "Breakfast", "Parking"],
    distance: "1.2 km from shopping district",
  },
  {
    id: "bkk-emerald-inn",
    name: "Emerald Inn Bangkok",
    location: "Bangkok Central",
    country: "Thailand",
    stars: 4,
    rating: 8.7,
    reviews: 820,
    tag: "Family Friendly",
    price: 1600,
    originalPrice: 2200,
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Contemporary hotel lobby and reception area",
    features: ["Family Rooms", "Breakfast", "Free Cancel"],
    distance: "800 m from transit station",
  },
  {
    id: "bkk-lotus-collection",
    name: "Lotus Collection Hotel",
    location: "Thonburi",
    country: "Thailand",
    stars: 5,
    rating: 9.1,
    reviews: 1110,
    tag: "Top Rated",
    price: 2650,
    originalPrice: 3700,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Luxury hotel room with modern decor",
    features: ["Spa", "Pool", "Ocean View", "Breakfast"],
    distance: "3.1 km from riverfront",
  },
  {
    id: "bkk-urban-skyline",
    name: "Urban Skyline Residence",
    location: "Silom",
    country: "Thailand",
    stars: 4,
    rating: 8.8,
    reviews: 706,
    tag: "Business Stay",
    price: 2100,
    originalPrice: 2900,
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Residence building with skyline reflection",
    features: ["Work Desk", "Fast Wi‑Fi", "Gym", "Coffee Bar"],
    distance: "1.5 km from business district",
  },
  {
    id: "bkk-harbor-terrace",
    name: "Harbor Terrace Hotel",
    location: "Chao Phraya",
    country: "Thailand",
    stars: 4,
    rating: 9.0,
    reviews: 995,
    tag: "Popular Choice",
    price: 1980,
    originalPrice: 2800,
    image:
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Hotel terrace overlooking city river",
    features: ["River View", "Breakfast", "Free Wi‑Fi", "Pool"],
    distance: "2.1 km from riverfront",
  },
];
