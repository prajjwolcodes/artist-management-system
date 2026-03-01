import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface RecentArtist {
  id: string;
  name: string;
  email: string;
  no_of_albums_released: number | null;
  is_active: boolean;
  created_at: string;
}

export function ManagerRecentTable({ artists }: { artists: RecentArtist[] }) {
  const getStatusColor = (isActive: boolean) => {
    if (isActive) {
      return 'bg-green-500/10 text-green-700 dark:text-green-400';
    }
    return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
  };

  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>Artist Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Albums</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {artists.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No artists found
              </TableCell>
            </TableRow>
          ) : (
            artists.map((artist) => (
              <TableRow key={artist.id}>
                <TableCell className="font-medium">{artist.name || 'N/A'}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{artist.email}</TableCell>
                <TableCell>{artist.no_of_albums_released ?? 0}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(artist.is_active)} variant="outline">
                    {artist.is_active ? 'Active' : 'Pending'}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(artist.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
