import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockArtists } from '@/lib/mock-data';

export function ManagerRecentTable() {
  const recentArtists = mockArtists.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'inactive':
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
      default:
        return '';
    }
  };

  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead>Artist Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Albums</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentArtists.map((artist) => (
            <TableRow key={artist.id} className="border-b border-border hover:bg-accent/50">
              <TableCell className="font-medium">{artist.displayName}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{artist.email}</TableCell>
              <TableCell>{artist.albumsReleased}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(artist.status)} variant="outline">
                  {artist.status.charAt(0).toUpperCase() + artist.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">{artist.createdAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
