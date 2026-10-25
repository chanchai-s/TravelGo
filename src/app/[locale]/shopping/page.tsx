import { ESSENTIALS, SOUVENIRS, VALUE_BANNER } from "@/data/shopping";
import { ShopExplorer } from "@/components/ShopExplorer";

export default function ShoppingPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-margin py-4 md:py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-container">
            <span className="material-symbols-outlined text-[20px] text-on-primary-container">
              explore
            </span>
          </div>
          <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-on-surface">
            Shopping
          </span>
        </div>
        <div className="flex items-center gap-space-xs">
          <button
            type="button"
            aria-label="Notifications"
            className="flex h-11 w-11 items-center justify-center text-on-surface-variant transition-colors hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[24px]">notifications</span>
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <span className="material-symbols-outlined text-[18px] text-on-primary">person</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-space-sm">
        <ShopExplorer />
      </div>

      {/* Quick Travel Essentials */}
      <section className="flex flex-col gap-space-sm pt-space-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Quick Travel Essentials
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Instant delivery to your room or gate
            </p>
          </div>
          <button
            type="button"
            className="flex items-center font-label-md font-bold text-primary"
          >
            See All
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>
        <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-2 lg:grid-cols-3">
          {ESSENTIALS.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-xl bg-surface-container-lowest p-space-sm shadow-[0_2px_8px_rgba(15,23,42,0.04)]"
            >
              <div>
                <div className="relative mb-2 flex h-24 w-full items-center justify-center overflow-hidden rounded-lg bg-surface-container-low">
                  <img
                    alt={item.imageAlt}
                    src={item.image}
                    className="h-full w-full object-cover"
                  />
                  <span
                    className={`absolute left-1.5 top-1.5 rounded-full px-2 py-0.5 font-label-sm text-[10px] ${item.tagClass} ${item.tagTextClass}`}
                  >
                    {item.tag}
                  </span>
                </div>
                <span className={`font-label-sm font-bold ${item.eyebrowClass}`}>
                  {item.eyebrow}
                </span>
                <h4 className="mt-0.5 font-label-lg text-label-lg font-bold leading-tight text-on-surface">
                  {item.name}
                </h4>
                <p className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">
                  {item.detail}
                </p>
              </div>
              <div className="mt-2 flex items-center justify-between pt-2">
                <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  {item.price}
                </span>
                <button
                  type="button"
                  aria-label={`Add ${item.name} to cart`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-container text-on-primary-container transition-opacity hover:opacity-90"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Souvenirs Grid */}
      <section className="flex flex-col gap-space-sm pt-space-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Curated Chiang Mai Souvenirs
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Direct from Northern artisan workshops
            </p>
          </div>
          <span className="rounded-full bg-surface-container px-2.5 py-1 font-label-sm font-semibold text-on-surface-variant">
            12 Items
          </span>
        </div>
        <div className="grid grid-cols-2 gap-space-sm lg:grid-cols-4">
          {SOUVENIRS.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_2px_8px_rgba(15,23,42,0.04)]"
            >
              <div>
                <div className="relative aspect-square w-full bg-surface-container">
                  <img
                    alt={item.imageAlt}
                    src={item.image}
                    className="h-full w-full object-cover"
                  />
                  <span
                    className={`absolute left-2 top-2 rounded-full px-2 py-0.5 font-label-sm text-[10px] font-bold ${item.badgeClass} ${item.badgeTextClass}`}
                  >
                    {item.badge}
                  </span>
                </div>
                <div className="flex flex-col gap-1 p-2.5">
                  <div className="flex items-center gap-1 text-[11px] text-on-surface-variant">
                    <span className="material-symbols-outlined text-[14px] text-amber-500">
                      star
                    </span>
                    <span className="font-bold text-on-surface">{item.rating}</span>
                    <span>{item.reviews}</span>
                  </div>
                  <h4 className="line-clamp-2 font-label-md text-label-md font-bold leading-tight text-on-surface">
                    {item.name}
                  </h4>
                </div>
              </div>
              <div className="flex items-center justify-between p-2.5 pt-0">
                <div>
                  <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    {item.price}
                  </span>
                  {item.saveNote !== undefined ? (
                    <span className="block text-[10px] font-semibold text-secondary-container">
                      {item.saveNote}
                    </span>
                  ) : null}
                </div>
                <button
                  type="button"
                  className="flex h-8 items-center gap-1 rounded-lg bg-primary-container px-2.5 font-label-sm text-on-primary-container hover:opacity-90"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Value Banner */}
      <section className="pb-space-sm pt-space-lg">
        <div className="flex flex-col gap-space-sm rounded-2xl bg-surface-container p-space-md">
          <div className="flex items-center gap-space-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-fixed">
              <span className="material-symbols-outlined text-[22px] text-primary">luggage</span>
            </div>
            <div>
              <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                {VALUE_BANNER.title}
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {VALUE_BANNER.subtitle}
              </p>
            </div>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{VALUE_BANNER.body}</p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {VALUE_BANNER.points.map((point) => (
              <div
                key={point.label}
                className="flex items-center gap-1.5 font-label-sm text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">
                  {point.icon}
                </span>
                <span>{point.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
