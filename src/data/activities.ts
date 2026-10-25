export type ActivityChip = {
  id: string;
  label: string;
  icon: string;
};

export type TopBadgeTone = "coral" | "dark" | "light" | "primary";

export type TopBadge = {
  label: string;
  icon?: string;
  tone: TopBadgeTone;
};

export type PerkTone = "primary" | "muted";

export type Perk = {
  label: string;
  icon?: string;
  tone: PerkTone;
};

export type Activity = {
  id: string;
  title: string;
  rating: string;
  reviews: string;
  duration: string;
  image: string;
  imageAlt: string;
  imageHeightClass: string;
  favoriteFilled: boolean;
  topBadges: TopBadge[];
  perks: Perk[];
  oldPrice?: string;
  price: string;
  priceTone: "coral" | "default";
  ctaLabel: string;
  ctaTone: "coral" | "blue";
  ctaIcon?: string;
};

// Mock data (no backend yet)
export const ACTIVITIES_LOCATION = {
  area: "Chiang Mai & Islands",
  count: "48 Experiences",
};

export const ACTIVITIES_SEARCH = {
  placeholder: "Search tours, water sports, tickets...",
  defaultValue: "Chiang Mai",
};

export const ACTIVITY_CHIPS: ActivityChip[] = [
  { id: "day-trips", label: "Day Trips", icon: "sailing" },
  { id: "water-sports", label: "Water Sports", icon: "surfing" },
  { id: "culture", label: "Culture & Temples", icon: "temple_buddhist" },
  { id: "theme-parks", label: "Theme Parks", icon: "attractions" },
  { id: "wellness", label: "Wellness & Spa", icon: "spa" },
  { id: "food", label: "Food Tours", icon: "ramen_dining" },
];

export const ACTIVITIES_PROMO = {
  title: "Summer Flash Deals",
  subtitle: "Up to 35% off high-speed island cruises",
  tag: "Limited",
};

export const ACTIVITIES: Activity[] = [
  {
    id: "maya-bay",
    title: "Phi Phi Islands & Maya Bay Luxury Speedboat Tour",
    rating: "4.9",
    reviews: "1.2k",
    duration: "Full Day (8 Hours)",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDAFNNylW3MAf0v8bL9ycAY2kRLaggrqZ35sUWL09ZQhwYX3QDyz12o7QnNtRhfLGvs3EDBVcqp88dqeVIr4q39xAzdu138UJo2U9VtaiSFFUrTcEDx26-OTXTRX9lCd1StW_oORmVMYaavR58W89p1tFxBhtEorvSuzpUjEGs7VU4OmjscNa6asRLS3M-g7AbUD5V8jLXyy9Qvfx4uBeNbPTLibp4_bzFiDYHW2LpIyUQIRgxeAJWRmQ",
    imageAlt: "Maya Bay turquoise lagoon with luxury speedboat",
    imageHeightClass: "h-48",
    favoriteFilled: true,
    topBadges: [
      { label: "32% OFF", icon: "local_fire_department", tone: "coral" },
      { label: "Instant", icon: "flash_on", tone: "dark" },
    ],
    perks: [
      { label: "Free Cancellation", tone: "primary" },
      { label: "Buffet Lunch", icon: "restaurant", tone: "muted" },
    ],
    oldPrice: "฿2,800",
    price: "฿1,890",
    priceTone: "coral",
    ctaLabel: "Book Now",
    ctaTone: "coral",
    ctaIcon: "chevron_right",
  },
  {
    id: "elephant",
    title: "Chiang Mai Ethical Elephant Sanctuary & Mud Bath",
    rating: "4.95",
    reviews: "850",
    duration: "4 Hours",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBwCMETHrU7VZFw5jXRMAUumuaL0SR2rWNzH2anoUtcPyHJ0SWxknlYpxsZYq31yFu48LahaJVB1G3zMvh-8QNyq5pQPkMPFYNJkmhGIjyen3s2RuIHdWhthMt1EB0sZiWtLPqR0Q9kzk5XD7wHgxDOCRtXL3tnE52jHa-XBfYnhehOy7AQbpK1JSDugQxhTLtmnmqyDPQu-8DrA5m6yjx-Oxbdu6GruPIJ93VDNu1K5FN2IUjSdC4lfw",
    imageAlt: "Rescued asian elephant in Chiang Mai jungle",
    imageHeightClass: "h-44",
    favoriteFilled: false,
    topBadges: [{ label: "Instant Confirmation", icon: "flash_on", tone: "dark" }],
    perks: [
      { label: "Hotel Pickup Included", icon: "airport_shuttle", tone: "muted" },
      { label: "Eco-Certified", tone: "primary" },
    ],
    price: "฿1,650",
    priceTone: "default",
    ctaLabel: "Select",
    ctaTone: "blue",
  },
  {
    id: "doi-inthanon",
    title: "Doi Inthanon National Park & Waterfall Hike",
    rating: "4.8",
    reviews: "420",
    duration: "9 Hours",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDzRVoOFqDX89SVSPaEkX__51qEO6EiFyiCkCJZurxfU0hGEJ9YdAw9qUu683zSwLmmB8WBQ8T2rVZnZDpYdMQ0xRPn-tpLaMDJf-plrO52Rl8vytpH7Jeog_6umNKctAT6aa-rySiiowD1nufFEPhDhI4ffCpH8FX0YNY9rg9I0FZTb_OoY7uPsbqyhGVs7frJiw3MAZDni9C9kctC_hLDmsCYByDGAopNFrmQqAxSW-s_nKEYnMH4Kw",
    imageAlt: "Waterfall and royal pagodas at Doi Inthanon",
    imageHeightClass: "h-44",
    favoriteFilled: false,
    topBadges: [{ label: "Small Group (Max 8)", tone: "light" }],
    perks: [
      { label: "Guided Trek", icon: "hiking", tone: "muted" },
      { label: "Park Fees Included", tone: "muted" },
    ],
    price: "฿1,450",
    priceTone: "default",
    ctaLabel: "Select",
    ctaTone: "blue",
  },
  {
    id: "cooking",
    title: "Traditional Thai Cooking Class & Market Tour",
    rating: "4.9",
    reviews: "310",
    duration: "3.5 Hours",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBEZAWXvqbk2cKQjq9cTP3mH__fcg_mIhRDZUkMXDgkCDz4fyiyjJ0gKHF9pXjTKAPBFW8LoTRVWqNCIXMhWhmBPvfRMirqs8ZYMg9wKNmTE_Rx6-z15fIUpYiZDeJJs0Tv5tuFDosVyaSqYAWVvjFq8xUWeaqNsTcwyi_eUaZKzzsIlNyidIf0s74sb1zdf4HUGwsMDp-qyxkSwDmaiqJYpCKmxWa43RVBzuKz-hh_x12kM3QF6tDSVg",
    imageAlt: "Open-air wooden kitchen cooking school in Chiang Mai",
    imageHeightClass: "h-44",
    favoriteFilled: false,
    topBadges: [{ label: "Includes 5-Course Feast", tone: "primary" }],
    perks: [
      { label: "Local Market Walk", icon: "storefront", tone: "muted" },
      { label: "Recipe Booklet Free", tone: "primary" },
    ],
    price: "฿950",
    priceTone: "default",
    ctaLabel: "Select",
    ctaTone: "blue",
  },
];
