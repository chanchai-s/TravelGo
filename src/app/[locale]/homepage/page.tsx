import { CATEGORIES, DESTINATIONS, LOGO_URL, STAYS } from "@/data/homepage";
import { FlashSaleBanner } from "@/components/FlashSaleBanner";
import { SearchCard } from "@/components/SearchCard";
import { FiltersSidebar } from "@/components/FiltersSidebar";
import { ServiceRail } from "@/components/ServiceRail";

export default function Homepage() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-margin py-4 md:py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-surface-container-lowest p-1 shadow-sm md:hidden">
            <img
              alt="WanderGo Travel Super App Logo"
              src={LOGO_URL}
              className="h-full w-full object-contain"
            />
          </div>
        </div>
        <div className="relative">
          <button
            type="button"
            aria-label="Notifications"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-lowest text-on-surface shadow-sm transition-colors hover:text-primary"
          >
            <span className="material-symbols-outlined text-[22px]">
              notifications
            </span>
          </button>
          <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-secondary-container" />
        </div>
      </div>

      <SearchCard />

      <ServiceRail />

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <FiltersSidebar />

        <div className="space-y-6">
          <div className="grid grid-cols-6 gap-2">
            {CATEGORIES.map((category) => (
              <a
                key={category.id}
                href="#"
                className="group flex flex-col items-center gap-1.5"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-xs transition-transform group-hover:scale-105 ${category.tileClass}`}
                >
                  <span
                    className={`material-symbols-outlined text-[24px] ${category.iconClass}`}
                  >
                    {category.icon}
                  </span>
                </div>
                <span className="w-full truncate text-center font-label-sm text-label-sm font-semibold text-on-surface">
                  {category.label}
                </span>
              </a>
            ))}
          </div>

          <FlashSaleBanner />

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  Trending Destinations
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Most booked by travelers this month
                </p>
              </div>
              <a
                href="#"
                className="flex items-center font-label-md text-label-md font-semibold text-primary"
              >
                See All
                <span className="material-symbols-outlined text-[16px]">
                  chevron_right
                </span>
              </a>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {DESTINATIONS.map((destination) => (
                <div
                  key={destination.id}
                  className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-surface-container-lowest shadow-[0_2px_8px_rgba(15,23,42,0.06)]"
                >
                  <div className="relative h-28 overflow-hidden">
                    <img
                      alt={destination.imageAlt}
                      src={destination.image}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute left-2 top-2 flex items-center gap-0.5 rounded-full bg-surface-container-lowest/90 px-2 py-0.5 font-label-sm text-label-sm font-bold text-on-surface shadow-sm backdrop-blur-sm">
                      <span
                        className={`material-symbols-outlined text-[12px] ${destination.badgeIconClass}`}
                      >
                        {destination.badgeIcon}
                      </span>
                      {destination.badge}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-3">
                    <div>
                      <h4 className="font-label-lg text-label-lg font-bold text-on-surface">
                        {destination.name}
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {destination.country}
                      </p>
                    </div>
                    <div className="pt-2">
                      <p className="font-body-sm text-[11px] text-on-surface-variant">
                        Avg. stay
                      </p>
                      <p className="font-label-md text-label-md font-bold text-primary">
                        {destination.avgPrice}
                        <span className="text-[11px] font-normal text-on-surface-variant">
                          /night
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  Popular Stays
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Handpicked luxury villas &amp; boutique resorts
                </p>
              </div>
              <a
                href="#"
                className="flex items-center font-label-md text-label-md font-semibold text-primary"
              >
                Explore
                <span className="material-symbols-outlined text-[16px]">
                  chevron_right
                </span>
              </a>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {STAYS.map((stay) => (
                <div
                  key={stay.id}
                  className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-surface-container-lowest shadow-[0_4px_16px_rgba(15,23,42,0.06)]"
                >
                  <div className="relative h-36 overflow-hidden">
                    <img
                      alt={stay.imageAlt}
                      src={stay.image}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-lowest/80 text-on-surface-variant backdrop-blur-md transition-colors hover:text-secondary-container">
                      <span className="material-symbols-outlined text-[18px]">
                        favorite
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-full bg-surface-container-lowest/90 px-2 py-0.5 font-label-sm text-label-sm font-bold text-on-surface shadow-sm backdrop-blur-sm">
                      <span className="material-symbols-outlined text-[14px] text-amber-500">
                        star
                      </span>
                      <span>{stay.rating}</span>
                      <span className="font-normal text-on-surface-variant">
                        ({stay.reviews})
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 p-3.5">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary font-label-sm">
                        {stay.tag}
                      </span>
                      <h4 className="truncate font-label-lg text-label-lg font-bold text-on-surface">
                        {stay.name}
                      </h4>
                      <p className="truncate font-body-sm text-body-sm text-on-surface-variant">
                        {stay.location}
                      </p>
                    </div>
                    <div className="flex items-baseline justify-between pt-1">
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Starts from
                      </span>
                      <div className="text-right">
                        <span className="font-headline-sm text-headline-sm font-bold text-primary">
                          {stay.price}
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          /night
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
