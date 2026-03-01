'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Music, Users, Plus, Settings, LayoutDashboard, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import LogoutButton from '@/app/(pages)/(auth)/logout/page';


const navItems = [
  { href: '/admin', label: 'Dashboard', icon: BarChart3 },
  { href: '/admin/managers', label: 'Managers', icon: Users },
  { href: '/admin/artists', label: 'Artists', icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card border-r border-border p-6 hidden md:flex flex-col">
      {/* Logo */}
      <Link href="/admin" className="flex items-center gap-2 mb-8">
        <Music className="w-6 h-6 text-primary" />
        <span className="font-bold text-lg">Cloco Music</span>
      </Link>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground '
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}

      </nav>

      <LogoutButton />
    </aside>
  );
} 