export type DeliveryMode = "hotel" | "airport" | "home";

export type ShopCategory = {
  id: string;
  label: string;
  icon: string;
};

export type Essential = {
  id: string;
  tag: string;
  tagClass: string;
  tagTextClass: string;
  eyebrow: string;
  eyebrowClass: string;
  name: string;
  detail: string;
  price: string;
  image: string;
  imageAlt: string;
};

export type Souvenir = {
  id: string;
  badge: string;
  badgeClass: string;
  badgeTextClass: string;
  rating: string;
  reviews: string;
  name: string;
  price: string;
  saveNote?: string;
  image: string;
  imageAlt: string;
};

// Mock data (no backend yet)
export const DELIVERY = {
  label: "Deliver to",
  place: "Anantara Chiang Mai Resort, Rm 304",
  fastTag: "2h Fast Delivery",
  noticePrefix: "Order within",
  noticeMins: "34 mins",
  noticeMid: "for delivery today by",
  noticeTime: "18:00",
  modes: [
    { id: "hotel", label: "Hotel Drop-off" },
    { id: "airport", label: "Airport Gate" },
    { id: "home", label: "Ship to Home" },
  ] as { id: DeliveryMode; label: string }[],
};

export const SHOP_SEARCH = {
  placeholder: "Search local souvenirs, travel gear, eSIM...",
};

export const SHOP_CATEGORIES: ShopCategory[] = [
  { id: "all", label: "All Souvenirs", icon: "local_mall" },
  { id: "foods", label: "Artisanal Foods", icon: "bakery_dining" },
  { id: "crafts", label: "Lanna Crafts", icon: "palette" },
  { id: "tech", label: "Travel Tech", icon: "devices" },
  { id: "dutyfree", label: "Duty-Free", icon: "shopping_bag" },
  { id: "esim", label: "eSIM & Passes", icon: "sim_card" },
];

export const HERO_PRODUCT = {
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCKxh4_wieyBRFMwPg79j8Pct1SXh1_uM1KpwduZP2_778NbmoQbDzk9Yv4QLep0_IAWn3OjTukrBu0QiKhtqI-zfm_PHnLnCjrwA9WpEh1ufD-EnThZv9VZxzhR6iVHMcNP9jme3U0pyadIAurv0Ca-LaSxAC4PiHZ7520bvZekIpxKgIUoyAjBflxkleMAl2Nq0aaBtmTcLnvAfgwcNhh1U1GeDE4f5ZiEwkLchDKE3AkdVOj63uTCw",
  imageAlt: "Lanna Heritage Reserve Gift Set with tea tins and bamboo basket",
  curatedTag: "Curated Local Expert Pick",
  discountTag: "22% OFF Special",
  eyebrow: "Chiang Mai Heritage",
  rating: "4.9",
  reviews: "(248)",
  name: "Lanna Heritage Reserve Gift Set",
  desc: "Organic Araksa whole leaf tea duo, roasted royal project macadamias, and genuine handwoven northern bamboo souvenir canister.",
  price: "฿890",
  oldPrice: "฿1,150",
  addLabel: "Add to Cart +",
  addedLabel: "Added!",
};

export const ESSENTIALS: Essential[] = [
  {
    id: "esim",
    tag: "Bestseller",
    tagClass: "bg-secondary-container",
    tagTextClass: "text-on-secondary",
    eyebrow: "Instant QR Code",
    eyebrowClass: "text-primary",
    name: "5G Tourist eSIM (10-Day)",
    detail: "50GB High Speed Data",
    price: "฿299",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDo4MsaMIT7kOKfEwkjQccc1e0radN_LXZ5WDNtwIQheWpZ4spPj-i-7NsE-onTfn-YHVOhkq0482aal02u6VTDBYfO52MBWCZVOUyoaos9lkgMSJKIkQXzlNV0s0jkPYIm0G2xCr7h5xvbzBtkmF8W5bwgHVexy8Q58YfN6FTEwjJPWxUe7P4DQA6m6CrkrbDnrWSO9KYDmFjbDvbadVAwM2YfSK1n8B7N01gKssLoT36k2S_3oLSE6A",
    imageAlt: "Thailand tourist eSIM with 5G",
  },
  {
    id: "daypack",
    tag: "Waterproof",
    tagClass: "bg-surface-container-lowest/90",
    tagTextClass: "text-on-surface",
    eyebrow: "Travel Gear",
    eyebrowClass: "text-outline",
    name: "Ultralight Daypack 20L",
    detail: "Weighs only 120 grams",
    price: "฿450",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBOHZmilCpwChluWdwuRlts1aFMndBA2QPqB9jTAqiRiSdRJyQwoss7VxNey-z6_qjh25HV7cTIjDxFYj1uRW79kPJXRT8BT0YZVva2MTIaq_AqB0pXhiKEiVtxShnlbZkYUipN0Xw6rF4kY2YbQvXXYDP0dlSd0sVV1JtFkT2VRqiB6T2c5aroge5UcZY6k8xUyMQkyTVn6khpu5uNvgtMd1Q3HLsLynIT-yvSnAEc3SF-GW4pkUH2bg",
    imageAlt: "Ultralight foldable travel backpack",
  },
  {
    id: "adapter",
    tag: "65W Fast GaN",
    tagClass: "bg-surface-container-lowest/90",
    tagTextClass: "text-on-surface",
    eyebrow: "Electronics",
    eyebrowClass: "text-outline",
    name: "Universal Adapter 65W",
    detail: "Works in 150+ countries",
    price: "฿620",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAFWrbL0c47dyKh7IrlzajjtZYTjnWVzjcExfw5ScTp7nfGaM1IDtQMTxQG2DAVRJwu3mgpjo5YwUfbHDnsZKA78NBLi2tC3WZQBw2kaWkS8qZddvAHi0c9FF9A2tg2ZYlOZHBeYocr-qFNRRgl_gBFbb0V1xguD9RnHXm7tiHe8eAn8bc03of8FwgMDZucZCsQa8MosLkeRJZF1PB6W1V27s1NCweuUfOyP7OLtnGAHJu7TQ29KBbyqA",
    imageAlt: "Universal travel power adapter",
  },
];

