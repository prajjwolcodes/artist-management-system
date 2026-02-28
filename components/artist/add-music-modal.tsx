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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MusicTrack } from '@/lib/types';
import { toast } from 'sonner';

interface AddMusicModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (track: Omit<MusicTrack, 'id' | 'artist_id'>) => void;
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
    album_name: '',
    genre: 'rock' as 'rnb' | 'country' | 'classic' | 'rock' | 'jazz',
    createdAt: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (editingTrack) {
      setFormData({
        title: editingTrack.title,
        album_name: editingTrack.album_name,
        genre: editingTrack.genre,
        createdAt: editingTrack.createdAt,
      });
    } else {
      setFormData({
        title: '',
        album_name: '',
        genre: 'rock',
        createdAt: new Date().toISOString().split('T')[0],
      });
    }
  }, [editingTrack, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.album_name || !formData.genre) {
      toast.error('Please fill in all fields');
      return;
    }

    onSubmit({
      title: formData.title,
      album_name: formData.album_name,
      genre: formData.genre as 'rnb' | 'country' | 'classic' | 'rock' | 'jazz',
      createdAt: formData.createdAt,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {editingTrack ? 'Edit Track' : 'Add New Track'}
          </DialogTitle>
          <DialogDescription>
            {editingTrack
              ? 'Update your track information below'
              : 'Create a new track in your music library'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Track Title <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Enter track title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="border-border"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Album Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Enter album name"
              value={formData.album_name}
              onChange={(e) =>
                setFormData({ ...formData, album_name: e.target.value })
              }
              required
              className="border-border"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Genre <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.genre}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  genre: value as 'rnb' | 'country' | 'classic' | 'rock' | 'jazz',
                })
              }
            >
              <SelectTrigger className="border-border">
                <SelectValue placeholder="Select a genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rock">Rock</SelectItem>
                <SelectItem value="rnb">R&B</SelectItem>
                <SelectItem value="jazz">Jazz</SelectItem>
                <SelectItem value="classic">Classical</SelectItem>
                <SelectItem value="country">Country</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Release Date
            </label>
            <Input
              type="date"
              value={formData.createdAt}
              onChange={(e) =>
                setFormData({ ...formData, createdAt: e.target.value })
              }
              className="border-border"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 shadow-lg"
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
