export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  OWNER = "OWNER",
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

export interface DriverProfile {
  id: string;
  userId: string;
  user?: User;
  status: DriverStatus;
  verifiedAt?: string;
  rejectedReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSession {
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
