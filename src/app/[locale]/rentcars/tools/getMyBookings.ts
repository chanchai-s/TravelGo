import { BookingStatus, RentalBooking } from "../types/booking.js";

const SAMPLE: RentalBooking[] = [
  {
    id: "bk-001",
    ref: "BK-A1B2C3",
    userId: "current-user",
    vehicleId: "veh-001",
    vehicle: {
      id: "veh-001",
      title: "Toyota Yaris Cross",
      category: "COMPACT_SUV",
      images: [
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80",
      ],
      fleetPartner: { id: "fp-001", name: "AVIS", logoUrl: "https://example.com/avis-logo.png" },
    },
    startDate: "2026-11-15T10:00:00Z",
    endDate: "2026-11-18T10:00:00Z",
    pickupLocation: "Chiang Mai Intl Airport (CNX)",
    dropoffLocation: "Chiang Mai Intl Airport (CNX)",
    isChauffeur: false,
    insuranceType: "FULL",
    fuelPolicy: "FULL_TO_FULL",
    addOns: [],
    totalPrice: 4500,
    securityDeposit: 5000,
    priceBreakdown: {
      basePrice: 3450,
      insuranceFee: 1050,
      fuelFee: 0,
      youngDriverFee: 0,
      additionalDriverFee: 0,
      discountAmount: 0,
      taxAmount: 0,
      totalPrice: 4500,
      currency: "THB",
    },
    status: BookingStatus.PENDING,
    createdAt: "2026-10-15T10:00:00Z",
    updatedAt: "2026-10-15T10:00:00Z",
  },
];

export interface GetMyBookingsArgs {
  userId: string;
  status?: BookingStatus;
  page?: number;
  limit?: number;
}

/** เธ”เธนเธฃเธฒเธขเธเธฒเธฃเธเธญเธเน€เธเนเธฒเธฃเธ–เธเธญเธเธเธนเนเนเธเน */
export async function getMyBookings(args: GetMyBookingsArgs) {
  const page = args.page ?? 1;
  const limit = args.limit ?? 20;

  let items = SAMPLE;
  if (args.status) items = items.filter((b) => b.status === args.status);

  const start = (page - 1) * limit;

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(
          {
            bookings: items.slice(start, start + limit),
            total: items.length,
            page,
            limit,
            totalPages: Math.ceil(items.length / limit),
          },
          null,
          2,
        ),
      },
    ],
  };
}
