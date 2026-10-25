import Link from "next/link";
import { AvailabilityStrip } from "@/components/AvailabilityStrip";
import { GalleryLightbox } from "@/components/GalleryLightbox";
import { ReserveButton } from "@/components/ReserveButton";
import { SaveShareButtons } from "@/components/SaveShareButtons";
import {
  FAQS,
  FINE_PRINTS,
  MOCK_COUPONS,
  groupAmenities,
} from "@/data/stayDetailMock";

const API_BASE =
  process.env["NEXT_PUBLIC_API_BASE_URL"] ?? "http://localhost:4000";

type DetailRoom = {
  id: string;
  name: string;
  price: number;
  perks: string[];
  maxGuests: number;
  totalRooms: number;
};

type NearbyPlace = {
  label: string;
  distance: string;
  category: string;
};

type HotelDetail = {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviews: number;
  stars: number;
  frontDesk: boolean;
  breakfast: boolean;
  description: string;
  phone: string;
  email: string;
  images: string[];
  amenities: string[];
  nearby: NearbyPlace[];
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
    deposit: number;
    paymentMethods: string;
    minAge: number;
    children: boolean;
    pets: boolean;
  };
  rooms: DetailRoom[];
};

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asNumber(value: unknown): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => (typeof item === "string" ? item : asString((item as { name?: unknown })?.name)))
    .filter((item) => item !== "");
}

// normalize ฝั่ง front ให้ทน shape (กัน back เปลี่ยนรูป response)
function normalizeDetail(raw: unknown, fallbackId: string): HotelDetail {
  const root = (raw as { data?: unknown })?.data ?? raw ?? {};
  const hotel = ((root as { hotel?: unknown })?.hotel ??
    (root as { property?: unknown })?.property ??
    root) as Record<string, unknown>;
  const policies = (hotel["policies"] as Record<string, unknown> | undefined) ?? {};
  const roomsRaw = Array.isArray(hotel["rooms"]) ? (hotel["rooms"] as unknown[]) : [];
  return {
    id: asString(hotel["id"] ?? hotel["hotel_id"]) || fallbackId,
    name: asString(hotel["name"]),
    address: asString(hotel["address"] ?? hotel["location"]),
    rating: asNumber(hotel["rating"] ?? hotel["reviewScore"]),
    reviews: asNumber(hotel["reviews"] ?? hotel["reviewCount"]),
    stars: asNumber(hotel["stars"] ?? hotel["propertyClass"]),
    frontDesk: false,
    breakfast: false,
    description: asString(hotel["description"]),
    phone: "",
    email: "",
    images: asStringArray(hotel["images"] ?? hotel["photos"] ?? hotel["photoUrls"]),
    amenities: asStringArray(hotel["amenities"] ?? hotel["facilities"]),
    nearby: [],
    policies: {
      checkIn: asString(policies["checkIn"] ?? hotel["checkIn"]),
      checkOut: asString(policies["checkOut"] ?? hotel["checkOut"]),
      cancellation: asString(policies["cancellation"]),
      deposit: 0,
      paymentMethods: "",
      minAge: 0,
      children: false,
      pets: false,
    },
    rooms: roomsRaw.map((room, index) => {
      const record = (room ?? {}) as Record<string, unknown>;
      return {
        id: asString(record["id"]) || `${fallbackId}-room-${index}`,
        name: asString(record["name"]),
        price: asNumber((record["price"] as { value?: unknown } | undefined)?.value ?? record["price"]),
        perks: asStringArray(record["perks"] ?? record["benefits"]),
        maxGuests: asNumber(record["maxGuests"]) || 2,
        totalRooms: asNumber(record["totalRooms"]) || 1,
      };
    }),
  };
}

