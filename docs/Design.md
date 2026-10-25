---
name: Wanderlust Neo
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#424656'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#727687'
  outline-variant: '#c2c6d8'
  surface-tint: '#0054d6'
  primary: '#0050cb'
  on-primary: '#ffffff'
  primary-container: '#0066ff'
  on-primary-container: '#f8f7ff'
  inverse-primary: '#b3c5ff'
  secondary: '#b02f00'
  on-secondary: '#ffffff'
  secondary-container: '#ff5722'
  on-secondary-container: '#541100'
  tertiary: '#51596f'
  on-tertiary: '#ffffff'
  tertiary-container: '#697188'
  on-tertiary-container: '#f7f7ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae1ff'
  primary-fixed-dim: '#b3c5ff'
  on-primary-fixed: '#001849'
  on-primary-fixed-variant: '#003fa4'
  secondary-fixed: '#ffdbd1'
  secondary-fixed-dim: '#ffb5a0'
  on-secondary-fixed: '#3b0900'
  on-secondary-fixed-variant: '#862200'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '800'
    lineHeight: 38px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes a high-energy, confident, and intuitive visual language tailored for an all-in-one travel super app. It combines the utility and structure of top-tier mobile operating systems with the optimism, wanderlust, and clarity essential to global travel discovery.

The design movement is **Modern App Utility with Tactile Warmth**:
- **Clarity & Air:** Crisp white canvases and subtle slate surfaces allow rich destination photography and content modules to breathe.
- **Dynamic Direction:** Electric blue commands structure, trust, and navigational confidence, while vivid coral injects energy, urgency, and decisive action into critical booking funnels.
- **Ergonomic Precision:** Tailored for thumb-reach ergonomics, high-density glanceable data (flight matrices, hotel specs, currency conversions), and seamless cross-platform consistency across iOS, Android, and mobile web.

## Colors

The palette is tuned for high-contrast usability in bright outdoor conditions, clean hierarchy, and intentional focus on conversion.

- **Primary (`#0066FF` - Electric Ocean Blue):** Represents clarity, velocity, and institutional trust. Used for brand touchpoints, active tab states, selection controls, links, badges, and secondary action highlights.
- **Secondary (`#FF5722` - Vibrant Coral Orange):** The primary conversion driver. Reserved strictly for key action points: "Search", "Book Now", "Reserve", "Pay Now", and urgent booking notifications. It must never compete with utility icons or informational alerts.
- **Tertiary / Base Dark (`#0F172A` - Dark Slate):** Used for primary typography, dominant icons, and top-tier headings. Ensures deep, legible contrast without the stark harshness of pure black.
- **Neutral Light (`#F8FAFC` - Light Slate Grey):** The foundational backdrop for screen surfaces, nested card groupings, and inset segments. 
- **Borders & Dividers (`#E2E8F0`):** Hairline delineations that provide structural containment against white cards.
- **Secondary Typography (`#64748B` - Slate Muted):** Used for microcopy, labels, timestamps, airport IATA codes, and non-active icons.

## Typography

The design system utilizes **Plus Jakarta Sans** across all roles to ensure geometric balance, open counter spaces, and exceptional legibility at rapid glances.

- **Headlines:** Set with dense negative letter spacing and heavy weights (700/800) to project destination authority and editorial weight against full-bleed imagery.
- **Body:** Calibrated line-heights prevent eye fatigue in dense itinerary reviews, cancellation policies, and fare breakdowns.
- **Labels & Numbers:** Bold, slightly tracked micro-tokens ensure crucial trip metrics—such as terminal numbers, gate times, currency amounts, and flight durations—are instantly recognizable.

## Layout & Spacing

A strictly enforced 4px/8px base spacing grid maintains rhythmic alignment across dense screens.

- **Mobile (Default):** Fluid 4-column layout with `1rem` (16px) margins and `1rem` gutters. Maximizes horizontal space while preserving thumb-accessible tap targets (minimum 44x44pt).
- **Tablet:** 8-column layout with `1.5rem` (24px) gutters and margins, facilitating side-by-side search results and map split-views.
- **Desktop / Web Application:** 12-column layout maxing out at a 1280px container, flanked by centered fluid gutters.
- **Vertical Rhythm:**
  - Card internal padding: `space-md` (16px).
  - Stack gaps between unrelated visual sections: `space-xl` (32px).
  - Tightly coupled input fields and itinerary rows: `space-sm` (8px).

