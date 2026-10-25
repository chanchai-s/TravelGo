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

export const apiGoogleLogin = (data: Record<string, unknown>) =>
  mainApi.post("/google/create", data);

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
