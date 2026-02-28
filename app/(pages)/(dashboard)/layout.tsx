'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';

export default function DashboardRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, currentUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    // Role-based access control
    if (!isLoading && isAuthenticated && currentUser) {
      const userRole = currentUser.role;

      // Determine the correct dashboard path for the user's role
      let correctPath = '/';
      if (userRole === 'artist') {
        correctPath = '/artist';
      } else if (userRole === 'artist_manager') {
        correctPath = '/manager';
      } else if (userRole === 'super_admin') {
        correctPath = '/admin';
      }

      // Check if user is trying to access a different role's dashboard
      if (pathname.startsWith('/artist') && userRole !== 'artist') {
        router.push(correctPath);
      } else if (pathname.startsWith('/manager') && userRole !== 'artist_manager') {
        router.push(correctPath);
      } else if (pathname.startsWith('/admin') && userRole !== 'super_admin') {
        router.push(correctPath);
      }
    }
  }, [isAuthenticated, isLoading, currentUser, pathname, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Admin routes are handled by their own layout, don't wrap with DashboardLayout
  if (pathname.startsWith('/admin')) {
    return children;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
