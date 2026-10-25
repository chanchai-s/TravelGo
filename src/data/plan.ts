export type Preference = {
  id: string;
  label: string;
  icon: string;
};

export type Stop = {
  id: string;
  time: string;
  price: string;
  name: string;
  desc: string;
  metaIcon: string;
  meta: string;
  metaTone: "primary" | "coral" | "muted";
  image: string;
  imageAlt: string;
  dot: "primary" | "coral";
  timeTone: "primary" | "coral";
};

export type DayPlan = {
  day: number;
  focus: string;
  title: string;
  stopsLabel: string;
  stops: Stop[];
};

// Mock data (no backend yet)
export const PLAN_TITLE = {
  name: "WanderAI Planner",
  badge: "AI 2.0",
};

export const PLAN_QUERY = {
  destination: "Chiang Mai, Thailand • 3 Days",
  meta: ["Budget: ฿15,000", "2 Travelers"],
  status: "Active Plan",
};

export const PREFERENCES: Preference[] = [
  { id: "culture", label: "Cultural & Temples", icon: "temple_buddhist" },
  { id: "foodie", label: "Foodie Trail", icon: "ramen_dining" },
  { id: "cafe", label: "Cafe Hopping", icon: "coffee" },
  { id: "nature", label: "Nature & Waterfalls", icon: "forest" },
];

export const COST = {
  total: "฿12,850",
  cap: "/ ฿15,000 cap",
  allocated: "85% allocated",
  barPct: 85.6,
  saved: "Saved ฿2,150",
  legend: [
    { color: "bg-primary-container", label: "Activities & Entry (฿6,400)" },
    { color: "bg-secondary-container", label: "Food & Transit (฿6,450)" },
  ],
};