## Elevation & Depth

Visual hierarchy uses a refined hybrid approach: crisp, low-contrast borders combined with ultra-diffused, ambient drop shadows.

- **Level 0 (Flat Canvas):** `#F8FAFC` base application background. No shadow.
- **Level 1 (Card & Content Container):** Pure `#FFFFFF` surface bounded by a crisp 1px border (`#E2E8F0`) and an ambient shadow: `0px 2px 8px rgba(15, 23, 42, 0.04)`.
- **Level 2 (Floating Action Bars & Pinned Search Widgets):** `#FFFFFF` surface with `0px 8px 24px rgba(15, 23, 42, 0.08)` and border `#E2E8F0`.
- **Level 3 (Modal Bottom Sheets, Sticky CTA Bars, Date Pickers):** `0px 16px 40px rgba(15, 23, 42, 0.14)`.
- **Badge Elevation:** Floating pill tags over photography utilize a frosted background (`rgba(15, 23, 42, 0.60)` with `backdrop-filter: blur(12px)`) or solid `#FFFFFF` with `0px 2px 6px rgba(0, 0, 0, 0.12)`.

## Shapes

The shape system implements specific geometric tiers tuned to native mobile ergonomics:

- **Cards & Primary Modules:** 16px radius (`1rem`) creates friendly, structured surfaces for booking items, hotel showcases, and itinerary blocks.
- **Buttons & Action Controls:** 12px radius (`0.75rem`) balances tap affordance with sharp definition.
- **Interactive Badges, Category Chips & Status Pills:** Full-pill radius (`9999px`) provides clear physical contrast against structural cards.
- **Inner Nested Media:** 12px radius when placed inside standard 16px cards, maintaining concentric visual margins.

## Components

### Buttons
- **High-Impact CTA (Primary Conversion):** Solid Vibrant Coral (`#FF5722`), white text (`#FFFFFF`), `12px` border radius, `headline-sm` / `label-lg` font weight. Height: 52px on mobile for effortless tapping. Applied strictly to: "Book Now", "Search Flights/Hotels", "Pay".
- **Primary Brand Button:** Solid Electric Ocean Blue (`#0066FF`), white text, 48px height, 12px radius. Used for standard interactions (e.g., "Apply Filters", "View Details").
- **Secondary / Ghost Button:** Light Slate background (`#F8FAFC`), `#0066FF` or `#0F172A` text, 1px border (`#E2E8F0`).
- **Floating Bottom Action Bar:** Mobile checkout bar pinned to the bottom screen safe area, elevated with Level 3 shadow, housing price breakout and a 52px Coral CTA button.

### Cards
- **Trip & Listing Cards:** Pure white background (`#FFFFFF`), 16px border-radius, 1px `#E2E8F0` border, Level 1 shadow. Image containers span edge-to-edge at the top with a 16px top corner radius, featuring floating pill tags for ratings and wishlists.
- **Nested Itinerary Segment Cards:** Nested within main trip views on `#F8FAFC` backgrounds with 12px radius, no shadow, and dashed or hairline dividers connecting flight legs.

### Chips & Badges
- **Pill Badges (Overlays & Status):** Fully pill-shaped (`9999px`), 28px height, 10px horizontal padding, `label-sm` bold font.
- **Category Filter Chips:** 36px height, rounded-full. Inactive: `#FFFFFF` fill with 1px `#E2E8F0` border and `#0F172A` text. Active: `#0066FF` fill with white text and no border.

### Input Fields & Search Bars
- **Super App Multi-Segment Search Box:** Integrated container featuring segmented fields for Location, Dates, and Guests. Active fields shift background to pure `#FFFFFF` with a 2px `#0066FF` outline.
- **Standard Inputs:** 48px height, 12px border radius, `#F8FAFC` fill, `#E2E8F0` border. Text in `#0F172A`, placeholder in `#64748B`. Focus state transitions to `#FFFFFF` with `#0066FF` border.

### Lists & Tables
- **Flight & Transport Matrices:** Clean horizontal divider rows with subtle `#F8FAFC` zebra striping on touch/press. Time and airport codes set in `headline-sm`, stops and durations in `body-sm` muted text.
- **Selection Rows (Radio & Checkbox):** 20px controls with `#0066FF` fill and pure white tick/circle indicators when checked.