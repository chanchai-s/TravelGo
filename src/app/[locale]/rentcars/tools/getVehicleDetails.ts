import { getVehicleDetail } from "../resources/vehicleDetails.js";

/** เธ”เธนเธฃเธฒเธขเธฅเธฐเน€เธญเธตเธขเธ”เธฃเธ–เธเธฑเธเน€เธ”เธตเธขเธง (เธชเน€เธเธ + เธเธเธเธฒเธฃเน€เธเนเธฒ + เธฃเธตเธงเธดเธง + เธฃเธ–เนเธเธฅเนเน€เธเธตเธขเธ) */
export async function getVehicleDetails(args: { vehicleId: string }) {
  const details = await getVehicleDetail(args.vehicleId);
  if ("error" in details) {
    return {
      content: [{ type: "text" as const, text: JSON.stringify(details, null, 2) }],
      isError: true,
    };
  }
  return { content: [{ type: "text" as const, text: JSON.stringify(details, null, 2) }] };
}
