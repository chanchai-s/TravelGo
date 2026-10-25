import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { searchVehicles } from "./tools/searchVehicles.js";
import { getVehicleDetails } from "./tools/getVehicleDetails.js";
import { createRentalBooking } from "./tools/createRentalBooking.js";
import { getMyBookings } from "./tools/getMyBookings.js";
import { switchMode } from "./tools/switchMode.js";
import { filterVehicles } from "./tools/filterVehicles.js";

import { getVehicleCatalog } from "./resources/vehicleCatalog.js";
import { getVehicleDetail } from "./resources/vehicleDetails.js";
import { getRentalRules } from "./resources/rentalRules.js";
import { getFleetPartners } from "./resources/fleetPartners.js";
import { getInsuranceOptions } from "./resources/insuranceOptions.js";
import { getFuelPolicies } from "./resources/fuelPolicies.js";

import { searchVehiclesPrompt } from "./prompts/searchVehicles.js";
import { createBookingPrompt } from "./prompts/createBooking.js";
import { rentalGuidelinesPrompt } from "./prompts/rentalGuidelines.js";

const server = new Server(
  {
    name: "rentcars",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  }
);

// --- Tools ---
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search_vehicles",
        description:
          "Search vehicles with filters (location, dates, category, price, seats, transmission, fuel type)",
        inputSchema: {
          type: "object",
          properties: {
            pickupLocation: {
              type: "string",
              description: "Pickup location name or address",
            },
            dropoffLocation: {
              type: "string",
              description: "Dropoff location name or address",
            },
            pickupAt: {
              type: "string",
              format: "date-time",
              description: "Pickup date and time (ISO 8601)",
            },
            dropoffAt: {
              type: "string",
              format: "date-time",
              description: "Dropoff date and time (ISO 8601)",
            },
            category: {
              type: "string",
              enum: [
                "ECONOMY",
                "COMPACT_SUV",
                "SEDAN",
                "LUXURY_SEDAN",
                "VAN",
                "PICKUP_TRUCK",
              ],
              description: "Vehicle category filter",
            },
            priceMin: { type: "number", description: "Minimum price per day" },
            priceMax: { type: "number", description: "Maximum price per day" },
            features: {
              type: "array",
              items: { type: "string" },
              description: "Required features (e.g., GPS, Bluetooth, ChildSeat)",
            },
            seats: {
              type: "number",
              minimum: 1,
              maximum: 12,
              description: "Minimum number of seats",
            },
            transmission: {
              type: "string",
              enum: ["AUTO", "MANUAL"],
              description: "Transmission type",
            },
            fuelType: {
              type: "string",
              enum: ["PETROL", "DIESEL", "HYBRID", "EV"],
              description: "Fuel type",
            },
            page: { type: "integer", minimum: 1, default: 1 },
            limit: { type: "integer", minimum: 1, maximum: 50, default: 20 },
          },
          required: ["pickupAt", "dropoffAt"],
        },
      },
      {
        name: "get_vehicle_details",
        description: "Get detailed information about a specific vehicle",
        inputSchema: {
          type: "object",
          properties: {
            vehicleId: { type: "string", description: "Vehicle ID" },
          },
          required: ["vehicleId"],
        },
      },
      {
        name: "create_rental_booking",
        description: "Create a new rental booking",
        inputSchema: {
          type: "object",
          properties: {
            vehicleId: { type: "string", description: "Vehicle ID to book" },
            pickupAt: { type: "string", format: "date-time" },
            dropoffAt: { type: "string", format: "date-time" },
            pickupLocation: { type: "string" },
            dropoffLocation: { type: "string" },
            driverInfo: {
              type: "object",
              properties: {
                name: { type: "string" },
                licenseNumber: { type: "string" },
                phone: { type: "string" },
                email: { type: "string" },
              },
              required: ["name", "licenseNumber", "phone"],
            },
            insuranceType: {
              type: "string",
              enum: ["BASIC", "FULL", "PREMIUM", "NONE"],
              default: "FULL",
            },
            fuelPolicy: {
              type: "string",
              enum: ["FULL_TO_FULL", "PREPAID", "SAME_TO_SAME"],
              default: "FULL_TO_FULL",
            },
            addOns: {
              type: "array",
              items: {
                type: "string",
                enum: [
                  "CHILD_SEAT",
                  "GPS",
                  "ADDITIONAL_DRIVER",
                  "WIFI",
                  "ROADSIDE_ASSISTANCE",
                ],
              },
            },
            notes: { type: "string" },
          },
          required: ["vehicleId", "pickupAt", "dropoffAt", "pickupLocation", "dropoffLocation"],
        },
      },
      {
        name: "get_my_bookings",
        description: "Get current user's rental bookings",
        inputSchema: {
          type: "object",
          properties: {
            userId: { type: "string" },
            status: {
              type: "string",
              enum: ["PENDING", "ACCEPTED", "DRIVER_ARRIVED", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
            },
            page: { type: "integer", minimum: 1, default: 1 },
            limit: { type: "integer", minimum: 1, maximum: 50, default: 20 },
          },
          required: ["userId"],
        },
      },
      {
        name: "switch_mode",
        description: "Switch between Car Rental and Ride-Hailing mode",
        inputSchema: {
          type: "object",
          properties: {
            mode: { type: "string", enum: ["rental", "ride"] },
          },
          required: ["mode"],
        },
      },
      {
        name: "filter_vehicles",
        description: "Filter vehicles by category, price, features",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              enum: ["ECONOMY", "COMPACT_SUV", "SEDAN", "LUXURY_SEDAN", "VAN", "PICKUP_TRUCK"],
            },
            priceMin: { type: "number" },
            priceMax: { type: "number" },
            features: { type: "array", items: { type: "string" } },
            seats: { type: "integer", minimum: 1, maximum: 12 },
            transmission: { type: "string", enum: ["AUTO", "MANUAL"] },
            fuelType: { type: "string", enum: ["PETROL", "DIESEL", "HYBRID", "EV"] },
          },
        },
      },
      {
        name: "get_vehicle_details",
        description: "Get detailed information about a specific vehicle",
        inputSchema: {
          type: "object",
          properties: {
            vehicleId: { type: "string" },
          },
          required: ["vehicleId"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (req: Request) => {
  try {
    const userId = (request as any).user?.id || "anonymous";
    const method = request.params.name;
    const params = request.params.arguments ?? {};

    switch (request.params.name) {
      case "search_vehicles":
        return await searchVehicles(args);
      case "get_vehicle_details":
        return await getVehicleDetails(args as any);
      case "create_rental_booking":
        return await createRentalBooking(args as any);
      case "get_my_bookings":
        return await getMyBookings(args as any);
      case "switch_mode":
        return await switchMode(args as any);
      case "filter_vehicles":
        return await filterVehicles(args as any);
      default:
        return {
          success: false,
          message: `Unknown tool: ${name}`,
        } as any;
    }
  } catch (error: any) {
    return {
      content: [
        { type: "text", text: `Error: ${error.message || error}` },
      ],
      isError: true,
    };
  }
});

/* ------------------------------ Resources ---------------------------------- */

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: "vehicles://catalog",
      name: "Vehicle Catalog",
      description: "Complete vehicle catalog with all available vehicles",
      mimeType: "application/json",
    },
    {
      uri: "vehicles://{id}",
      name: "Vehicle Details",
      description: "Detailed information about a specific vehicle",
      mimeType: "application/json",
    },
    {
      uri: "rental-rules://{category}",
      name: "Rental Rules by Category",
      description: "Business rules per vehicle category (age requirements, insurance, fuel policy)",
      mimeType: "application/json",
    },
    {
      uri: "fleet-partners://list",
      name: "Fleet Partners",
      description: "List of fleet partners (AVIS, Hertz, Sixt, local operators)",
      mimeType: "application/json",
    },
    {
      uri: "rental-rules://insurance",
      name: "Insurance Options",
      description: "Insurance options and coverage details (BASIC, FULL, PREMIUM)",
      mimeType: "application/json",
    },
    {
      uri: "rental-rules://fuel-policy",
      name: "Fuel Policy Options",
      description: "Fuel policy options (FULL_TO_FULL, PREPAID, SAME_TO_SAME)",
      mimeType: "application/json",
    },
  ],
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  const wrap = (data: unknown) => ({
    contents: [{ uri, mimeType: "application/json", text: JSON.stringify(data, null, 2) }],
  });

  try {
    if (uri === "vehicles://catalog") {
      return wrap(await getVehicleCatalog());
    }
    if (uri.startsWith("vehicles://")) {
      const vehicleId = uri.replace("vehicles://", "");
      return wrap(await getVehicleDetail(vehicleId as string));
    }
    if (uri.startsWith("rental-rules://")) {
      return wrap(await getRentalRules(uri.replace("rental-rules://", "")));
    }
    if (uri === "fleet-partners://list") {
      return wrap(await getFleetPartners());
    }
    if (uri === "rental-rules://insurance") {
      return wrap(await getInsuranceOptions());
    }
    if (uri === "rental-rules://fuel-policy") {
      return wrap(await getFuelPolicies());
    }
    throw new Error(`Unknown resource: ${uri}`);
  } catch (error: any) {
    return {
      contents: [
        {
          uri,
          mimeType: "text/plain",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
});

/* ------------------------------- Prompts --------------------------------- */

server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "search_vehicles",
        description: "Search for vehicles using natural language",
        arguments: [
          {
            name: "query",
            description:
              "Natural language search query (e.g., 'SUV for 5 people in Chiang Mai next week')",
            required: true,
          },
        ],
      },
      {
        name: "create_booking",
        description: "Create a rental booking with a guided step-by-step flow",
        arguments: [
          { name: "vehicleId", description: "Vehicle ID to book", required: true },
          { name: "pickupAt", description: "Pickup date and time (ISO 8601)", required: true },
          { name: "dropoffAt", description: "Dropoff date and time (ISO 8601)", required: true },
        ],
      },
      {
        name: "rental_guidelines",
        description: "Get rental guidelines and policies for a specific topic",
        arguments: [
          {
            name: "topic",
            description:
              "Topic: insurance | fuel | cancellation | deposit | driver | crossborder | mileage",
            required: true,
          },
        ],
      },
    ],
  };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  switch (name) {
    case "search_vehicles":
      return {
        description: "Search vehicles with natural language",
        messages: [
          {
            role: "user",
            content: { type: "text", text: searchVehiclesPrompt(args?.query ?? "") },
          },
        ],
      };
    case "create_booking":
      return {
        description: "Create a rental booking with a guided step-by-step flow",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: createBookingPrompt(args as { vehicleId: string; pickupAt: string; dropoffAt: string }),
            },
          },
        ],
      };
    case "rental_guidelines":
      return {
        description: "Get rental guidelines and policies",
        messages: [
          {
            role: "user",
            content: { type: "text", text: rentalGuidelinesPrompt(args?.topic ?? "") },
          },
        ],
      };
    default:
      throw new Error(`Unknown prompt: ${name}`);
  }
});

/* --------------------------------- Start ---------------------------------- */

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("RentCars MCP Server running on stdio");
