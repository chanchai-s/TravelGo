import { redirect } from "next/navigation";

export default async function HostPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/bookingdetails/${id}?preview=1`);
}
