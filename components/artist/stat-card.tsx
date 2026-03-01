import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface ArtistStatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  description?: string;
}

export function ArtistStatCard({ icon: Icon, label, value, description }: ArtistStatCardProps) {
  return (
    <Card className="bg-card border border-border">
      <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {label}
          </CardTitle>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="space-y-2">
          <p className="text-xl sm:text-2xl font-bold text-foreground">{value}</p>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
