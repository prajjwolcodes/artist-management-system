'use client';

import { Artist } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface ArtistTableProps {
  artists: Artist[];
}

export function ArtistTable({ artists }: ArtistTableProps) {
  const getStatusColor = (status: Artist['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Manager</TableHead>
            <TableHead>First Release</TableHead>
            <TableHead>Albums</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {artists.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No artists found
              </TableCell>
            </TableRow>
          ) : (
            artists.map((artist) => (
              <TableRow key={artist.id}>
                <TableCell className="font-medium">{artist.displayName}</TableCell>
                <TableCell className="text-sm">{artist.email}</TableCell>
                <TableCell className="text-sm">
                  {artist.managerName ? (
                    <span className="text-primary">{artist.managerName}</span>
                  ) : (
                    <span className="text-muted-foreground italic">Unassigned</span>
                  )}
                </TableCell>
                <TableCell>{artist.firstReleaseYear}</TableCell>
                <TableCell className="text-center">{artist.albumsReleased}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(artist.status)}>
                    {artist.status.charAt(0).toUpperCase() + artist.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(artist.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
