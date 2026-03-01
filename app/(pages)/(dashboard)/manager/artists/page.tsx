'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Trash2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface ArtistRow {
  id: string;
  artist_id: string;
  name: string;
  email: string;
  first_release_year: number | null;
  no_of_albums_released: number | null;
  is_active: boolean;
  created_at: string;
  music_count: number | string;
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

export default function ArtistsPage() {
  const [artists, setArtists] = useState<ArtistRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isResending, setIsResending] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationResponse>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchArtists = async (targetPage: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist?page=${targetPage}&limit=${pagination.limit}`
      );

      const data = (await res.json()) as ArtistsApiResponse | { error: string };

      if (!res.ok || !('artists' in data)) {
        throw new Error('error' in data ? data.error : 'Failed to fetch artists');
      }

      setArtists(data.artists);
      setPagination(data.pagination);
      setPage(targetPage);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch artists');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists(1);
  }, []);

  const handleDeleteArtist = async (artist: ArtistRow) => {
    const musicCount = Number(artist.music_count || 0);
    if (musicCount > 0) {
      toast.error('Cannot delete artist who has music');
      return;
    }

    setIsDeleting(artist.id);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist/${artist.id}`, {
        method: 'DELETE',
      });

      const data = (await res.json()) as { message?: string; error?: string };

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete artist');
      }

      toast.success(data.message || 'Artist deleted successfully');

      const isLastItemOnPage = artists.length === 1;
      const newPage = isLastItemOnPage && page > 1 ? page - 1 : page;
      await fetchArtists(newPage);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete artist');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleResendActivation = async (artist: ArtistRow) => {
    setIsResending(artist.id);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist/resend-activation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: artist.email }),
      });

      const data = (await res.json()) as { message?: string; error?: string };

      if (!res.ok) {
        throw new Error(data.error || 'Failed to resend activation link');
      }

      toast.success(data.message || 'Activation link sent successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to resend activation link');
    } finally {
      setIsResending(null);
    }
  };

  const getStatusColor = (isActive: boolean) => {
    const status = isActive ? 'active' : 'pending';

    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      default:
        return '';
    }
  };

  const pageArtists = useMemo(() => artists, [artists]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Artists</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">Manage all your artists in one place</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
          <Link href="/manager/create">Invite Artist</Link>
        </Button>
      </div>



      {/* Table */}
      {isLoading ? (
        <Card className="p-12 bg-card border border-border text-center">
          <p className="text-muted-foreground">Loading artists...</p>
        </Card>
      ) : (
        <div className="border border-border rounded-lg bg-card overflow-hidden">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Artist Name</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">First Release</TableHead>
                <TableHead className="hidden md:table-cell">Albums</TableHead>
                <TableHead className="hidden lg:table-cell">Music</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageArtists.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No artists found
                  </TableCell>
                </TableRow>
              ) : (
                pageArtists.map((artist) => (
                  <TableRow key={artist.id}>
                    <TableCell className="font-medium">{artist.name === " " ? 'Not Activated' : artist.name}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">{artist.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{artist.first_release_year ?? '-'}</TableCell>
                    <TableCell className="hidden md:table-cell">{artist.no_of_albums_released ?? 0}</TableCell>
                    <TableCell className="hidden lg:table-cell">{Number(artist.music_count || 0)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(artist.is_active)} variant="outline">
                        {artist.is_active ? 'Active' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-end">
                        {!artist.is_active && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 text-xs"
                            disabled={isResending === artist.id}
                            onClick={() => handleResendActivation(artist)}
                            title="Resend activation link"
                          >
                            <RefreshCw className="w-4 h-4 sm:mr-1" />
                            <span className="hidden sm:inline">{isResending === artist.id ? 'Sending...' : 'Resend'}</span>
                          </Button>
                        )}


                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="px-2">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogTitle>Delete Artist</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {artist.name}? This action cannot be
                              undone.
                            </AlertDialogDescription>
                            <div className="flex gap-2 justify-end">
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteArtist(artist)}
                                className="bg-destructive text-destructive-foreground"
                              >
                                Delete
                              </AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Card className="flex flex-col sm:flex-row w-full justify-between sm:items-center gap-3 px-4 sm:px-8 py-3 bg-card border border-border">
        <p className="text-xs sm:text-sm text-muted-foreground">
          Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total artists)
        </p>

        <div className="flex items-center justify-end gap-2 sm:gap-3">
          <Button
            variant="outline"
            disabled={isLoading || !pagination.hasPrevPage}
            onClick={() => fetchArtists(page - 1)}
            size="sm"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={isLoading || !pagination.hasNextPage}
            onClick={() => fetchArtists(page + 1)}
            size="sm"
          >
            Next
          </Button>
        </div>
      </Card>


    </div>
  );
}
