import { VEHICLES } from "../resources/data";
import { Vehicle, VehicleSearchParams, VehicleSearchResult } from "../types/vehicle";

export async function searchVehicles(args: VehicleSearchParams) {
  const {
    destination,
    country,
    checkIn,
    checkOut,
    adults,
    children,
    rooms,
    tab,
    minPrice,
    maxPrice,
    stars,
    propertyType,
    amenity,
    sort,
    page,
    size,
  } = args;

  let filtered = [...VEHICLES];

  // Filter by destination
  if (args.destination) {
    filtered = filtered.filter((v) =>
      v.location.toLowerCase().includes(args.destination!.toLowerCase()) ||
      v.country.toLowerCase().includes(args.destination!.toLowerCase()),
    );
  }

  // Filter by min/max price
  if (args.priceMin != null) {
    filtered = filtered.filter((v) => v.price >= args.priceMin!);
  }
  if (args.priceMax != null) {
    filtered = filtered.filter((v) => v.price <= args.priceMax!);
  }

  // Filter by stars
  if (args.stars) {
    filtered = filtered.filter((v) => (v as any).stars === args.stars);
  }

  // Filter by propertyType
  if (args.propertyType) {
    filtered = filtered.filter((v) => v.propertyType === args.propertyType);
  }

  // Filter by amenity
  if (args.amenity) {
    filtered = filtered.filter((v) => {
      const amenities = v.amenities as any;
      return (
        amenities.generalAmenities?.includes(args.amenity!) ||
        amenities.roomAmenities?.includes(args.amenity) ||
        amenities.diningServices?.includes(args.amenity)
      );
    });
  }

  // Sort
  if (args.sort === "price_asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (args.sort === "price_desc") {
    filtered = filtered.sort((a, b) => b.price - a.price);
  } else if (args.sort === "rating") {
    filtered = filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }

  // Pagination
  const page = args.page ?? 1;
  const size = args.size ?? 20;
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const paginated = filtered.slice((page - 1) * limit, start + limit);

  return {
    hotels: paginated,
    total,
    page,
    size,
    totalPages,
  };
}
