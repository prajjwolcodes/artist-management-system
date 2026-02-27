'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { mockTracks } from '@/lib/mock-data';
import { MusicTable } from '@/components/artist/music-table';
import { AddMusicModal } from '@/components/artist/add-music-modal';
import { MusicTrack } from '@/lib/types';
import { toast } from 'sonner';

export default function ArtistMusicPage() {
  const [tracks, setTracks] = useState<MusicTrack[]>(mockTracks);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState<MusicTrack | null>(null);

  const handleAddTrack = (newTrack: Omit<MusicTrack, 'id' | 'artistId'>) => {
    if (editingTrack) {
      setTracks(
        tracks.map((t) =>
          t.id === editingTrack.id ? { ...t, ...newTrack } : t
        )
      );
      setEditingTrack(null);
    } else {
      const track: MusicTrack = {
        id: `track-${Date.now()}`,
        artistId: 'user-artist-1',
        ...newTrack,
      };
      setTracks([track, ...tracks]);
    }
  };

  const handleEdit = (track: MusicTrack) => {
    setEditingTrack(track);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setTracks(tracks.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Music</h1>
          <p className="text-muted-foreground mt-2">Manage your tracks and albums</p>
        </div>
        <Button
          onClick={() => {
            setEditingTrack(null);
            setModalOpen(true);
          }}
          className="bg-primary hover:bg-primary/90 gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Track
        </Button>
      </div>

      {/* Music Table */}
      <MusicTable
        tracks={tracks}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      {/* Add Music Modal */}
      <AddMusicModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleAddTrack}
        editingTrack={editingTrack}
      />
    </div>
  );
}