export const SOUVENIRS: Souvenir[] = [
  {
    id: "tea-duet",
    badge: "Hotel 2h Drop",
    badgeClass: "bg-primary-container",
    badgeTextClass: "text-on-primary-container",
    rating: "4.9",
    reviews: "(184)",
    name: "Organic Jasmine & Oolong Tea Duet",
    price: "฿420",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCKxh4_wieyBRFMwPg79j8Pct1SXh1_uM1KpwduZP2_778NbmoQbDzk9Yv4QLep0_IAWn3OjTukrBu0QiKhtqI-zfm_PHnLnCjrwA9WpEh1ufD-EnThZv9VZxzhR6iVHMcNP9jme3U0pyadIAurv0Ca-LaSxAC4PiHZ7520bvZekIpxKgIUoyAjBflxkleMAl2Nq0aaBtmTcLnvAfgwcNhh1U1GeDE4f5ZiEwkLchDKE3AkdVOj63uTCw",
    imageAlt: "Organic tea canister and macadamia set",
  },
  {
    id: "coconut-rolls",
    badge: "OTOP 5-Star",
    badgeClass: "bg-secondary-fixed",
    badgeTextClass: "text-on-secondary-fixed-variant",
    rating: "4.8",
    reviews: "(312)",
    name: "Coconut Flower Sugar Crispy Rolls",
    price: "฿180",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCes9mmX5VVpPvEVkUFEXE6c1QydZTjlNHgiZ0kSDvdHk8RG4smh0jKvOFMA6YT9MfI84yptv07OsVVUz8KDVDBfNDwSxLv2zOF9m-O-Yse6fYWCk9prIWa7Kv0mRYsYwyBvi9Cvw_iNNQFguTPpb4Lg1z90WGVyvPMkJ6fi6FHuWvQr2iICivG9L2XSrInd4Xeo3-3PfiMJAZkKL0cxP9XbrZ_4zccUj077yZ9yIG053hUfhnRKPTUEA",
    imageAlt: "Coconut flower sugar crispy rolls",
  },
  {
    id: "indigo-scarf",
    badge: "Handmade",
    badgeClass: "bg-surface-container-lowest/90",
    badgeTextClass: "text-on-surface",
    rating: "5.0",
    reviews: "(96)",
    name: "Indigo Dyed Lanna Cotton Scarf",
    price: "฿550",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCESPCGTpyIlj7w5Drtp7ValjuzoEwKe5fB8-NQmMSgeWk1CnAbaBayrzAHplYl0btIwxMYLP8kZS2Ho4n_22DWG1VZK5gZb6fIzAq2P1-knA3AVaWVq4yYWPPXMnZfS9VKeChYzMD565LHLkF0crB7PcvFGWptXKSo8E9rUXSHflQ7kayT8dikMnCd2rte0EFikyzoVCNyrFJeGrZNp-6Sv-Z8pCh4Utm-HvOMEZToOwmtrC1nl2K5EQ",
    imageAlt: "Indigo dyed Lanna cotton scarf",
  },
  {
    id: "skincare",
    badge: "Gate Pickup",
    badgeClass: "bg-on-surface",
    badgeTextClass: "text-surface",
    rating: "4.9",
    reviews: "(520)",
    name: "Duty-Free Travel Skincare Set",
    price: "฿1,490",
    saveNote: "Save ฿350",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD_VQP7boI0AuuNjFvR3O43grjie2nMNYvfosycFb9PRCFipkGD__DhYm-mYPxu38rwceaRwd_6ItTZfyTP8fIF-ke7c0WE-P0i0cdsYmna0vvbir5a-8VnZN8xBwz1n-z9J8P9mM3zvYFs_JxfCJ_1CJXnzZBmd0F5NEJ3Pg5HQ3g6z0L6j7PrCYyyV8Y88l4VMlzkzU2C9P-erYIrZWa89Ma9M7k19s7WDR6rDhHrKKq32CmGtmo8Hw",
    imageAlt: "Duty-free travel skincare kit",
  },
];

export const VALUE_BANNER = {
  title: "Travel Hands-Free",
  subtitle: "No bulky bags during your excursions",
  body: "We deliver gift-boxed souvenirs directly to your hotel concierge before checkout, or securely packed at Chiang Mai Airport (CNX) departure gate.",
  points: [
    { icon: "verified_user", label: "100% Authentic OTOP" },
    { icon: "cached", label: "Damage Guarantee" },
  ],
};
