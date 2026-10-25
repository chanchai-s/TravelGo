export type DestinationOption = {
  id: string;
  name: string;
  country: string;
  type: "city" | "country" | "island" | "custom";
};

export const destinationOptions: DestinationOption[] = [
  // --- COUNTRIES ---
  { id: "thailand", name: "Thailand", country: "Thailand", type: "country" },
  { id: "japan", name: "Japan", country: "Japan", type: "country" },
  { id: "south-korea", name: "South Korea", country: "South Korea", type: "country" },
  { id: "indonesia", name: "Indonesia", country: "Indonesia", type: "country" },
  { id: "vietnam", name: "Vietnam", country: "Vietnam", type: "country" },
  { id: "china", name: "China", country: "China", type: "country" },
  { id: "singapore", name: "Singapore", country: "Singapore", type: "country" },
  { id: "malaysia", name: "Malaysia", country: "Malaysia", type: "country" },
  { id: "france", name: "France", country: "France", type: "country" },
  { id: "italy", name: "Italy", country: "Italy", type: "country" },
  { id: "spain", name: "Spain", country: "Spain", type: "country" },
  { id: "portugal", name: "Portugal", country: "Portugal", type: "country" },
  { id: "united-kingdom", name: "United Kingdom", country: "United Kingdom", type: "country" },
  { id: "switzerland", name: "Switzerland", country: "Switzerland", type: "country" },
  { id: "austria", name: "Austria", country: "Austria", type: "country" },
  { id: "greece", name: "Greece", country: "Greece", type: "country" },
  { id: "united-states", name: "United States", country: "United States", type: "country" },
  { id: "canada", name: "Canada", country: "Canada", type: "country" },
  { id: "australia", name: "Australia", country: "Australia", type: "country" },
  { id: "new-zealand", name: "New Zealand", country: "New Zealand", type: "country" },
  { id: "uae", name: "United Arab Emirates", country: "United Arab Emirates", type: "country" },
  { id: "qatar", name: "Qatar", country: "Qatar", type: "country" },
  { id: "turkey", name: "Turkey", country: "Turkey", type: "country" },

  // --- THAILAND ---
  { id: "bkk", name: "Bangkok", country: "Thailand", type: "city" },
  { id: "phuket", name: "Phuket", country: "Thailand", type: "island" },
  { id: "chiang-mai", name: "Chiang Mai", country: "Thailand", type: "city" },
  { id: "pattaya", name: "Pattaya", country: "Thailand", type: "city" },
  { id: "krabi", name: "Krabi", country: "Thailand", type: "city" },
  { id: "samui", name: "Koh Samui", country: "Thailand", type: "island" },
  { id: "huahin", name: "Hua Hin", country: "Thailand", type: "city" },
  { id: "chiang-rai", name: "Chiang Rai", country: "Thailand", type: "city" },

  // --- JAPAN ---
  { id: "tokyo", name: "Tokyo", country: "Japan", type: "city" },
  { id: "kyoto", name: "Kyoto", country: "Japan", type: "city" },
  { id: "osaka", name: "Osaka", country: "Japan", type: "city" },
  { id: "hokkaido", name: "Sapporo (Hokkaido)", country: "Japan", type: "city" },
  { id: "fukuoka", name: "Fukuoka", country: "Japan", type: "city" },
  { id: "okinawa", name: "Okinawa", country: "Japan", type: "island" },

  // --- SOUTH KOREA ---
  { id: "seoul", name: "Seoul", country: "South Korea", type: "city" },
  { id: "busan", name: "Busan", country: "South Korea", type: "city" },
  { id: "jeju", name: "Jeju Island", country: "South Korea", type: "island" },
  { id: "incheon", name: "Incheon", country: "South Korea", type: "city" },

  // --- INDONESIA ---
  { id: "bali", name: "Bali", country: "Indonesia", type: "island" },
  { id: "jakarta", name: "Jakarta", country: "Indonesia", type: "city" },
  { id: "yogyakarta", name: "Yogyakarta", country: "Indonesia", type: "city" },
  { id: "labuan-bajo", name: "Labuan Bajo (Komodo)", country: "Indonesia", type: "city" },

  // --- VIETNAM ---
  { id: "hanoi", name: "Hanoi", country: "Vietnam", type: "city" },
  { id: "ho-chi-minh", name: "Ho Chi Minh City", country: "Vietnam", type: "city" },
  { id: "da-nang", name: "Da Nang", country: "Vietnam", type: "city" },
  { id: "phu-quoc", name: "Phu Quoc", country: "Vietnam", type: "island" },
  { id: "hoi-an", name: "Hoi An", country: "Vietnam", type: "city" },

  // --- CHINA & GREATER CHINA ---
  { id: "beijing", name: "Beijing", country: "China", type: "city" },
  { id: "shanghai", name: "Shanghai", country: "China", type: "city" },
  { id: "chengdu", name: "Chengdu", country: "China", type: "city" },
  { id: "hong-kong", name: "Hong Kong", country: "China", type: "city" },
  { id: "macau", name: "Macau", country: "China", type: "city" },
  { id: "taipei", name: "Taipei", country: "Taiwan", type: "city" },

  // --- SINGAPORE & MALAYSIA ---
  { id: "singapore", name: "Singapore", country: "Singapore", type: "country" },
  { id: "kuala-lumpur", name: "Kuala Lumpur", country: "Malaysia", type: "city" },
  { id: "penang", name: "Penang", country: "Malaysia", type: "island" },
  { id: "langkawi", name: "Langkawi", country: "Malaysia", type: "island" },

  // --- FRANCE ---
  { id: "paris", name: "Paris", country: "France", type: "city" },
  { id: "nice", name: "Nice", country: "France", type: "city" },
  { id: "lyon", name: "Lyon", country: "France", type: "city" },

  // --- ITALY ---
  { id: "rome", name: "Rome", country: "Italy", type: "city" },
  { id: "venice", name: "Venice", country: "Italy", type: "city" },
  { id: "florence", name: "Florence", country: "Italy", type: "city" },
  { id: "milan", name: "Milan", country: "Italy", type: "city" },

  // --- SPAIN & PORTUGAL ---
  { id: "barcelona", name: "Barcelona", country: "Spain", type: "city" },
  { id: "madrid", name: "Madrid", country: "Spain", type: "city" },
  { id: "ibiza", name: "Ibiza", country: "Spain", type: "island" },
  { id: "lisbon", name: "Lisbon", country: "Portugal", type: "city" },

  // --- UNITED KINGDOM ---
  { id: "london", name: "London", country: "United Kingdom", type: "city" },
  { id: "edinburgh", name: "Edinburgh", country: "United Kingdom", type: "city" },
  { id: "manchester", name: "Manchester", country: "United Kingdom", type: "city" },

  // --- SWITZERLAND & AUSTRIA ---
  { id: "zurich", name: "Zurich", country: "Switzerland", type: "city" },
  { id: "geneva", name: "Geneva", country: "Switzerland", type: "city" },
  { id: "vienna", name: "Vienna", country: "Austria", type: "city" },

  // --- GREECE ---
  { id: "athens", name: "Athens", country: "Greece", type: "city" },
  { id: "santorini", name: "Santorini", country: "Greece", type: "island" },
  { id: "mykonos", name: "Mykonos", country: "Greece", type: "island" },

  // --- USA & CANADA ---
  { id: "new-york", name: "New York", country: "United States", type: "city" },
  { id: "los-angeles", name: "Los Angeles", country: "United States", type: "city" },
  { id: "las-vegas", name: "Las Vegas", country: "United States", type: "city" },
  { id: "hawaii", name: "Honolulu (Hawaii)", country: "United States", type: "island" },
  { id: "vancouver", name: "Vancouver", country: "Canada", type: "city" },
  { id: "toronto", name: "Toronto", country: "Canada", type: "city" },

  // --- AUSTRALIA & NEW ZEALAND ---
  { id: "sydney", name: "Sydney", country: "Australia", type: "city" },
  { id: "melbourne", name: "Melbourne", country: "Australia", type: "city" },
  { id: "gold-coast", name: "Gold Coast", country: "Australia", type: "city" },
  { id: "auckland", name: "Auckland", country: "New Zealand", type: "city" },
  { id: "queenstown", name: "Queenstown", country: "New Zealand", type: "city" },

  // --- MIDDLE EAST ---
  { id: "dubai", name: "Dubai", country: "United Arab Emirates", type: "city" },
  { id: "abu-dhabi", name: "Abu Dhabi", country: "United Arab Emirates", type: "city" },
  { id: "doha", name: "Doha", country: "Qatar", type: "city" },
  { id: "istanbul", name: "Istanbul", country: "Turkey", type: "city" },
  { id: "cappadocia", name: "Cappadocia", country: "Turkey", type: "city" },
];