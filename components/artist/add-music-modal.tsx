'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MusicTrack } from '@/lib/types';
import { toast } from 'sonner';

interface AddMusicModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (track: Omit<MusicTrack, 'id' | 'artistId'>) => void;
  editingTrack?: MusicTrack | null;
}

export function AddMusicModal({
  open,
  onOpenChange,
  onSubmit,
  editingTrack,
}: AddMusicModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    album: '',
    genre: '',
    createdAt: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (editingTrack) {
      setFormData({
        title: editingTrack.title,
        album: editingTrack.album,
        genre: editingTrack.genre,
        createdAt: editingTrack.createdAt,
      });
    } else {
      setFormData({
        title: '',
        album: '',
        genre: '',
        createdAt: new Date().toISOString().split('T')[0],
      });
    }
  }, [editingTrack, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.album || !formData.genre) {
      toast.error('Please fill in all fields');
      return;
    }

    onSubmit({
      title: formData.title,
      album: formData.album,
      genre: formData.genre,
      createdAt: formData.createdAt,
    });

    onOpenChange(false);
    toast.success(editingTrack ? 'Track updated' : 'Track added');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingTrack ? 'Edit Track' : 'Add New Track'}</DialogTitle>
          <DialogDescription>
            {editingTrack ? 'Update track information' : 'Add a new track to your music library'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title *</label>
            <Input
              placeholder="Track title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Album *</label>
            <Input
              placeholder="Album name"
              value={formData.album}
              onChange={(e) => setFormData({ ...formData, album: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Genre *</label>
            <Input
              placeholder="e.g., Pop, Rock, Jazz"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Input
              type="date"
              value={formData.createdAt}
              onChange={(e) => setFormData({ ...formData, createdAt: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {editingTrack ? 'Update Track' : 'Add Track'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
