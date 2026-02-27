import { Disc3, Music, Calendar } from 'lucide-react';
import { ArtistStatCard } from '@/components/artist/stat-card';

export default function ArtistDashboard() {
  // Mock data - in real app would come from auth context
  const totalAlbums = 3;
  const totalTracks = 12;
  const firstReleaseYear = 2018;

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
          value={totalAlbums}
          description="Albums released"
        />
        <ArtistStatCard
          icon={Music}
          label="Total Tracks"
          value={totalTracks}
          description="Songs available"
        />
        <ArtistStatCard
          icon={Calendar}
          label="First Release"
          value={firstReleaseYear}
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
              <span className="font-medium">{firstReleaseYear}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Albums</span>
              <span className="font-medium">{totalAlbums}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tracks</span>
              <span className="font-medium">{totalTracks}</span>
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
