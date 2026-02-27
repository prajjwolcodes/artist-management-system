'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2 } from 'lucide-react';
import { MusicTrack } from '@/lib/types';
import { toast } from 'sonner';

interface MusicTableProps {
  tracks: MusicTrack[];
  onDelete: (id: string) => void;
  onEdit: (track: MusicTrack) => void;
}

export function MusicTable({ tracks, onDelete, onEdit }: MusicTableProps) {
  const handleDelete = (id: string) => {
    onDelete(id);
    toast.success('Track deleted');
  };

  if (tracks.length === 0) {
    return (
      <div className="p-12 bg-card border border-border rounded-lg text-center">
        <p className="text-muted-foreground">No tracks yet. Add your first track to get started!</p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead>Title</TableHead>
            <TableHead>Album</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tracks.map((track) => (
            <TableRow key={track.id} className="border-b border-border hover:bg-accent/50">
              <TableCell className="font-medium">{track.title}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{track.album}</TableCell>
              <TableCell className="text-sm">{track.genre}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{track.createdAt}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onEdit(track)}
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(track.id)}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
