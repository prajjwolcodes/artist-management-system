'use client';

import { useEffect, useMemo, useState } from 'react';
import { Users, Music, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/manager/stat-card';
import { ManagerRecentTable } from '@/components/manager/recent-table';
import { toast } from 'sonner';

interface ArtistRow {
  id: string;
  name: string;
  email: string;
  no_of_albums_released: number | null;
  is_active: boolean;
  created_at: string;
}

interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ArtistsApiResponse {
  artists: ArtistRow[];
  pagination: PaginationResponse;
}

interface MusicApiResponse {
  music: Array<{ id: string }>;
  pagination: PaginationResponse;
}

export default function ManagerDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [totalArtists, setTotalArtists] = useState(0);
  const [activeArtists, setActiveArtists] = useState(0);
  const [totalMusic, setTotalMusic] = useState(0);
  const [recentArtists, setRecentArtists] = useState<ArtistRow[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [artistStatsRes, recentArtistsRes, musicStatsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist?page=1&limit=100`),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist?page=1&limit=5`),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/music?page=1&limit=1`),
        ]);

        const artistStatsData = (await artistStatsRes.json()) as ArtistsApiResponse | { error: string };
        const recentArtistsData = (await recentArtistsRes.json()) as ArtistsApiResponse | { error: string };
        const musicStatsData = (await musicStatsRes.json()) as MusicApiResponse | { error: string };

        if (!artistStatsRes.ok || !('artists' in artistStatsData)) {
          throw new Error('error' in artistStatsData ? artistStatsData.error : 'Failed to fetch artists');
        }

        if (!recentArtistsRes.ok || !('artists' in recentArtistsData)) {
          throw new Error('error' in recentArtistsData ? recentArtistsData.error : 'Failed to fetch recent artists');
        }

        if (!musicStatsRes.ok || !('pagination' in musicStatsData)) {
          throw new Error('error' in musicStatsData ? musicStatsData.error : 'Failed to fetch releases');
        }

        setTotalArtists(artistStatsData.pagination.total);
        setTotalMusic(musicStatsData.pagination.total);
        setRecentArtists(recentArtistsData.artists);

        let activeCount = artistStatsData.artists.filter((artist) => artist.is_active).length;

        for (let currentPage = 2; currentPage <= artistStatsData.pagination.totalPages; currentPage++) {
          const nextPageRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist?page=${currentPage}&limit=100`
          );
          const nextPageData = (await nextPageRes.json()) as ArtistsApiResponse | { error: string };

          if (!nextPageRes.ok || !('artists' in nextPageData)) {
            throw new Error('error' in nextPageData ? nextPageData.error : 'Failed to fetch artists');
          }

          activeCount += nextPageData.artists.filter((artist) => artist.is_active).length;
        }

        setActiveArtists(activeCount);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const cards = useMemo(
    () => [
      {
        icon: Users,
        label: 'Total Artists',
        value: totalArtists,
        description: 'All managed artists',
      },
      {
        icon: TrendingUp,
        label: 'Active Artists',
        value: activeArtists,
        description: 'Currently active',
      },
      {
        icon: Music,
        label: 'Total Releases',
        value: totalMusic,
        description: 'Across all artists',
      },
    ],
    [totalArtists, activeArtists, totalMusic]
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here&apos;s what&apos;s happening.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <StatCard
            key={card.label}
            icon={card.icon}
            label={card.label}
            value={isLoading ? '...' : card.value}
            description={card.description}
          />
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Recent Artists</h2>
        <ManagerRecentTable artists={recentArtists} />
      </div>
    </div>
  );
}
