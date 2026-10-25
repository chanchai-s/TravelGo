export const rentalGuidelinesPrompt = (topic: string) => {
  const topics: Record<string, string> = {
    insurance: `
**ประกันภัยรถเช่า (Insurance)**
- เต็มรูปแบบ (Full): ครอบคลุมทุกกรณี
- พื้นฐาน (Basic): คุ้มครองพื้นฐาน
- เลือกได้ตามความต้องการ
`,
    fuel: `
**นโยบายน้ำมัน (Fuel Policy)**
- เต็มคืนเต็ม (FULL_TO_FULL)
- จ่ายล่วงหน้า (PREPAID)
- คืนระดับเดิม (SAME_TO_SAME)
`,
    cancellation: `
**นโยบายยกเลิก (Cancellation)**
- ยกเลิกฟรีภายใน 24 ชั่วโมงก่อนรับรถ
- ค่าปรับการยกเลิกกะทันหัน
`,
    driver: `
**คนขับ (Driver)**
- ต้องมีใบขับขี่ที่ถูกต้อง
- อายุขั้นต่ำ 21 ปี
- ประสบการณ์ขับขี่อย่างน้อย 1 ปี
`,
    crossborder: `
**ขับข้ามประเทศ (Cross-Border)**
- ต้องแจ้งล่วงหน้า
- ค่าธรรมเนียมข้ามประเทศ
- ต้องมีเอกสารประกอบการข้ามแดน
`,
    mileage: `
**ระยะทาง (Mileage)**
- ไม่จำกัดระยะทาง (Unlimited)
- จำกัดระยะทางต่อวัน
- คิดค่าบริการเพิ่มหากเกินระยะทาง
  },
    {
      name: "EV charging",
      description: "รถไฟฟ้าชาร์จเร็ว",
    },
    {
      type: "AUTO",
      label: "อัตโนมัติ",
    },
    {
      type: "MANUAL",
      label: "เกียร์ธรรมดา",
    },
  ],
  color: "#1E293B",
};
export const fuelTypes = ["PETROL", "DIESEL", "HYBRID", "EV"] as const;
export type FuelType = (typeof fuelTypes)[number];
export interface FuelPolicy {
  type: "FULL_TO_FULL" | "PREPAID" | "SAME_TO_SAME";
  name: string;
  description: string;
  pricePerDay: number;
  includesUnlimited: boolean;
}
export const FUEL_POLICIES: FuelPolicy[] = [
  {
    type: "FULL_TO_FULL",
    name: "เต็มคืนเต็ม",
    description: "รับรถถังเต็ม คืนถังเต็ม",
    fee: 0,
    pros: ["จ่ายตามที่ใช้จริง", "ไม่มีค่าใช้จ่ายเพิ่ม"],
    cons: ["ต้องหาปั๊มน้ำมันก่อนคืนรถ"],
    recommendedFor: "ทริปสั้น",
  },
  {
    type: "PREPAID",
    name: "ชำระล่วงหน้า",
    description: "จ่ายค่าน้ำมันล่วงหน้า คืนเท่าไหร่ก็ได้",
    fee: 500,
    pros: ["ไม่ต้องหาปั๊มน้ำมันก่อนคืน", "สะดวกสำหรับเที่ยวกลางคืน"],
    cons: ["จ่ายเต็มถังแม้ใช้ไม่หมด", "ราคาต่อลิตรสูงกว่าปกติ"],
    recommendedFor: "เที่ยวบินเช้ามาก/ดึก",
  },
  {
    type: "SAME_TO_SAME",
    name: "คืนระดับเดิม",
    description: "คืนรถที่ระดับน้ำมันเท่ากับตอนรับ",
    fee: 0,
    pros: ["ไม่ต้องหาปั๊มน้ำมันก่อนคืน", "จ่ายตามที่ใช้จริง"],
    cons: ["ต้องหาปั๊มน้ำมันให้ตรงระดับ", "ยากที่จะควบคุมระดับน้ำมันให้แม่นยำ"],
    recommendedFor: "ทริปสั้น การเดินทางในเมือง",
  },
];