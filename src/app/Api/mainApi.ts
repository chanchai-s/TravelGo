import axios, { type AxiosRequestConfig } from "axios";

export type SearchHotelParams = {
  destination?: string;
  country?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  rooms?: number;
  tab?: string;
  // ตัวกรองเพิ่มเติมของที่พักเรา
  minPrice?: number;
  maxPrice?: number;
  stars?: number;
  propertyType?: string;
  amenity?: string;
  sort?: string;
  page?: number;
  size?: number;
};

export type HotelSearchItem = {
  id: string;
  name: string;
  location: string;
  country: string;
  price: number;
  rating?: number;
  image?: string;
};

export const mainApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

mainApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("travel_token");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export const apiGetProfile = (config?: AxiosRequestConfig) =>
  mainApi.get("/auth/me", config);

export const apiUpdateProfile = (
  payload: Record<string, unknown>,
  config?: AxiosRequestConfig,
) => mainApi.put("/auth/me", payload, config);

// ---------- Social login (Google / Facebook / Apple / LINE) ----------

export type SocialProvider = "GOOGLE" | "FACEBOOK" | "APPLE" | "LINE";

export type SocialLoginPayload = {
  provider: SocialProvider;
  /** Google / Facebook ส่ง access token มาให้ตรวจกับ API ของเจ้านั้น */
  accessToken?: string;
  /** Apple ส่ง id_token (JWT ที่ Apple ลงนาม) */
  idToken?: string;
  /** LINE / Google (auth-code) ส่ง code มาแลก token ที่ฝั่งเซิร์ฟเวอร์ */
  code?: string;
  redirectUri?: string;
  state?: string;
};

export const apiSocialLogin = (data: SocialLoginPayload) =>
  mainApi.post("/auth/social", data);

export const apiSearchHotels = (params: SearchHotelParams) =>
  mainApi.post("/rabit/search", params);

export const apiSearchDestinations = (query: string) =>
  mainApi.get("/rabit/destinations", {
    params: { query },
  });

export const apiSearchStays = (params: StaySearchParams) =>
  mainApi.get("/stays/search", { params });

export const apiGetHotelById = (id: string) =>
  mainApi.get(`/api/hotels/${id}`);

export const apiOnboardProperty = (
  propertyId: string,
  data: Record<string, unknown>,
) => mainApi.post(`/host/onboard/${propertyId}`, data);

export const apiGetProperty = (propertyId: string) =>
  mainApi.get(`/host/${propertyId}`);

export const apiResubmitProperty = (propertyId: string) =>
  mainApi.post(`/host/${propertyId}/resubmit`);

// ---------- สมัครเป็นพันธมิตร (เจ้าของที่พัก) ----------

export const apiHostApply = (data: Record<string, unknown>) =>
  mainApi.post("/host/apply", data);

export const apiHostAddDocument = (data: {
  docType: string;
  fileUrl: string;
}) => mainApi.post("/host/documents", data);

export const apiHostMe = () => mainApi.get("/host/me");

// ---------- อัปโหลดไฟล์ ----------