export const DAY_PLANS: DayPlan[] = [
  {
    day: 1,
    focus: "Day 1 Focus",
    title: "Old City Heritage & Street Food",
    stopsLabel: "4 Stops",
    stops: [
      {
        id: "chedi-luang",
        time: "09:00 AM • 1.5 hrs",
        price: "฿50",
        name: "Wat Chedi Luang",
        desc: "Ancient ruined chedi, monks blessing & tranquil gardens.",
        metaIcon: "pin_drop",
        meta: "Old City Centre",
        metaTone: "muted",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDQJ_AQjlZJyyfnw4bp_eyZZ7srTp94KR6sTDjnNl24-vQelcFQLb610AOqxq4dMfIf-4Ul8Ac5baA6gtdhHJ_ePAO_xw5wPXq4CkN7ctioBgnJeiPfoK0tuAjBQ0Db7LTNQdRGya-CGj2ADOJ2gfq39Ihegredt7RWN8iCXylC1OQfIDpsx99c9J8Cs-LxioAsr2bvhJ2oLIuhSgaYBjKjMDwTNWV7jlEGUfaZgFi3kmeprX8ixmPOZw",
        imageAlt: "Wat Chedi Luang temple in Chiang Mai",
        dot: "primary",
        timeTone: "primary",
      },
      {
        id: "khao-soi",
        time: "12:30 PM • 1 hr",
        price: "฿120",
        name: "Khao Soi Lam Duan",
        desc: "Legendary 80-year coconut curry recipe with pickled greens.",
        metaIcon: "award_star",
        meta: "Michelin Bib Gourmand",
        metaTone: "coral",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCTk4TM1rTRrYrfzA8JVMuMW6aGJb5i2BCP5f_bLBtrYfAEcJZ_hMebEsaxBeZclb1LUKOXWFuAcBOzn9pf2Cki3XDK6pRlkMcRwFXcz7jeusVEd_cJt4TvUG0Mp95oP2sGGXcXr_6VNkQyjhqQWC-OiNACczwlN8SCzj705BD3LSuwV0o-IqMtoKX8dtXpxns-fA7W4zR6RUsGiW3rUGiOI7mGHT8Zo84BL0pTeR_D1hgUzicRUlfcVA",
        imageAlt: "Khao Soi northern curry noodle soup",
        dot: "coral",
        timeTone: "coral",
      },
      {
        id: "art-paradise",
        time: "03:00 PM • 2 hrs",
        price: "฿300",
        name: "Art in Paradise",
        desc: "Vibrant 3D visual art displays with air-conditioned afternoon ease.",
        metaIcon: "photo_camera",
        meta: "Selfie Hotspot",
        metaTone: "muted",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCcDTgT-uL4X_0a71kX_Po8d0NaXG90JIPcazEs-EOLeBo6U3tK8gTUEJMJcdVAaoGBiaQldvW5RT0mRVuqQ0k84VhxrPF0wzDXHZdgG8Ws1BnPh-uMb47yJzzNjgEaYcrILPlUXx0hM9Wt6hIaXDZmv1YIRQd0ZMRzxb6HKORhL9TjJGzqGJAOl2aIvQMnDEpMA54G93vZO1YDfKeAmaJQTndBTEWzHqdGLfsukpkdj6rjKmnAgUAa3w",
        imageAlt: "3D illusion art museum in Chiang Mai",
        dot: "primary",
        timeTone: "primary",
      },
      {
        id: "night-market",
        time: "06:30 PM • 2.5 hrs",
        price: "฿250",
        name: "Chang Phuak Gate Night Market",
        desc: "Famous Cowboy Hat Lady braised pork leg and mango sticky rice.",
        metaIcon: "nightlife",
        meta: "Street Food Crawl",
        metaTone: "muted",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCJOBga3MPxyaIKAaPPAnMCFe9kVwKJ73LIn83l-7it2dWjW4n3TrTsK5aVVdb01ACQosrjb0K81ArGESCNMNPosb_XsSa6dPZ3ffcoca-2_fyzzhJRrOXmk9Hq3cmazod1sRBJ3eHM5WY5OZOhxsXBCGKh-YGEQC8B-YrG7C49zXIAHij_rnnHVw_cuoaRV8wqHjFfguVMeEhwASlek2DD2NyLblhjsfpBfAENssQJS1VaIGof0qkgBw",
        imageAlt: "Chang Phuak night market street food",
        dot: "coral",
        timeTone: "coral",
      },
    ],
  },
  {
    day: 2,
    focus: "Day 2 Focus",
    title: "Misty Mountains & Doi Suthep",
    stopsLabel: "4 Stops",
    stops: [
      {
        id: "mountain-drive",
        time: "08:00 AM • 1 hr",
        price: "฿400",
        name: "Scenic Mountain Drive",
        desc: "Red truck (Songthaew) winding route through pine forests.",
        metaIcon: "pin_drop",
        meta: "Doi Suthep Road",
        metaTone: "muted",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDx1fjkD7Q9zpb2uLdNdmDb-BTXn8ET1Ca-S9ZoiUfRYpFl7-HosIEmlJmJyABwLv1H8UYHq6MEKeptppc_T1fLEfOL5pi01MEzklxFDAJBlaJ7_HbbM3aDf0DKobHontM4Z6Xm3lOL4fNO3yDE1RFuypw0fpUwxHrbho9Sn5EoRanwQjL2qxYHJQevc_2DSzwzCuDRp9K1QnCfPq5wv_o9IN17KTjjcXT8fjK9M4ko1fc8mkvaFgHwtw",
        imageAlt: "Misty mountain road in Chiang Mai",
        dot: "primary",
        timeTone: "primary",
      },
      {
        id: "doi-suthep",
        time: "10:30 AM • 2 hrs",
        price: "฿100",
        name: "Wat Phra That Doi Suthep",
        desc: "Sacred 306-step Naga staircase and mountain panorama.",
        metaIcon: "pin_drop",
        meta: "Doi Suthep Summit",
        metaTone: "muted",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuA4IGW_tGpQQVTOOSnNzwN_23wvsh4gveXJUV5C7lf9FYjEXxygLRDBMs6NXjjxakKt69YhjBNjod9M63yBsjL3uh7e5eL1cMHJR9GzdhP57hxPyB3RsLcJDtTHWtN_G1eE0zvgttI9O4bzkDKPoxDQS9ZuKgTLV9Xg8IhIXLgFzr1pTdQRTHDnebSbLA2p6d-xfp7T3zIZuhmepDzE-xCn1Zw8ATYCiyqGLv3RJBGhdKCau-0XG42Yug",
        imageAlt: "Doi Suthep golden pagoda",
        dot: "primary",
        timeTone: "primary",
      },
      {
        id: "riverside-lunch",
        time: "01:00 PM • 1.5 hrs",
        price: "฿950",
        name: "Riverside Lunch at Anantara",
        desc: "Gentle Ping river breeze and fine northern fusion treats.",
        metaIcon: "restaurant",
        meta: "Ping Riverside",
        metaTone: "muted",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBC5FExZKlRQxktoAe9WGCGqxeqwTsy5qWPOGxBIi3PSGqRd0mVs-YQ-suDVBlQT_mfFCczXC24sHBF83VKcY6ydYtPUhtDe_Rih9OlkQV2gZyb3byaQDwTWiheck9mRlC_f9jjLKfad6S7dc_sLL8qDQK7CmdmUJBuGu1f_pjSGe33eAxd3mwFf5sSSM4Uuj-m54d9izb9MqPx8Z72x_kaQo75g6u5QjyNpQiEGOd8Vvf4Lyag9z3wog",
        imageAlt: "Riverside dining at Anantara",
        dot: "coral",
        timeTone: "coral",
      },
      {
        id: "nimman-cafe",
        time: "04:00 PM • 2 hrs",
        price: "฿220",
        name: "Nimman Cafe Hopping",
        desc: "Specialty nitro cold brews at Ristr8to & indie boutiques.",
        metaIcon: "coffee",
        meta: "Nimmanhaemin",
        metaTone: "muted",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBQbk2bgWeOsIALxze971VNn2UovOQyCEHHP2It4O_ZSfTDBlFPEeVoTb85kEH1HRqQLictzYrNIgMJ2sqSVoaIXqGYevsEMhPrgs5oF_mAuRsNHKP-tVXVtaC6pP49wg2LExlV2euI0lxtP2gBkHosWs8Ge1h-qz3qmiIJmnWI5jzekGmv3yT0xmp5U8hWzCUHd8E8pWD08wj5QStMpbwvEcoPzsyQD7RCr2all6GRXajUQpTtc2vElw",
        imageAlt: "Specialty coffee shop in Nimman",
        dot: "coral",
        timeTone: "coral",
      },
    ],
  },
  {
    day: 3,
    focus: "Day 3 Focus",
    title: "Ethical Elephants & Crafts",
    stopsLabel: "2 Key Stops",
    stops: [
      {
        id: "elephant-day3",
        time: "08:30 AM • 4 hrs",
        price: "฿2,200",
        name: "Ethical Elephant Sanctuary",
        desc: "Mud bath, feeding fruit, and forest walk with rescued elephants.",
        metaIcon: "pin_drop",
        meta: "Mae Rim Valley",
        metaTone: "muted",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDyCtJPsjcTOEJ5f-WXXFPYHuwATm8oVHm3X-e6KDAu0TKKd0FSc3ig5Nav121rpqn_Wb6reYTj9hS-mgapb0jb4OiuhE8wYpCeLNBSNyZa_ArNrqI2qXKOqsb5d4Bb5UT6vJQSaja--9QGjdyNuCSK8tmLiR3JizX_25n59YDaniaaSrHav5HHlVz9pflHfRqm_4DhqsX_CwecnT30IxdjGPE8fXXjACEjPkc7BQi6iN1iSCA_yWzI1w",
        imageAlt: "Elephant sanctuary in Mae Rim",
        dot: "primary",
        timeTone: "primary",
      },
      {
        id: "baan-kang-wat",
        time: "02:00 PM • 3 hrs",
        price: "฿350",
        name: "Baan Kang Wat Art Village",
        desc: "Handmade indigo textiles, ceramic workshops, and organic tea.",
        metaIcon: "palette",
        meta: "Wat Umong Area",
        metaTone: "muted",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBx2JjXnYAfsVcJQcRDScVGhBjwxAGl0efSjzmG4sOvK6bwYA9lkmUP3uE3hhhwd2mjIWSbkSMf4hQ1YAGmW48ILdGX8C0vZkuuKc4-koWXyqixQ1NwnHxWplrn67BrL2zUDIQVHjjT8MNQVfXQATFnyycsU5ECIigieH2751GAipW8BvuqWcUVpPpT0ZsBbVrqzt0mKdlc_fDWBoNwKvhgAiig4vjTrQtRjboG1j6UMcBYd1X5vC-shw",
        imageAlt: "Baan Kang Wat artist community",
        dot: "coral",
        timeTone: "coral",
      },
    ],
  },
];

export const AI_TIP = {
  title: "WanderAI Insider Tip",
  body: "Morning visits to Wat Chedi Luang bypass afternoon humidity. All ticket passes and Songthaew reservations are bundled into one voucher.",
};

export const CHECKOUT = {
  total: "฿12,850",
  itemsLabel: "View price items (6)",
  bookLabel: "Book Entire Trip",
  securingLabel: "Securing Itinerary...",
  confirmedLabel: "Itinerary Confirmed!",
};