// normalize ที่พัก owner (DB) เป็นรูปเดียวกับ HotelDetail
function normalizeStayDetail(raw: unknown, fallbackId: string): HotelDetail {
  const root = ((raw as { data?: unknown })?.data ?? {}) as Record<string, unknown>;
  const photos = Array.isArray(root["photos"]) ? (root["photos"] as Record<string, unknown>[]) : [];
  const amenities = (root["amenities"] as Record<string, unknown> | undefined) ?? {};
  const policy = (root["policy"] as Record<string, unknown> | undefined) ?? {};
  const roomTypes = Array.isArray(root["roomTypes"]) ? (root["roomTypes"] as Record<string, unknown>[]) : [];
  const flatAmenities = [
    ...(Array.isArray(amenities["generalAmenities"]) ? (amenities["generalAmenities"] as string[]) : []),
    ...(Array.isArray(amenities["roomAmenities"]) ? (amenities["roomAmenities"] as string[]) : []),
    ...(Array.isArray(amenities["diningServices"]) ? (amenities["diningServices"] as string[]) : []),
  ];
  const nearbyRaw = Array.isArray(root["nearby"]) ? (root["nearby"] as Record<string, unknown>[]) : [];
  return {
    id: asString(root["id"]) || fallbackId,
    name: asString(root["name"]),
    address: asString(root["addressLine"] ?? root["location"]),
    rating: asNumber(root["rating"]),
    reviews: asNumber(root["reviewCount"]),
    stars: asNumber(root["stars"]),
    frontDesk: (root["frontDesk24h"] as boolean | undefined) === true,
    breakfast: (root["breakfastIncluded"] as boolean | undefined) === true,
    description: asString(root["description"]),
    phone: asString(root["phone"]),
    email: asString(root["email"]),
    images: photos.map((photo) => asString(photo["url"])).filter((url) => url !== ""),
    amenities: flatAmenities,
    nearby: nearbyRaw.map((place) => ({
      label: asString(place["label"]),
      distance: asString(place["distance"]),
      category: asString(place["category"]) || "landmark",
    })),
    policies: {
      checkIn: asString(policy["checkIn"]),
      checkOut: asString(policy["checkOut"]),
      cancellation: asString(policy["cancellation"]),
      deposit: asNumber(policy["deposit"]),
      paymentMethods: asString(policy["paymentMethods"]),
      minAge: asNumber(policy["minAge"]),
      children: (policy["childrenAllowed"] as boolean | undefined) !== false,
      pets: (policy["petsAllowed"] as boolean | undefined) === true,
    },
    rooms: roomTypes.map((room, index) => ({
      id: asString(room["id"]) || `${fallbackId}-room-${index}`,
      name: asString(room["name"]),
      price: asNumber(room["basePrice"]),
      perks: [`พักได้ ${asNumber(room["maxGuests"])} คน`],
      maxGuests: asNumber(room["maxGuests"]) || 2,
      totalRooms: asNumber(room["totalRooms"]) || 1,
    })),
  };
}

