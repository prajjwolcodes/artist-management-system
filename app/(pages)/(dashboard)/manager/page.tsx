import { Users, Music, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/manager/stat-card';
import { mockArtists } from '@/lib/mock-data';
import { ManagerRecentTable } from '@/components/manager/recent-table';

export default function ManagerDashboard() {
  const totalArtists = mockArtists.length;
  const activeArtists = mockArtists.filter((a) => a.status === 'active').length;
  const totalMusic = 15; // Mock data

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={Users}
          label="Total Artists"
          value={totalArtists}
          description="All managed artists"
        />
        <StatCard
          icon={TrendingUp}
          label="Active Artists"
          value={activeArtists}
          description="Currently active"
        />
        <StatCard
          icon={Music}
          label="Total Releases"
          value={totalMusic}
          description="Across all artists"
        />
      </div>

      {/* Recent Artists */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Recent Artists</h2>
        <ManagerRecentTable />
      </div>
    </div>
  );
}
