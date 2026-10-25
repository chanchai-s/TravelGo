import Link from "next/link";
import { HostOnboarding } from "@/components/HostOnboarding";
import { HotelWizard } from "@/components/HotelWizard";
import { HostGate } from "@/components/HostGate";
import { HOME_SUBTYPES, HOTEL_SUBTYPES, isHotelSubtype } from "@/data/hostTypes";

const KNOWN_TYPES = new Set<string>([
  ...HOTEL_SUBTYPES.map((item) => item.id),
  ...HOME_SUBTYPES.map((item) => item.id),
  "CONDO",
  "UNIQUE",
]);

export default async function HostNewPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const query = await searchParams;
  const type = query.type ?? "";
  const backHref =
    type === "UNIQUE" ? "/host/unique" : isHotelSubtype(type) ? "/host/hotel" : "/host/homes";
  const subtype = HOTEL_SUBTYPES.find((item) => item.id === type);

  return (
    <main className="mx-auto w-full max-w-3xl px-margin py-4 md:py-8">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1 font-label-md text-label-md font-bold text-primary"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        เลือกประเภท
      </Link>
      {!KNOWN_TYPES.has(type) ? (
        <div className="mt-4 rounded-2xl bg-surface-container-lowest p-8 text-center shadow-sm">
          <p className="font-headline-sm text-headline-sm font-bold text-on-surface">
            เลือกประเภทย่อยก่อน
          </p>
          <Link
            href="/host"
            className="mt-2 inline-block font-label-md text-label-md font-bold text-primary"
          >
            ไปหน้าเลือกประเภท
          </Link>
        </div>
      ) : subtype ? (
        <div className="mt-4">
          <h1 className="font-headline-md text-headline-md font-extrabold tracking-tight text-on-surface">
            ลงประกาศ{subtype.name}
          </h1>
          <div className="mt-4">
            <HostGate>
              <HotelWizard subtype={subtype.id} subtypeName={subtype.name} />
            </HostGate>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <HostGate>
            <HostOnboarding initialTypeId={type} />
          </HostGate>
        </div>
      )}
    </main>
  );
}
