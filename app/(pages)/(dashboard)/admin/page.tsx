'use client';

import { useAuth } from '@/lib/auth-context';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Music2, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Manager {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

interface Artist {
  id: string;
  name: string;
  email: string;
  gender?: string;
  dob?: string;
  address?: string;
  first_release_year?: number;
  no_of_albums_released?: number;
  is_active: boolean;
}

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const [managers, setManagers] = useState<Manager[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalManagers: 0,
    totalArtists: 0,
    activeArtists: 0,
    pendingArtists: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all users to get managers
      const usersResponse = await fetch('/api/users?limit=100');
      if (!usersResponse.ok) throw new Error('Failed to fetch users');
      const usersData = await usersResponse.json();

      // Filter managers
      const managersData = usersData.users.filter((u: any) => u.role === 'artist_manager');
      setManagers(managersData.slice(0, 5));

      // Fetch artists
      const artistsResponse = await fetch('/api/artist?limit=100');
      if (!artistsResponse.ok) throw new Error('Failed to fetch artists');
      const artistsData = await artistsResponse.json();

      const artistsList = artistsData.artists || [];
      setArtists(artistsList.slice(0, 5));

      // Calculate stats
      const activeCount = artistsList.filter((a: Artist) => a.is_active).length;
      const pendingCount = artistsList.filter((a: Artist) => !a.is_active).length;

      setStats({
        totalManagers: managersData.length,
        totalArtists: artistsList.length,
        activeArtists: activeCount,
        pendingArtists: pendingCount,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const recentArtists = artists;
  const recentManagers = managers;

  const statsData = [
    {
      title: 'Total Managers',
      value: stats.totalManagers,
      description: 'Active artist managers',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Total Artists',
      value: stats.totalArtists,
      description: 'Registered in system',
      icon: Music2,
      color: 'text-purple-600',
    },
    {
      title: 'Active Artists',
      value: stats.activeArtists,
      description: `${stats.activeArtists} of ${stats.totalArtists} artists`,
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      title: 'Pending Artists',
      value: stats.pendingArtists,
      description: 'Awaiting approval',
      icon: Clock,
      color: 'text-orange-600',
    },
  ];

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-balance">Welcome back, {currentUser?.name}</h1>
        <p className="mt-2 text-muted-foreground">
          Manage all platform users and monitor system activity
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="mt-2 text-4xl font-bold">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Managers Section */}
        <Card className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Recent Managers</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage artist managers
              </p>
            </div>
            <Link href="/admin/managers">
              <Button variant="outline" size="sm">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentManagers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                      No managers found
                    </TableCell>
                  </TableRow>
                ) : (
                  recentManagers.map((manager) => (
                    <TableRow key={manager.id}>
                      <TableCell className="font-medium">
                        {manager.first_name} {manager.last_name}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {manager.email}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Artists Section */}
        <Card className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Recent Artists</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                View all registered artists
              </p>
            </div>
            <Link href="/admin/artists">
              <Button variant="outline" size="sm">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentArtists.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      No artists found
                    </TableCell>
                  </TableRow>
                ) : (
                  recentArtists.map((artist) => (
                    <TableRow key={artist.id}>
                      <TableCell className="font-medium">{artist.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {artist.email}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(artist.is_active)}>
                          {artist.is_active ? 'Active' : 'Pending'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