async function fetchDetail(
  id: string,
  search: Record<string, string | undefined>,
): Promise<{ detail?: HotelDetail; error?: string }> {
  try {
    // ของ owner อ่าน DB ตรง ไม่ต้องง้อโควต้า booking.com
    if (search.source === "wandergo") {
      const res = await fetch(`${API_BASE}/stays/${encodeURIComponent(id)}`, {
        next: { revalidate: 60 },
      });
      if (!res.ok) {
        return { error: `ไม่พบที่พักนี้ (Backend ${res.status})` };
      }
      const json = (await res.json()) as unknown;
      return { detail: normalizeStayDetail(json, id) };
    }
    const params = new URLSearchParams();
    if (search.checkIn !== undefined && search.checkIn !== "") {
      params.set("checkIn", search.checkIn);
    }
    if (search.checkOut !== undefined && search.checkOut !== "") {
      params.set("checkOut", search.checkOut);
    }
    if (search.adults !== undefined && search.adults !== "") {
      params.set("adults", search.adults);
    }
    const suffix = params.toString() === "" ? "" : `?${params.toString()}`;
    const res = await fetch(`${API_BASE}/rabit/hotel/${encodeURIComponent(id)}${suffix}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      return { error: `Backend ${res.status} — ข้อมูลจริงยังไม่พร้อม (โควต้า API หมด)` };
    }
    const json = (await res.json()) as unknown;
    return { detail: normalizeDetail(json, id) };
  } catch {
    return { error: "ต่อ backend ไม่ได้ — รัน back ที่พอร์ต 4000 ก่อน" };
  }
}

type StayReviews = {
  average: number;
  total: number;
  buckets: { score: number; count: number }[];
  items: { id: string; rating: number; text: string | null; author: string; createdAt: string }[];
};

// ดึงรีวิวจริงจากระบบ (ถ้ายังไม่มี/ดึดไม่ได้ จะแสดง 0)
async function fetchReviews(id: string): Promise<StayReviews> {
  const empty: StayReviews = { average: 0, total: 0, buckets: [], items: [] };
  try {
    const res = await fetch(`${API_BASE}/bookings/stays/${encodeURIComponent(id)}/reviews`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      return empty;
    }
    const json = (await res.json()) as { data?: StayReviews };
    return json.data ?? empty;
  } catch {
    return empty;
  }
}

export default async function BookingDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { id } = await params;
  const search = await searchParams;
  const { detail, error } = await fetchDetail(id, search);
  const reviews = await fetchReviews(id);

  return (
    <main className="mx-auto w-full max-w-5xl px-margin py-4 md:py-8">
      <nav className="flex items-center gap-1 font-body-sm text-body-sm text-tertiary">
        <Link href="/bookingdetails" className="hover:text-primary">
          All properties
        </Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="truncate text-on-surface">{detail?.name ?? ""}</span>
      </nav>

      {error !== undefined || detail === undefined ? (
        <div className="mt-4 rounded-2xl bg-surface-container-lowest p-8 text-center shadow-sm">
          <p className="font-headline-sm text-headline-sm font-bold text-on-surface">
            โหลดรายละเอียดที่พักไม่ได้
          </p>
          <p className="mt-1 font-body-md text-body-md text-tertiary">{error}</p>
          <p className="mt-1 font-body-sm text-body-sm text-tertiary">
            หน้านี้จะแสดงข้อมูลจริงอัตโนมัติเมื่อโควต้า API กลับมา
          </p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="mt-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="font-headline-md text-headline-md font-extrabold tracking-tight text-on-surface">
                {detail.name !== "" ? detail.name : `Hotel ${detail.id}`}
              </h1>
              {detail.address !== "" ? (
                <p className="mt-1 font-body-md text-body-md text-tertiary">{detail.address}</p>
              ) : null}
            </div>
            <SaveShareButtons />
          </div>
            {detail.rating > 0 ? (
              <p className="mt-1 font-label-md text-label-md font-bold text-on-surface">
                {detail.rating} {detail.reviews > 0 ? `(${detail.reviews} reviews)` : null}
              </p>
            ) : null}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {detail.stars > 0 ? (
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: Math.min(detail.stars, 5) }).map((_, index) => (
                    <span key={index} className="material-symbols-outlined text-[16px] text-amber-500">
                      star
                    </span>
                  ))}
                </span>
              ) : null}
              {detail.frontDesk ? (
                <span className="rounded-full bg-surface-container-low px-2.5 py-1 font-label-sm text-label-sm font-semibold text-on-surface">
                  ฟรอนต์ 24 ชม.
                </span>
              ) : null}
              {detail.breakfast ? (
                <span className="rounded-full bg-surface-container-low px-2.5 py-1 font-label-sm text-label-sm font-semibold text-on-surface">
                  รวมอาหารเช้า
                </span>
              ) : null}
            </div>

          {/* Gallery */}
          <GalleryLightbox images={detail.images} name={detail.name} />

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
            <div className="min-w-0">

          {/* Description + Contact */}
          {detail.description !== "" || detail.phone !== "" || detail.email !== "" ? (
            <section className="mt-6">
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                About this property
              </h2>
              {(detail.phone !== "" || detail.email !== "") && (
                <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
                  {detail.phone !== "" ? `Phone: ${detail.phone}` : null}
                  {detail.phone !== "" && detail.email !== "" ? " • " : null}
                  {detail.email !== "" ? `Email: ${detail.email}` : null}
                </p>
              )}
              {detail.description !== "" ? (
                <details className="mt-2">
                  <summary className="cursor-pointer font-label-md text-label-md font-bold text-primary">
                    Show More
                  </summary>
                  <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
                    {detail.description}
                  </p>
                </details>
              ) : null}
            </section>
          ) : null}

          {/* Amenities */}
          {detail.amenities.length > 0 ? (
            <section className="mt-6">
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Amenities
              </h2>
              <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {groupAmenities(detail.amenities).map((group) => (
                  <div key={group.group}>
                    <p className="flex items-center gap-1.5 font-label-md text-label-md font-bold text-on-surface">
                      <span className="material-symbols-outlined text-[18px] text-primary">
                        {group.icon}
                      </span>
                      {group.group}
                    </p>
                    <ul className="mt-1 flex flex-col gap-1">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="font-body-md text-body-md text-on-surface-variant"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* Rooms */}
          <section className="mt-6">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Rooms {detail.rooms.length > 0 ? `(${detail.rooms.length})` : null}
            </h2>
            {detail.rooms.length === 0 ? (
              <p className="mt-2 font-body-md text-body-md text-tertiary">
                ยังไม่มีข้อมูลห้องพัก
              </p>
            ) : (
              <div className="mt-2 flex flex-col gap-4">
                <AvailabilityStrip stayId={detail.id} />
                {detail.rooms.map((room) => (
                  <article
                    key={room.id}
                    className="overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm"
                  >
                    <p className="px-4 pt-3 font-label-lg text-label-lg font-bold text-on-surface">
                      {room.name !== "" ? room.name : "Standard Room"}
                    </p>
                    <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-[220px_1fr_180px]">
                      <div className="h-40 overflow-hidden rounded-xl bg-surface-container-low">
                        {detail.images[0] ? (
                          <img
                            alt={room.name}
                            src={detail.images[0]}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div>
                        <p className="font-label-md text-label-md font-bold text-on-surface">
                          Your Choices
                        </p>
                        {room.perks.length > 0 ? (
                          <ul className="mt-1 flex flex-col gap-1">
                            {room.perks.map((perk) => (
                              <li
                                key={perk}
                                className="flex items-center gap-1.5 font-body-sm text-body-sm text-on-surface-variant"
                              >
                                <span className="material-symbols-outlined text-[16px] text-primary">
                                  check_circle
                                </span>
                                {perk}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                        <details className="mt-2">
                          <summary className="cursor-pointer font-label-sm text-label-sm font-bold text-primary">
                            Show 1 more rate
                          </summary>
                          <p className="mt-1 font-body-sm text-body-sm text-tertiary">
                            Free cancellation rate: ฿
                            {Math.round(room.price * 1.12).toLocaleString("en-US")}
                          </p>
                        </details>
                      </div>
                      <div className="flex flex-col justify-center rounded-xl bg-surface-container-low p-3 text-right">
                        <p className="font-body-sm text-body-sm text-tertiary">Today&apos;s Price</p>
                        <p className="font-headline-md text-headline-md font-extrabold text-primary">
                          ฿{room.price.toLocaleString("en-US")}
                        </p>
                        <ReserveButton
                          stayId={detail.id}
                          roomTypeId={room.id}
                          price={room.price}
                          maxGuests={room.maxGuests}
                          totalRooms={room.totalRooms}
                        />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

{/* Reviews */}
            <section className="mt-6">
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Guest Reviews
              </h2>

              {reviews.total === 0 ? (
                <p className="mt-2 rounded-2xl bg-surface-container-lowest p-6 text-center font-body-md text-body-md text-tertiary shadow-sm">
                  ยังไม่มีรีวิวสำหรับที่พักนี้ — รีวิวจะปรากฏหลังผู้จองเข้าพักจริง
                </p>
              ) : (
                <>
                  <div className="mt-2 flex items-end gap-2">
                    <span className="font-headline-lg text-headline-lg font-extrabold text-primary">
                      {reviews.average.toFixed(1)}
                    </span>
                    <span className="pb-1 font-body-md text-body-md text-tertiary">
                      /5 · {reviews.total} รีวิว
                    </span>
                  </div>

                  <div className="mt-2 flex flex-col gap-1.5">
                    {reviews.buckets.map((bucket) => (
                      <div key={bucket.score} className="flex items-center gap-2">
                        <span className="w-16 shrink-0 font-body-sm text-body-sm text-on-surface-variant">
                          {bucket.score} ดาว
                        </span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-container-high">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{
                              width: `${reviews.total === 0 ? 0 : (bucket.count / reviews.total) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="w-8 text-right font-label-sm text-label-sm font-bold text-on-surface">
                          {bucket.count}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                    {reviews.items.map((review) => (
                      <div
                        key={review.id}
                        className="w-72 shrink-0 rounded-2xl bg-surface-container-lowest p-4 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-label-md text-label-md font-bold text-on-surface">
                            {review.author}
                          </p>
                          <span className="font-headline-sm text-headline-sm font-extrabold text-primary">
                            {"★".repeat(review.rating)}
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-tertiary">
                          {new Date(review.createdAt).toLocaleDateString("th-TH")}
                        </p>
                        {review.text ? (
                          <p className="mt-2 line-clamp-3 font-body-sm text-body-sm text-on-surface-variant">
                            {review.text}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>

          {/* Policies */}
          <section className="mt-6 rounded-2xl bg-surface-container-lowest p-space-md shadow-sm">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Policies
            </h2>
            <div className="mt-2 flex flex-col gap-1 font-body-md text-body-md text-on-surface-variant">
              <p>Check-in: {detail.policies.checkIn !== "" ? detail.policies.checkIn : "—"}</p>
              <p>Check-out: {detail.policies.checkOut !== "" ? detail.policies.checkOut : "—"}</p>
              {detail.policies.cancellation !== "" ? (
                <p>Cancellation: {detail.policies.cancellation}</p>
              ) : null}
              {detail.policies.deposit > 0 ? (
                <p>Deposit: ฿{detail.policies.deposit.toLocaleString("en-US")}</p>
              ) : null}
              {detail.policies.paymentMethods !== "" ? (
                <p>Payment: {detail.policies.paymentMethods}</p>
              ) : null}
              {detail.policies.minAge > 0 ? (
                <p>Check-in age: {detail.policies.minAge}+</p>
              ) : null}
              <p>
                Children: {detail.policies.children ? "Allowed" : "Not allowed"} • Pets:{" "}
                {detail.policies.pets ? "Allowed" : "Not allowed"}
              </p>
            </div>
          </section>

          {/* Location */}
          {detail.nearby.length > 0 || detail.address !== "" ? (
            <section className="mt-6">
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Location
              </h2>
              {detail.address !== "" ? (
                <div className="mt-2 overflow-hidden rounded-2xl">
                  <iframe
                    title={`Map of ${detail.name}`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(detail.address)}&output=embed`}
                    className="h-56 w-full border-0"
                    loading="lazy"
                  />
                </div>
              ) : null}
              <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2">
                {[
                  { id: "transport", label: "Transport" },
                  { id: "shopping", label: "Shopping" },
                  { id: "landmark", label: "Landmarks" },
                  { id: "dining", label: "Dining" },
                ].map((group) => {
                  const places = detail.nearby.filter((place) => place.category === group.id);
                  if (places.length === 0) {
                    return null;
                  }
                  return (
                    <div key={group.id}>
                      <p className="font-label-md text-label-md font-bold text-on-surface">
                        {group.label}
                      </p>
                      <ul className="mt-1 flex flex-col gap-1">
                        {places.map((place) => (
                          <li
                            key={`${place.label}-${place.distance}`}
                            className="flex items-center justify-between gap-2 font-body-md text-body-md text-on-surface-variant"
                          >
                            <span className="truncate">{place.label}</span>
                            <span className="shrink-0 font-label-sm text-label-sm text-tertiary">
                              {place.distance}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>
          ) : null}

          {/* Coupons */}
          <section className="mt-6 rounded-2xl bg-gradient-to-r from-primary-fixed to-surface-container-lowest p-space-md">
            <div className="flex items-center justify-between gap-2">
              <p className="font-headline-sm text-headline-sm font-bold text-on-surface">
                First booking offer
              </p>
              <Link
                href="/promotions"
                className="shrink-0 rounded-xl bg-primary px-4 py-2 font-label-md text-label-md font-bold text-on-primary shadow-sm"
              >
                Claim All
              </Link>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
              {MOCK_COUPONS.map((coupon) => (
                <div
                  key={coupon.id}
                  className="flex items-center justify-between gap-2 rounded-xl border-2 border-dashed border-secondary-container bg-surface-container-lowest px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate font-label-md text-label-md font-bold text-on-surface">
                      {coupon.title}
                    </p>
                    <p className="truncate font-body-sm text-body-sm text-tertiary">
                      {coupon.desc}
                    </p>
                  </div>
                  <Link
                    href="/promotions"
                    className="shrink-0 font-label-md text-label-md font-bold text-primary"
                  >
                    Claim
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Fine Print */}
          <section className="mt-6">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Fine Print
            </h2>
            <div className="mt-2 flex flex-col gap-1 font-body-sm text-body-sm text-on-surface-variant">
              {FINE_PRINTS.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mt-6">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">FAQ</h2>
            <div className="mt-2 flex flex-col gap-2">
              {FAQS.map((item) => (
                <details
                  key={item.q}
                  className="rounded-xl bg-surface-container-lowest p-3 shadow-sm"
                >
                  <summary className="cursor-pointer font-label-md text-label-md font-bold text-on-surface">
                    {item.q}
                  </summary>
                  <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
            </div>

            {/* Sticky booking card */}
            <div className="hidden lg:block">
              <div className="sticky top-24 rounded-2xl bg-surface-container-lowest p-space-md shadow-md">
                {(() => {
                  const cheapest =
                    detail.rooms.length > 0
                      ? [...detail.rooms].sort((a, b) => a.price - b.price)[0]
                      : undefined;
                  return (
                    <>
                      <p className="font-label-md text-label-md font-bold text-primary">
                        Best price
                      </p>
                      <p className="mt-1 font-headline-md text-headline-md font-extrabold text-primary">
                        {cheapest ? `฿${cheapest.price.toLocaleString("en-US")}` : "—"}
                      </p>
                      {cheapest ? (
                        <p className="mt-1 truncate font-body-sm text-body-sm text-tertiary">
                          {cheapest.name}
                        </p>
                      ) : null}
                      <button
                        type="button"
                        className="mt-3 w-full rounded-xl bg-primary py-3 font-label-md text-label-md font-bold text-on-primary shadow-sm transition-all active:scale-95"
                      >
                        More options
                      </button>
                      <p className="mt-2 text-center font-label-sm text-label-sm text-tertiary">
                        We Price Match
                      </p>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
