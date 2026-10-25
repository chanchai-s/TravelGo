// Config ประเภทย่อยฝั่งโรงแรม — จะเพิ่ม boutique/capsule ทีหลังเติมแถวเดียว
export type HotelSubtypeId = "HOTEL" | "GUEST_HOUSE" | "RESORT" | "HOSTEL";

export type HotelSubtype = {
  id: HotelSubtypeId;
  icon: string;
  name: string;
  desc: string;
};

export const HOTEL_SUBTYPES: HotelSubtype[] = [
  { id: "HOTEL", icon: "hotel", name: "โรงแรม", desc: "ที่พักมาตรฐาน มีฟรอนต์บริการ" },
  { id: "GUEST_HOUSE", icon: "bed", name: "เกสต์เฮาส์", desc: "ที่พักขนาดเล็ก อบอุ่น" },
  { id: "RESORT", icon: "holiday_village", name: "รีสอร์ต", desc: "พักผ่อนพร้อมสระ สปา" },
  { id: "HOSTEL", icon: "bunk", name: "โฮสเทล", desc: "ขายเป็นเตียง ห้องนอนรวม" },
];

export function isHotelSubtype(value: string): value is HotelSubtypeId {
  return HOTEL_SUBTYPES.some((item) => item.id === value);
}

// กลุ่มใหญ่ 3 ใบ (หน้า /host)
export type PropertyGroupId = "homes" | "hotel" | "unique";

export type PropertyGroup = {
  id: PropertyGroupId;
  icon: string;
  name: string;
  desc: string;
  href: string;
};

export const PROPERTY_GROUPS: PropertyGroup[] = [
  {
    id: "homes",
    icon: "house",
    name: "ที่พักประเภทบ้าน",
    desc: "ที่พักเดี่ยวๆ ที่เปิดให้เช่าทั้งหลัง เช่น อพาร์ตเมนต์/แฟลตเดี่ยวๆ บังกะโลหลังเดี่ยว วิลลา และโฮมสเตย์ เหมาะสำหรับนักเดินทางที่ต้องการพักผ่อนแบบมีความเป็นส่วนตัว",
    href: "/host/homes",
  },
  {
    id: "hotel",
    icon: "hotel",
    name: "โรงแรม",
    desc: "ที่พักที่มีส่วนกลางหลายส่วนให้เช่น โรงแรม โมเทล เซอร์วิสอพาร์ตเมนต์ หรือรีสอร์ต มีสิ่งอำนวยความสะดวกส่วนกลางและมีเจ้าหน้าที่ต้อนรับ",
    href: "/host/hotel",
  },
  {
    id: "unique",
    icon: "cabin",
    name: "ที่พักที่มีเอกลักษณ์เฉพาะตัว",
    desc: "ที่พักลักษณะพิเศษ เช่น บูทีค เรือ บ้านต้นไม้ ฟาร์มสเตย์ หรือปราสาท ดึงดูดนักเดินทางที่ต้องการพักผ่อนในที่พักไม่เหมือนใคร",
    href: "/host/unique",
  },
];

// ประเภทย่อยฝั่งบ้าน (หน้า /host/homes)
export type HomeSubtypeId =
  | "APARTMENT"
  | "WHOLE_HOUSE"
  | "VILLA"
  | "BUNGALOW"
  | "HOMESTAY";

export type HomeSubtype = {
  id: HomeSubtypeId;
  icon: string;
  name: string;
  desc: string;
};

export const HOME_SUBTYPES: HomeSubtype[] = [
  {
    id: "APARTMENT",
    icon: "apartment",
    name: "อพาร์ตเมนต์/แฟลต",
    desc: "ที่พักที่มีห้องต่างๆ พร้อมอยู่ ส่วนมากอยู่ในอาคารที่ประกอบด้วยห้องชุดเหมือนๆ กัน",
  },
  {
    id: "WHOLE_HOUSE",
    icon: "house",
    name: "บ้านทั้งหลัง",
    desc: "บ้านเป็นหลังซึ่งตั้งอยู่เดี่ยวๆ มีทางเข้าส่วนตัว แต่ละหลังมีเจ้าของหรือผู้ดูแลแยกกัน",
  },
  {
    id: "VILLA",
    icon: "villa",
    name: "วิลลา",
    desc: "บ้านพักตากอากาศหรู ตั้งอยู่เดี่ยวๆ มีบรรยากาศและการตกแต่งในสไตล์ที่เป็นเอกลักษณ์",
  },
  {
    id: "BUNGALOW",
    icon: "cabin",
    name: "บังกะโล",
    desc: "บ้านพักหลังเดี่ยวแบบทั่วไป ในสภาพแวดล้อมแบบชนบท",
  },
  {
    id: "HOMESTAY",
    icon: "home",
    name: "โฮมสเตย์",
    desc: "ห้องให้เช่าในบ้านที่แชร์กับเจ้าของบ้าน โดยมีสิ่งอำนวยความสะดวกส่วนกลาง",
  },
];
