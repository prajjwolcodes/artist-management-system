'use client';

import { useAuth } from '@/lib/auth-context';
import { ManagerMobileNav, ManagerSidebar } from '@/components/manager/sidebar';
import { ArtistMobileNav, ArtistSidebar } from '@/components/artist/sidebar';
import { TopNavbar } from '@/components/navigation/top-navbar';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const isManager = currentUser?.role === 'artist_manager';

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen md:h-screen overflow-hidden">
        {isManager ? <ManagerSidebar /> : <ArtistSidebar />}
        <div className="flex-1 flex flex-col">
          <TopNavbar />
          {isManager && <ManagerMobileNav />}
          {!isManager && <ArtistMobileNav />}
          <main className="flex-1 overflow-auto">
            <div className="p-4 sm:p-6 md:p-8">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
