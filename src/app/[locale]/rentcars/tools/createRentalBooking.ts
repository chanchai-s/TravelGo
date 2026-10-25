import { VEHICLES, RENTAL_RULES } from "../resources/data.js";
import { RentalBooking, BookingStatus } from "../types/booking.js";

const ADDON_RATES: Record<string, number> = {
  CHILD_SEAT: 150,
  GPS: 100,
  ADDITIONAL_DRIVER: 150,
  WIFI: 150,
  ROADSIDE_ASSISTANCE: 100,
};

const BOOKINGS: RentalBooking[] = [];

export interface CreateRentalBookingArgs {
  vehicleId: string;
  pickupAt: string;
  dropoffAt: string;
  pickupLocation: string;
  dropoffLocation: string;
  driverInfo?: {
    name: string;
    licenseNumber: string;
    phone: string;
    email?: string;
    dateOfBirth?: string;
  };
  insuranceType?: "BASIC" | "FULL" | "PREMIUM" | "NONE";
  fuelPolicy?: "FULL_TO_FULL" | "PREPAID" | "SAME_TO_SAME";
  addOns?: string[];
  notes?: string;
}

/** เธชเธฃเนเธฒเธเธเธฒเธฃเธเธญเธเน€เธเนเธฒเธฃเธ– เธเธฃเนเธญเธกเธเธณเธเธงเธ“เธฃเธฒเธเธฒเน€เธเธฃเธเธ”เธฒเธงเธเน */
export async function createRentalBooking(args: CreateRentalBookingArgs) {
  const vehicle = VEHICLES.find((v) => v.id === args.vehicleId);
  if (!vehicle) {
    return {
      content: [{ type: "text" as const, text: JSON.stringify({ error: "Vehicle not found" }) }],
      isError: true,
    };
  }

  const start = new Date(args.pickupAt);
  const end = new Date(args.dropoffAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return {
      content: [{ type: "text" as const, text: JSON.stringify({ error: "เธงเธฑเธเธ—เธตเนเน€เธเนเธฒเนเธกเนเธ–เธนเธเธ•เนเธญเธ" }) }],
      isError: true,
    };
  }
  const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000));

  const rules = RENTAL_RULES[vehicle.category] ?? RENTAL_RULES.SEDAN;
  const dailyRate = vehicle.dailyRate ?? vehicle.baseRate;
  const basePrice = dailyRate * days;

  const insuranceType = args.insuranceType ?? "FULL";
  const insurance = rules.insuranceOptions.find((o) => o.type === insuranceType);
  const insuranceFee = insurance ? insurance.dailyRate * days : 0;

  const fuelPolicy = args.fuelPolicy ?? "FULL_TO_FULL";
  const fuel = rules.fuelPolicies.find((f) => f.type === fuelPolicy);
  const fuelFee = fuel?.fee ?? 0;

  const addOns = args.addOns ?? [];
  const additionalDriverFee = addOns.includes("ADDITIONAL_DRIVER")
    ? (rules.additionalDriverPolicy.feePerDay ?? 0) * days
    : 0;
  const addOnFee = addOns
    .filter((a) => a !== "ADDITIONAL_DRIVER")
    .reduce((sum, a) => sum + (ADDON_RATES[a] ?? 0) * days, 0);

  const dob = args.driverInfo?.dateOfBirth ? new Date(args.driverInfo.dateOfBirth) : null;
  const age = dob ? Math.floor((Date.now() - dob.getTime()) / 31557600000) : 99;
  const youngDriverFee =
    dob && age < rules.youngDriverPolicy.youngDriverAgeThreshold
      ? (rules.youngDriverPolicy.youngDriverFeePerDay ?? 0) * days
      : 0;

  const totalPrice = basePrice + insuranceFee + fuelFee + addOnFee + additionalDriverFee + youngDriverFee;

  const booking: RentalBooking = {
    id: `bk-${Date.now()}`,
    ref: `BK${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    userId: "current-user",
    vehicleId: vehicle.id,
    vehicle: {
      id: vehicle.id,
      title: vehicle.title,
      category: vehicle.category,
      images: vehicle.images.map((i) => i.url),
      fleetPartner: vehicle.fleetPartner
        ? {
            id: vehicle.fleetPartner.id,
            name: vehicle.fleetPartner.name,
            logoUrl: vehicle.fleetPartner.logoUrl,
          }
        : undefined,
    },
    startDate: args.pickupAt,
    endDate: args.dropoffAt,
    pickupLocation: args.pickupLocation,
    dropoffLocation: args.dropoffLocation,
    isChauffeur: false,
    insuranceType,
    fuelPolicy,
    addOns,
    totalPrice,
    securityDeposit: rules.depositAmount,
    priceBreakdown: {
      basePrice,
      insuranceFee,
      fuelFee,
      youngDriverFee,
      additionalDriverFee: addOnFee + additionalDriverFee,
      discountAmount: 0,
      taxAmount: 0,
      totalPrice,
      currency: "THB",
    },
    status: BookingStatus.PENDING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  BOOKINGS.push(booking);

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(
          {
            success: true,
            message: "เธชเธฃเนเธฒเธเธเธฒเธฃเธเธญเธเธชเธณเน€เธฃเนเธ",
            data: booking,
            notes: args.notes ?? null,
          },
          null,
          2,
        ),
      },
    ],
  };
}
