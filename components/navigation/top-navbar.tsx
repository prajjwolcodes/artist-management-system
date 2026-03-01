'use client';

import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { LogOut, Music } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function TopNavbar() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="border-b border-border bg-card">
      <div className="flex items-center justify-between px-6 md:px-8 py-4">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-primary" />
          <h1 className="text-sm font-semibold text-foreground">{currentUser?.role === 'artist_manager' ? 'Manager' : 'Artist'} Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{currentUser?.name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
