const filterSections = [
  {
    title: "Price per night",
    items: ["Under ฿1,000", "฿1,000 - ฿2,000", "฿2,000 - ฿3,500", "฿3,500 +"],
  },
  {
    title: "Property type",
    items: ["Hotels", "Apartments", "Resorts", "Hostels", "Villas"],
  },
  {
    title: "Rating",
    items: ["9+ Fantastic", "8+ Great", "7+ Good", "Any"],
  },
  {
    title: "Popular filters",
    items: ["Free Wi‑Fi", "Breakfast", "Pool", "Parking", "Pet friendly"],
  },
];

export function FiltersSidebar() {
  return (
    <aside className="hidden w-[280px] shrink-0 lg:block">
      <div className="sticky top-24 rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
              Filter
            </p>
            <h3 className="text-xl font-bold text-slate-900">Stay Finder</h3>
          </div>
          <button
            type="button"
            className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Clear
          </button>
        </div>

        <div className="space-y-5">
          {filterSections.map((section) => (
            <div
              key={section.title}
              className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0"
            >
              <h4 className="mb-3 text-sm font-bold text-slate-900">
                {section.title}
              </h4>
              <div className="space-y-2.5">
                {section.items.map((item) => (
                  <label
                    key={item}
                    className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-sky-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-700">
            Smart pick
          </p>
          <p className="mt-1 text-sm font-medium text-slate-800">
            145 stays match your trip budget.
          </p>
        </div>
      </div>
    </aside>
  );
}
