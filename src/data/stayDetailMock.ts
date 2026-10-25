// Mock ชั่วคราวสำหรับหน้า detail — มี API/DB จริงค่อยเปลี่ยน
// (reviews ยังไม่มีของจริง เพราะต้องรอแขก checkout ก่อน)

export type MockReview = {
  id: string;
  name: string;
  tier: string;
  country: string;
  tripType: string;
  score: number;
  text: string;
  date: string;
};

export const MOCK_REVIEWS: MockReview[] = [
  {
    id: "r1",
    name: "Nichazainali",
    tier: "Platinum",
    country: "ไทย",
    tripType: "เดินทางคนเดียว",
    score: 10.0,
    text: "ชอบตั้งแต่เริ่มเช็คอิน พี่สตาฟน่ารักมาก สะดวกมากใกล้รถไฟฟ้า ห้องสะอาด จะมาอีกนะ",
    date: "ตุลาคม 2026",
  },
  {
    id: "r2",
    name: "Kimnong11",
    tier: "Diamond",
    country: "ไทย",
    tripType: "เดินทางคนเดียว",
    score: 9.0,
    text: "ทำเลดีมาก ห้องโอเคสมราคา เดินทางสะดวก ของกินหาง่าย",
    date: "ตุลาคม 2026",
  },
  {
    id: "r3",
    name: "Anonymous",
    tier: "Platinum",
    country: "ไทย",
    tripType: "คู่รัก",
    score: 8.0,
    text: "พนักงานต้อนรับอธิบายดี ห้องกว้าง คุ้มค่าราคาที่จ่าย มีอาหารเช้า",
    date: "กันยายน 2026",
  },
];

export const MOCK_SCORE_BARS = [
  { label: "ความสะอาด", value: 8.8 },
  { label: "สิ่งอำนวยความสะดวก", value: 8.4 },
  { label: "ทำเลที่ตั้ง", value: 9.1 },
  { label: "บริการ", value: 8.6 },
];

export const MOCK_COUPONS = [
  { id: "c1", title: "Up to ฿200 off", desc: "New user promo code" },
  { id: "c2", title: "Up to 20% off", desc: "First Booking Deal" },
];

export const FAQS = [
  {
    q: "เช็คอิน/เช็คเอาท์กี่โมง?",
    a: "ดูเวลาได้ที่หัวข้อ Policies ด้านบน อาจต่างกันตามที่พัก",
  },
  {
    q: "ยกเลิกฟรีไหม?",
    a: "ขึ้นกับนโยบายของที่พัก ดูที่หัวข้อ Policies",
  },
  {
    q: "นำสัตว์เลี้ยงเข้าพักได้ไหม?",
    a: "ดูที่หัวข้อ Policies หากไม่ระบุให้สอบถามที่พักโดยตรง",
  },
  {
    q: "จ่ายเงินที่ไหน?",
    a: "จ่ายออนไลน์ตอนจอง หรือจ่ายที่ที่พักตามที่ระบุใน Policies",
  },
];

export const FINE_PRINTS = [
  "Please present a valid ID at check-in.",
  "Guests under the age requirement must be accompanied by an adult.",
  "Pets policy and house rules follow the Policies section above.",
];

// จับคู่ amenity string → หมวด + ไอคอน (โชว์แบบ Trip.com)
const AMENITY_MAP: { match: string[]; group: string; icon: string }[] = [
  { match: ["wifi", "ไวไฟ", "internet"], group: "Internet", icon: "wifi" },
  { match: ["pool", "สระ"], group: "สระว่ายน้ำ", icon: "pool" },
  { match: ["parking", "จอด"], group: "Parking", icon: "local_parking" },
  { match: ["spa", "สปา", "massage", "นวด"], group: "Health & wellness", icon: "spa" },
  { match: ["gym", "fitness", "ฟิตเนส"], group: "Health & wellness", icon: "fitness_center" },
  { match: ["restaurant", "อาหาร", "breakfast", "dining", "cafe", "คาเฟ่", "bar"], group: "Food & drink", icon: "restaurant" },
  { match: ["front", "reception", "ฟรอนต์", "concierge", "lobby"], group: "Front desk services", icon: "concierge" },
  { match: ["safe", "ตู้เซฟ"], group: "Front desk services", icon: "lock" },
  { match: ["air", "แอร์"], group: "ในห้องพัก", icon: "ac_unit" },
  { match: ["tv", "ทีวี"], group: "ในห้องพัก", icon: "tv" },
  { match: ["bath", "อ่าง", "shower"], group: "ในห้องพัก", icon: "bathtub" },
  { match: ["balcony", "ระเบียง", "terrace"], group: "ในห้องพัก", icon: "balcony" },
];

export type AmenityGroup = { group: string; icon: string; items: string[] };

export function groupAmenities(amenities: string[]): AmenityGroup[] {
  const groups = new Map<string, AmenityGroup>();
  const other: string[] = [];
  amenities.forEach((item) => {
    const lower = item.toLowerCase();
    const found = AMENITY_MAP.find((entry) =>
      entry.match.some((keyword) => lower.includes(keyword)),
    );
    if (!found) {
      other.push(item);
      return;
    }
    const current = groups.get(found.group) ?? { group: found.group, icon: found.icon, items: [] };
    current.items.push(item);
    groups.set(found.group, current);
  });
  const result = [...groups.values()];
  if (other.length > 0) {
    result.push({ group: "ทั่วไป", icon: "apps", items: other });
  }
  return result;
}
