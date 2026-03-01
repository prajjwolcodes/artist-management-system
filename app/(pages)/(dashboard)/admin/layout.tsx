import { AdminMobileNav, AdminSidebar } from '@/components/admin/sidebar';
import { TopNavbar } from '@/components/navigation/top-navbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen md:h-screen bg-background overflow-hidden">
      <AdminSidebar />
      <div className="flex flex-col flex-1 w-full">
        <TopNavbar />
        <AdminMobileNav />
        <main className="flex-1 overflow-auto py-4 px-4 sm:px-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}
