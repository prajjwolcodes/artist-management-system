'use client';

import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Artist } from '@/lib/types';

interface ArtistTableProps {
  artists: Artist[];
}

export function ArtistTable({ artists }: ArtistTableProps) {
  const getStatusColor = (status: Artist['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'inactive':
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
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
                  {artist.manager_name ? (
                    <span className="text-primary">{artist.manager_name}</span>
                  ) : (
                    <span className="text-muted-foreground italic">Unassigned</span>
                  )}
                </TableCell>
                <TableCell>{artist.first_release_year}</TableCell>
                <TableCell className="text-center">{artist.no_of_albums_released}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(artist.status)} variant="outline">
                    {artist.status.charAt(0).toUpperCase() + artist.status.slice(1)}

                  </Badge>
                  {/* {artist.status  === 'pending' && <Button variant="outline" size="xs" className="ml-2" onClick={() => sendActivationEmail(artist.email,token)}>Activate</Button>} */}
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
