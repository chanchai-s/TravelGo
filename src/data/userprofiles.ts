export type RoleId = "traveler" | "host" | "driver";

export type Role = {
  id: RoleId;
  label: string;
  icon: string;
};

export type RolePerks = {
  badgeTitle: string;
  badgeDesc: string;
  docTitle: string;
  docDesc: string;
};

// Mock data (no backend, no auth — UI only)
export const BRAND = {
  passLabel: "Super-App Pass 2.0",
  title: "Join WanderGo",
  subtitle: "One account to travel, host, or drive across Thailand & Asia",
};

export const ROLES: Role[] = [
  { id: "traveler", label: "Traveler", icon: "flight_takeoff" },
  { id: "host", label: "Host", icon: "apartment" },
  { id: "driver", label: "Driver", icon: "directions_car" },
];

export const ROLE_PERKS: Record<RoleId, RolePerks> = {
  traveler: {
    badgeTitle: "Traveler Privileges",
    badgeDesc: "Instant booking & 5% cashback in Bangkok & Phuket",
    docTitle: "Partner Document Verification",
    docDesc: "Upload your National ID or Transport Permit for rapid 2-hour onboarding approval.",
  },
  host: {
    badgeTitle: "SuperHost Fast-Track",
    badgeDesc: "0% commission for first 60 days on listing villas & rooms",
    docTitle: "Property Deed or Business Reg.",
    docDesc: "Submit your Chanote title deed, house permit, or hotel license.",
  },
  driver: {
    badgeTitle: "Fleet & Ride Partner",
    badgeDesc: "Guaranteed 90% fare retention + electric vehicle charging perk",
    docTitle: "Driving License & Vehicle Reg.",
    docDesc: "Submit valid Thai/International Driving License and Vehicle Book (Blue/Green).",
  },
};

export const FORM_TEXT = {
  nameLabel: "Full Legal Name",
  nameHint: "As on passport / ID",
  namePlaceholder: "e.g. Somchai Prasert",
  emailLabel: "Email Address",
  emailPlaceholder: "somchai@wandergo.asia",
  phoneLabel: "Mobile Number",
  phonePlaceholder: "81 234 5678",
  passwordLabel: "Password",
  passwordHint: "Min. 8 characters",
  docRequired: "Required",
  docEmpty: "Tap to select or take photo",
  docFormats: "PDF, PNG, or JPG (max. 10MB)",
  submitLabel: "Create Account",
  verifyingLabel: "Verifying...",
  welcomeLabel: "Welcome aboard!",
  divider: "or continue with",
  signinPrompt: "Already have an account?",
  signinCta: "Log In",
};
