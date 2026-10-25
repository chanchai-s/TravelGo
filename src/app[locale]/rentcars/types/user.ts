export enum UserRole {
  CUSTOMER = "CUSTOMER",
  RIDER = "RIDER",
  OWNER = "OWNER",
  ADMIN = "ADMIN",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  PENDING_VERIFICATION = "PENDING_VERIFICATION",
  SUSPENDED = "SUSPENDED",
  DELETED = "DELETED",
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  avatarUrl?: string;
  tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface HostProfile {
  id: string;
  userId: string;
  user?: User;
  status: FleetOwnerStatus;
  verifiedAt?: string;
  rejectedReason?: string;
  createdAt: string;
  updatedAt: string;
  vehicleIds: string[];
  driverIds: string[];
}

export interface FleetOwnerProfile {
  id: string;
  userId: string;
  user?: User;
  companyName: string;
  companyTaxId: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  status: FleetOwnerStatus;
  verifiedAt?: string;
  rejectedReason?: string;
  commissionRate: number;
  stripeAccountId?: string;
  totalFleetSize: number;
  createdAt: string;
  updatedAt: string;
  vehicles: FleetOwnerVehicle[];
}

export interface FleetOwnerVehicle {
  id: string;
  fleetOwnerId: string;
  vehicleId: string;
  vehicle?: Vehicle;
  assignedAt: string;
}

export interface DriverProfile {
  id: string;
  userId: string;
  user?: User;
  status: DriverStatus;
  verifiedAt?: string;
  rejectedReason?: string;
  createdAt: string;
  updatedAt: string;
  vehicleIds: string[];
  currentVehicleId?: string;
}

export interface Session {
  id: string;
  userId: string;
  deviceInfo: string;
  ipAddress: string;
  lastActiveAt: string;
  createdAt: string;
  expiresAt: string;
}

export interface VerificationCode {
  id: string;
  userId: string;
  code: string;
  type: "EMAIL_VERIFY" | "PHONE_VERIFY" | "PASSWORD_RESET";
  expiresAt: string;
  usedAt?: string;
  createdAt: string;
}
