import { AdminNav } from "@/components/admin-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto grid lg:grid-cols-5 gap-12 p-4">
      <aside className="hidden lg:block">
        <AdminNav />
      </aside>
      <main className="lg:col-span-4">
        {children}
      </main>
    </div>
  );
}