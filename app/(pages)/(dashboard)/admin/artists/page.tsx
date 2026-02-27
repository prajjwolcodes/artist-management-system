'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PaginationControls } from '@/components/pagination/pagination-controls';
import { ArtistTable } from '@/components/admin/artist-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Artist } from '@/lib/types';

export default function ArtistsPage() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending'>('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  useEffect(() => {
    fetchArtists();
  }, [page, limit]);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/artist?page=${page}&limit=${limit}`);

      if (!response.ok) throw new Error('Failed to fetch artists');

      const data = await response.json();

      // Transform API data to match Artist type
      const transformedArtists = data.artists.map((artist: any) => ({
        id: artist.id,
        email: artist.email,
        displayName: artist.name,
        firstReleaseYear: artist.first_release_year || 0,
        albumsReleased: artist.no_of_albums_released || 0,
        status: artist.is_active ? 'active' : 'pending',
        createdAt: new Date().toISOString(),
        managerId: undefined,
        managerName: undefined,
      }));

      setArtists(transformedArtists);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching artists:', error);
      toast.error('Failed to load artists');
    } finally {
      setLoading(false);
    }
  };

  const filteredArtists = artists.filter((artist) => {
    const matchesSearch =
      artist.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && artist.status === 'active') ||
      (statusFilter === 'pending' && artist.status === 'pending');

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Artists</h1>
        <p className="mt-1 text-muted-foreground">
          View all registered artists in the system
        </p>
      </div>

      <Card className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 space-y-4">
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="flex gap-2">
            <Select
              value={statusFilter}
              onValueChange={(value: any) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <div className="ml-auto text-sm text-muted-foreground pt-2">
              Showing {filteredArtists.length} of {pagination.total} artists
            </div>
          </div>
        </div>

        <ArtistTable artists={filteredArtists} />
      </Card>

      {pagination.totalPages > 1 && (
        <PaginationControls
          pagination={pagination}
          pathName="/admin/artists"
        />
      )}
    </div>
  );
}
