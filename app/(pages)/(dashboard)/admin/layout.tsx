import { AdminSidebar } from '@/components/admin/sidebar';
import { TopNavbar } from '@/components/navigation/top-navbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <div className="flex flex-col flex-1 w-full">
        <TopNavbar />
        <main className="flex-1 overflow-auto py-4 px-8">{children}</main>
      </div>
    </div>
  );
}