async function uploadFile(path: string, file: File) {
  const form = new FormData();
  form.append("file", file);
  return mainApi.post(path, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export const apiUploadImage = (file: File) => uploadFile("/upload/image", file);
export const apiUploadDoc = (file: File) => uploadFile("/upload/doc", file);

// ---------- แอดมิน ----------

export type PageParams = { status?: string; page?: number; size?: number };

export const apiAdminStays = (params: PageParams) =>
  mainApi.get("/admin/stays", { params });

export const apiAdminStay = (id: string) => mainApi.get(`/admin/stays/${id}`);

export const apiAdminApproveStay = (id: string) =>
  mainApi.post(`/admin/stays/${id}/approve`);

export const apiAdminRejectStay = (id: string, reason: string) =>
  mainApi.post(`/admin/stays/${id}/reject`, { reason });

export const apiAdminHosts = (params: PageParams) =>
  mainApi.get("/admin/hosts", { params });

export const apiAdminVerifyHost = (id: string) =>
  mainApi.post(`/admin/hosts/${id}/verify`);

export const apiAdminRejectHost = (id: string, reason: string) =>
  mainApi.post(`/admin/hosts/${id}/reject`, { reason });

export const apiAdminLogs = (params: { page?: number; size?: number }) =>
  mainApi.get("/admin/logs", { params });

// ---------- จ่ายเงินให้เจ้าของ ----------

export const apiPayoutBalance = () => mainApi.get("/host/payouts/balance");

export const apiMyPayouts = () => mainApi.get("/host/payouts");

export const apiRequestPayout = () => mainApi.post("/host/payouts/request");

export const apiStripeOnboarding = () => mainApi.post("/host/payouts/stripe-onboarding");

export const apiAdminPayouts = (status: string) =>
  mainApi.get("/admin/payouts", { params: { status } });

export const apiAdminSendPayout = (id: string) =>
  mainApi.post(`/admin/payouts/${id}/send`);

export const apiAdminRejectPayoutRequest = (id: string, reason: string) =>
  mainApi.post(`/admin/payouts/${id}/reject`, { reason });

export const apiAdminSaveStripeAccount = (hostId: string, stripeAccountId: string) =>
  mainApi.post(`/admin/hosts/${hostId}/stripe-account`, { stripeAccountId });

export const apiAdminApproveAll = () => mainApi.post("/admin/stays/approve-all");

export const apiAdminVerifyPayout = (hostId: string) =>
  mainApi.post(`/admin/hosts/${hostId}/payout/verify`);

export const apiAdminRejectPayout = (hostId: string, reason: string) =>
  mainApi.post(`/admin/hosts/${hostId}/payout/reject`, { reason });

// ---------- ประกาศของฉัน ----------

export const apiMyListings = () => mainApi.get("/host/listings");

// ---------- บัญชีรับเงิน + สัญญา ----------

export const apiSavePayout = (data: {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
}) => mainApi.post("/host/payout", data);

export const apiGetPayout = () => mainApi.get("/host/payout");

export const apiAcceptContract = (version: string) =>
  mainApi.post("/host/contract", { version });

// ---------- การจอง + รีวิว ----------

export const apiMyBookings = () => mainApi.get("/bookings/me");

export const apiCreateBooking = (data: {
  stayId: string;
  roomTypeId: string;
  checkIn: string;
  checkOut: string;
  rooms?: number;
  guests?: number;
  voucherCode?: string;
}) => mainApi.post("/bookings", data);

// ปิดขายรายวัน (เจ้าของ)
export const apiListStopSell = (propertyId: string) =>
  mainApi.get(`/host/${propertyId}/stop-sell`);

export const apiSetStopSell = (propertyId: string, items: { roomTypeId: string; dates: string[] }[]) =>
  mainApi.post(`/host/${propertyId}/stop-sell`, { items });

export const apiCancelBooking = (id: string) => mainApi.post(`/bookings/${id}/cancel`);

export const apiChangeBookingDates = (id: string, checkIn: string, checkOut: string) =>
  mainApi.patch(`/bookings/${id}`, { checkIn, checkOut });

export const apiStayAvailability = (id: string, checkIn?: string, checkOut?: string) =>
  mainApi.get(`/bookings/stays/${id}/availability`, {
    params: { checkIn, checkOut },
  });

export const apiStayCalendar = (id: string, days = 14, roomTypeId?: string) =>
  mainApi.get(`/bookings/stays/${id}/calendar`, { params: { days, roomTypeId } });

// ---------- แดชบอร์ดเจ้าของ ----------

export const apiHostDashboard = () => mainApi.get("/host/dashboard");

// ---------- ค้นหา/กรอง ----------

export type StaySearchParams = {
  destination?: string;
  minPrice?: number;
  maxPrice?: number;
  stars?: number;
  propertyType?: string;
  amenity?: string;
  checkIn?: string;
  checkOut?: string;
  sort?: string;
  page?: number;
  size?: number;
};

export const apiSearchStaysFiltered = (params: StaySearchParams) =>
  mainApi.get("/stays/search", { params });

export const apiStayReviews = (stayId: string) =>
  mainApi.get(`/bookings/stays/${stayId}/reviews`);

export const apiCreateReview = (stayId: string, rating: number, text: string) =>
  mainApi.post(`/bookings/stays/${stayId}/reviews`, { rating, text });

export const apiGetMediaFeed = () => mainApi.get("/media/feed");
export const apiListActivities = () => mainApi.get("/activities");
export const apiAdminCreateActivity = (data: Record<string, unknown>) => mainApi.post("/admin/activities", data);
export const apiAdminDeleteActivity = (id: string) => mainApi.delete(`/admin/activities/${id}`);
export const apiAdminApproveActivity = (id: string) => mainApi.post(`/admin/activities/${id}/approve`);
export const apiAdminRejectActivity = (id: string, reason?: string) => mainApi.post(`/admin/activities/${id}/reject`, { reason });
export const apiHostSubmitActivity = (data: Record<string, unknown>) => mainApi.post("/host/activities", data);
export const apiHostListActivities = () => mainApi.get("/host/activities");
export const apiGetActivity = (id: string) => mainApi.get(`/activities/${id}`);
export const apiBookActivity = (id: string, data: { persons: number; date?: string }) => mainApi.post(`/activities/${id}/book`, data);
export const apiListMyVouchers = () => mainApi.get("/vouchers/me");
export const apiAdminListVouchers = () => mainApi.get("/admin/vouchers");
export const apiAdminCreateVoucher = (data: Record<string, unknown>) => mainApi.post("/admin/vouchers", data);
export const apiAdminDeleteVoucher = (id: string) => mainApi.delete(`/admin/vouchers/${id}`);
export const apiAdminApproveVoucher = (id: string) => mainApi.post(`/admin/vouchers/${id}/approve`);
export const apiAdminRejectVoucher = (id: string, reason: string) => mainApi.post(`/admin/vouchers/${id}/reject`, { reason });
export const apiHostCreateVoucher = (data: Record<string, unknown>) => mainApi.post("/host/vouchers", data);
export const apiHostListVouchers = () => mainApi.get("/host/vouchers");
export const apiValidateVoucher = (code: string, stayId?: string, amount?: number) => mainApi.post("/vouchers/validate", { code, stayId, amount });
export const apiClaimVoucher = (code: string) => mainApi.post("/vouchers/claim", { code });
export const apiListUserPosts = (page = 1, size = 20) => mainApi.get(`/posts?page=${page}&size=${size}`);
export const apiCreateUserPost = (data: { url: string; type?: string; caption?: string; stayId?: string }) => mainApi.post("/posts", data);
export const apiToggleUserPostLike = (id: string) => mainApi.post(`/posts/${id}/like`);
export const apiUploadMedia = (file: File) => {
  const form = new FormData();
  form.append("file", file);
  return mainApi.post("/media/upload", form, { headers: { "Content-Type": "multipart/form-data" } });
};
export const apiToggleMediaLike = (id: string) => mainApi.post(`/media/${id}/like`);
export const apiGetMediaComments = (id: string) => mainApi.get(`/media/${id}/comments`);
export const apiAddMediaComment = (id: string, text: string) => mainApi.post(`/media/${id}/comments`, { text });

// ---------- รถเช่า (RentCars) ----------

export type VehicleSearchApiParams = {
  q?: string;
  category?: string;
  branchId?: string;
  pickupAt?: string;
  dropoffAt?: string;
  transmission?: string;
  minSeats?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
};

export type CreateRentalBookingInput = {
  vehicleId: string;
  pickupAt: string;
  dropoffAt: string;
  driverName?: string;
  driverPhone?: string;
  driverLicenseNo?: string;
  notes?: string;
};

export const apiListVehicleCategories = () => mainApi.get("/vehicle-categories");

export const apiSearchVehicles = (params: VehicleSearchApiParams) =>
  mainApi.get("/vehicles", { params });

export const apiGetVehicle = (id: string) => mainApi.get(`/vehicles/${id}`);

export const apiCheckVehicleAvailability = (
  id: string,
  pickupAt: string,
  dropoffAt: string,
) => mainApi.get(`/vehicles/${id}/availability`, { params: { pickupAt, dropoffAt } });

export const apiQuoteVehicle = (id: string, pickupAt: string, dropoffAt: string) =>
  mainApi.post(`/vehicles/${id}/quote`, { pickupAt, dropoffAt });

export const apiCreateRentalBooking = (data: CreateRentalBookingInput) =>
  mainApi.post("/bookings/rental", data);

export const apiCancelRentalBooking = (bookingId: string) =>
  mainApi.post(`/bookings/rental/${bookingId}/cancel`);

// ---------- Ride / Parcel / Logistics (โดเมนแยกจาก transport) ----------

export type RideServiceType = "RIDE" | "PARCEL" | "LOGISTICS";
export type RidePaymentTiming = "PREPAY" | "POSTPAY";
export type RidePaymentMethod = "CARD" | "PROMPTPAY" | "WALLET" | "CASH" | "TRANSFER";

export type RideTier = {
  id: string;
  code: string;
  name: string;
  serviceType: RideServiceType;
  vehicleType: string;
  seats: number | null;
  maxWeightKg: number | null;
  maxDimCm: string | null;
  baseFare: number;
  perKm: number;
  perMin: number;
  minFare: number;
  flatFare: number | null;
  includedKm: number | null;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
};

export type RidePoint = { lat: number; lng: number; address: string };

export type RideQuote = {
  serviceType: RideServiceType;
  tier: {
    code: string;
    name: string;
    vehicleType: string;
    seats: number | null;
    maxWeightKg: number | null;
    maxDimCm: string | null;
    imageUrl: string | null;
    description: string | null;
  };
  pickup: RidePoint;
  dropoff: RidePoint;
  distanceKm: number;
  durationMin: number;
  passengerCount: number | null;
  parcel: { weightKg: number; sizeTier: "S" | "M" | "L" | "XL" } | null;
  addons: { type: string; name: string; amount: number; qty: number }[];
  breakdown: {
    baseFare: number;
    parcelSizeFee: number;
    parcelWeightFee: number;
    addonTotal: number;
    baseAmount: number;
    vatRate: number;
    vatAmount: number;
    totalFare: number;
  };
  commissionRate: number;
  commission: number;
  netToDriver: number;
  paymentOptions: { timing: RidePaymentTiming; method: RidePaymentMethod; label: string }[];
  policy: { fixedFare: string; zeroSurge: string };
};

export type RideJob = {
  id: string;
  ref: string;
  serviceType: RideServiceType;
  tierCode: string;
  status: string;
  riderId: string;
  driverId: string | null;
  passengerCount: number | null;
  pickupLat: number;
  pickupLng: number;
  pickupAddress: string;
  dropoffLat: number;
  dropoffLng: number;
  dropoffAddress: string;
  distanceKm: number;
  durationMin: number;
  baseFare: number;
  addonTotal: number;
  vatAmount: number;
  fareEstimate: number;
  fareFinal: number | null;
  commissionRate: number | null;
  commission: number;
  netToDriver: number;
  paymentTiming: RidePaymentTiming;
  paymentMethod: RidePaymentMethod;
  paymentStatus: string;
  requestedAt: string;
  acceptedAt: string | null;
  arrivedAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  cancelBy: string | null;
  actions: string[];
  pickupDistanceKm?: number | null;
  tier: RideTier | { code: string; name: string };
  rider?: { id: string; name: string; phone: string | null } | null;
  driver?: { id: string; name: string; phone: string | null } | null;
  addons: { id: string; type: string; name: string; amount: number; qty: number }[];
  parcel?: {
    jobId: string;
    weightKg: number;
    sizeTier: string;
    isFragile: boolean;
    receiverName: string;
    receiverPhone: string;
    note: string | null;
    deliveryOtp: string | null;
    pickupOtp: string | null;
    proofPhotoUrl: string | null;
    codAmount: number;
  } | null;
  payments: { id: string; timing: string; method: string; status: string; amount: number }[];
  earning?: { gross: number; commission: number; net: number; status: string } | null;
  rating?: { stars: number; text: string | null } | null;
  sosEvents?: { id: string; status: string }[];
  tracking?: { lat: number; lng: number; recordedAt: string } | null;
  vehicle?: { brand: string | null; model: string | null; plateNo: string | null; color: string | null } | null;
};

export type SavedAddress = {
  id: string;
  label: string;
  address: string;
  lat: number;
  lng: number;
  isDefault: boolean;
};

export const apiRideTiers = (serviceType?: RideServiceType) =>
  mainApi.get("/ride-tiers", { params: { serviceType } });

export const apiRideAddons = (serviceType?: RideServiceType) =>
  mainApi.get("/rides/addons", { params: { serviceType } });

export const apiRideQuote = (data: Record<string, unknown>) =>
  mainApi.post("/rides/quote", data);

export const apiCreateRideJob = (data: Record<string, unknown>) =>
  mainApi.post("/rides/jobs", data);

export const apiMyRideJobs = (params: {
  status?: string;
  serviceType?: string;
  page?: number;
  size?: number;
}) => mainApi.get("/rides/jobs", { params });

export const apiRideJob = (id: string) => mainApi.get(`/rides/jobs/${id}`);

export const apiCancelRideJob = (id: string, reason?: string) =>
  mainApi.post(`/rides/jobs/${id}/cancel`, { reason });

export const apiPayRideJob = (id: string, data?: Record<string, unknown>) =>
  mainApi.post(`/rides/jobs/${id}/pay`, data ?? {});

export const apiRateRideJob = (id: string, stars: number, text?: string) =>
  mainApi.post(`/rides/jobs/${id}/rate`, { stars, text });

export const apiRideMessages = (jobId: string) =>
  mainApi.get(`/rides/jobs/${jobId}/messages`);

export const apiSendRideMessage = (jobId: string, text: string) =>
  mainApi.post(`/rides/jobs/${jobId}/messages`, { text });

export const apiSendRideSos = (jobId: string, data: { lat?: number; lng?: number; note?: string }) =>
  mainApi.post(`/rides/jobs/${jobId}/sos`, data);

export const apiRideSosList = (jobId: string) => mainApi.get(`/rides/jobs/${jobId}/sos`);

// ---------- ที่อยู่ที่บันทึกไว้ ----------

export const apiSavedAddresses = () => mainApi.get("/saved-addresses");
export const apiCreateSavedAddress = (data: Omit<SavedAddress, "id">) =>
  mainApi.post("/saved-addresses", data);
export const apiUpdateSavedAddress = (id: string, data: Partial<SavedAddress>) =>
  mainApi.patch(`/saved-addresses/${id}`, data);
export const apiDeleteSavedAddress = (id: string) => mainApi.delete(`/saved-addresses/${id}`);

// ---------- คนขับ ----------

export const apiDriverApply = (data: Record<string, unknown>) => mainApi.post("/driver/apply", data);
export const apiDriverMe = () => mainApi.get("/driver/me");
export const apiDriverDocuments = () => mainApi.get("/driver/documents");
export const apiDriverAddDocument = (data: { type: string; url: string }) =>
  mainApi.post("/driver/documents", data);
export const apiDriverVehicles = () => mainApi.get("/driver/vehicles");
export const apiDriverAddVehicle = (data: Record<string, unknown>) =>
  mainApi.post("/driver/vehicles", data);
export const apiDriverUpdateVehicle = (id: string, data: Record<string, unknown>) =>
  mainApi.patch(`/driver/vehicles/${id}`, data);
export const apiDriverDeleteVehicle = (id: string) => mainApi.delete(`/driver/vehicles/${id}`);
export const apiDriverSetOnline = (data: { isOnline: boolean; lat?: number; lng?: number }) =>
  mainApi.patch("/driver/status", data);
export const apiDriverUpdateLocation = (data: {
  lat: number;
  lng: number;
  jobId?: string;
  bearing?: number;
  speed?: number;
}) => mainApi.post("/driver/location", data);
export const apiDriverAvailableJobs = (serviceType?: string) =>
  mainApi.get("/driver/jobs/available", { params: { serviceType } });
export const apiDriverAcceptJob = (id: string) => mainApi.post(`/driver/jobs/${id}/accept`);
export const apiDriverArriveJob = (id: string) => mainApi.post(`/driver/jobs/${id}/arrive`);
export const apiDriverStartJob = (id: string) => mainApi.post(`/driver/jobs/${id}/start`);
export const apiDriverCompleteJob = (id: string, data?: Record<string, unknown>) =>
  mainApi.post(`/driver/jobs/${id}/complete`, data ?? {});
export const apiDriverConfirmDelivery = (id: string, data: Record<string, unknown>) =>
  mainApi.post(`/driver/jobs/${id}/confirm-delivery`, data);
export const apiDriverCollectPayment = (id: string, data?: Record<string, unknown>) =>
  mainApi.post(`/driver/jobs/${id}/collect-payment`, data ?? {});
export const apiDriverEarnings = (params?: { status?: string; size?: number }) =>
  mainApi.get("/driver/earnings", { params });

// ---------- แอดมิน (ride) ----------

export const apiAdminRideDrivers = (params: { status?: string; search?: string; page?: number; size?: number }) =>
  mainApi.get("/admin/drivers", { params });
export const apiAdminVerifyDriver = (id: string, commissionRate?: number) =>
  mainApi.post(`/admin/drivers/${id}/verify`, { commissionRate });
export const apiAdminRejectDriver = (id: string, reason: string) =>
  mainApi.post(`/admin/drivers/${id}/reject`, { reason });
export const apiAdminSetDriverCommission = (id: string, commissionRate: number) =>
  mainApi.post(`/admin/drivers/${id}/commission`, { commissionRate });
export const apiAdminReviewDriverDocument = (id: string, status: string, reviewNote?: string) =>
  mainApi.post(`/admin/documents/${id}/review`, { status, reviewNote });
export const apiAdminRides = (params: { status?: string; serviceType?: string; page?: number; size?: number }) =>
  mainApi.get("/admin/rides", { params });
export const apiAdminCancelRide = (id: string, reason: string) =>
  mainApi.post(`/admin/rides/${id}/cancel`, { reason });
export const apiAdminSosList = (status?: string) =>
  mainApi.get("/admin/rides/sos", { params: { status } });
export const apiAdminAckSos = (id: string) => mainApi.post(`/admin/rides/sos/${id}/ack`);
export const apiAdminCloseSos = (id: string) => mainApi.post(`/admin/rides/sos/${id}/close`);
export const apiAdminRideTiers = (serviceType?: string) =>
  mainApi.get("/admin/ride-tiers", { params: { serviceType } });
export const apiAdminUpdateRideTier = (code: string, data: Record<string, unknown>) =>
  mainApi.patch(`/admin/ride-tiers/${code}`, data);
