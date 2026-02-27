'use client';

import { useAuth } from '@/lib/auth-context';
import { ManagerSidebar } from '@/components/manager/sidebar';
import { ArtistSidebar } from '@/components/artist/sidebar';
import { TopNavbar } from '@/components/navigation/top-navbar';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const isManager = currentUser?.role === 'manager';

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {isManager ? <ManagerSidebar /> : <ArtistSidebar />}
        <div className="flex-1 flex flex-col">
          <TopNavbar />
          <main className="flex-1 overflow-auto">
            <div className="p-6 md:p-8">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
