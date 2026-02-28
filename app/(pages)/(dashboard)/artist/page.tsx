'use client';

import { Disc3, Music, Calendar, Loader2 } from 'lucide-react';
import { ArtistStatCard } from '@/components/artist/stat-card';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ArtistStats {
  totalAlbums: number;
  totalTracks: number;
  firstReleaseYear: number;
}

export default function ArtistDashboard() {
  const [stats, setStats] = useState<ArtistStats>({
    totalAlbums: 0,
    totalTracks: 0,
    firstReleaseYear: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // Fetch all music to calculate stats
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/music?limit=100`);

      if (!response.ok) {
        throw new Error('Failed to fetch music');
      }

      const data = await response.json();
      const music = data.music || [];

      // Calculate unique albums
      const uniqueAlbums = new Set(music.map((track: any) => track.album_name)).size;

      setStats({
        totalAlbums: uniqueAlbums,
        totalTracks: music.length,
        firstReleaseYear: music.length > 0 ? new Date().getFullYear() : 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to your music dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ArtistStatCard
          icon={Disc3}
          label="Total Albums"
          value={stats.totalAlbums}
          description="Albums released"
        />
        <ArtistStatCard
          icon={Music}
          label="Total Tracks"
          value={stats.totalTracks}
          description="Songs available"
        />
        <ArtistStatCard
          icon={Calendar}
          label="First Release"
          value={stats.firstReleaseYear}
          description="Years active"
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-card border border-border rounded-lg">
          <h3 className="font-semibold text-foreground mb-4">About Your Career</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active Since</span>
              <span className="font-medium">{stats.firstReleaseYear || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Albums</span>
              <span className="font-medium">{stats.totalAlbums}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tracks</span>
              <span className="font-medium">{stats.totalTracks}</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-card border border-border rounded-lg">
          <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">Visit My Music to manage your tracks</p>
            <p className="text-muted-foreground">Update your profile anytime</p>
            <p className="text-muted-foreground">Check your releases status</p>
          </div>
        </div>
      </div>
    </div>
  );
}
