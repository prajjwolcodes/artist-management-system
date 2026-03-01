'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Music, Loader2 } from 'lucide-react';
import { MusicGallery } from '@/components/artist/music-gallery';
import { AddMusicModal } from '@/components/artist/add-music-modal';
import { PaginationControls } from '@/components/pagination/pagination-controls';
import { MusicTrack, Pagination } from '@/lib/types';
import { toast } from 'sonner';

interface MusicApiResponse {
  music: Array<{
    id: string;
    title: string;
    album_name: string;
    genre: 'rnb' | 'country' | 'classic' | 'rock' | 'jazz';
    artist_id: string;
    created_at: string;
  }>;
  pagination: Pagination;
}

export default function ArtistMusicPage() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState<MusicTrack | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTracks();
  }, [page, limit]);

  const fetchTracks = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/music?page=${page}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch music');
      }

      const data: MusicApiResponse = await response.json();

      // Transform API response to match MusicTrack type
      const transformedTracks = data.music.map((track) => ({
        id: track.id,
        title: track.title,
        album_name: track.album_name,
        genre: track.genre,
        artist_id: track.artist_id,
        createdAt: track.created_at,
      }));

      setTracks(transformedTracks);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching tracks:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load music');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTrack = async (newTrack: Omit<MusicTrack, 'id' | 'artist_id'>) => {
    setIsSubmitting(true);
    try {
      const method = editingTrack ? 'PATCH' : 'POST';
      const endpoint = editingTrack
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/music/${editingTrack.id}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/music`;

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTrack.title,
          album_name: newTrack.album_name,
          genre: newTrack.genre,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save track');
      }

      toast.success(editingTrack ? 'Track updated successfully' : 'Track added successfully');
      setEditingTrack(null);
      setModalOpen(false);

      // Refetch with page 1 after create, or current page after edit
      const targetPage = editingTrack ? page : 1;
      await fetchTracks();
      // If on page > 1 and just added, redirect to page 1
      if (!editingTrack && page > 1) {
        window.location.href = `?page=1&limit=${limit}`;
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save track');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (track: MusicTrack) => {
    setEditingTrack(track);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/music/${id}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete track');
      }

      toast.success('Track deleted successfully');

      // If last item on page and not on page 1, go to previous page
      if (tracks.length === 1 && page > 1) {
        window.location.href = `?page=${page - 1}&limit=${limit}`;
      } else {
        await fetchTracks();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete track');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your music...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Music className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">My Music</h1>
          </div>
          <p className="text-base text-muted-foreground">Manage your tracks and albums with a modern interface</p>
        </div>
        <Button
          onClick={() => {
            setEditingTrack(null);
            setModalOpen(true);
          }}
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary/90 gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add Track
        </Button>
      </div>

      {/* Music Gallery */}
      <MusicGallery
        tracks={tracks}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <PaginationControls
          pagination={pagination}
          pathName="/artist/music"
        />
      )}

      {/* Add Music Modal */}
      <AddMusicModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleAddTrack}
        editingTrack={editingTrack}
      />

    </div>
  )
};