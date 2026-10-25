import { HostOnboarding } from "@/components/HostOnboarding";

export default async function HostEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="mx-auto w-full max-w-3xl px-margin py-4 md:py-8">
      <h1 className="font-headline-md text-headline-md font-extrabold tracking-tight text-on-surface">
        แก้ไขประกาศ
      </h1>
      <p className="mt-1 font-body-md text-body-md text-tertiary">
        ข้อมูลเดิมถูกดึงมาใส่ฟอร์มแล้ว แก้แล้วกด &ldquo;ส่งใหม่&rdquo; เพื่อเข้าคิวตรวจอีกครั้ง
      </p>
      <div className="mt-4">
        <HostOnboarding editId={id} />
      </div>
    </main>
  );
}