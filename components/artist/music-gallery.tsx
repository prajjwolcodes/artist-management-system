'use client';

import { useState } from 'react';
import { Music, Edit2, Trash2, Calendar, Music2 } from 'lucide-react';
import { MusicTrack } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface MusicGalleryProps {
    tracks: MusicTrack[];
    onDelete: (id: string) => void;
    onEdit: (track: MusicTrack) => void;
}

const genreColors: Record<string, { bg: string; text: string }> = {
    rock: { bg: 'bg-red-50 dark:bg-red-950', text: 'text-red-700 dark:text-red-300' },
    rnb: { bg: 'bg-blue-50 dark:bg-blue-950', text: 'text-blue-700 dark:text-blue-300' },
    jazz: { bg: 'bg-amber-50 dark:bg-amber-950', text: 'text-amber-700 dark:text-amber-300' },
    classic: { bg: 'bg-purple-50 dark:bg-purple-950', text: 'text-purple-700 dark:text-purple-300' },
    country: { bg: 'bg-orange-50 dark:bg-orange-950', text: 'text-orange-700 dark:text-orange-300' },
};

const genreBadgeStyles: Record<string, string> = {
    rock: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    rnb: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    jazz: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    classic: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    country: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
};

export function MusicGallery({ tracks, onDelete, onEdit }: MusicGalleryProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const handleDelete = (id: string) => {
        onDelete(id);
        toast.success('Track deleted successfully');
    };

    if (tracks.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-125 bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg border border-border">
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="p-4 bg-primary/10 rounded-full">
                            <Music className="w-8 h-8 text-primary" />
                        </div>
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-foreground">No music yet</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Start creating by adding your first track!
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Tracks</p>
                            <p className="text-2xl font-bold text-foreground">{tracks.length}</p>
                        </div>
                        <Music2 className="w-10 h-10 text-primary/20" />
                    </div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Albums</p>
                            <p className="text-2xl font-bold text-foreground">
                                {new Set(tracks.map((t) => t.album_name)).size}
                            </p>
                        </div>
                        <Music className="w-10 h-10 text-primary/20" />
                    </div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Genres</p>
                            <p className="text-2xl font-bold text-foreground">
                                {new Set(tracks.map((t) => t.genre)).size}
                            </p>
                        </div>
                        <Music className="w-10 h-10 text-primary/20" />
                    </div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Latest</p>
                            <p className="text-lg font-bold text-foreground truncate">
                                {tracks[0]?.title || 'N/A'}
                            </p>
                        </div>
                        <Calendar className="w-10 h-10 text-primary/20" />
                    </div>
                </div>
            </div>

            {/* Music Grid */}
            <div>
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Your Music</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage and organize your tracks across albums
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tracks.map((track) => {
                        const colors = genreColors[track.genre] || genreColors['rock'];
                        const badgeStyle = genreBadgeStyles[track.genre] || genreBadgeStyles['rock'];
                        const isHovered = hoveredId === track.id;

                        return (
                            <div
                                key={track.id}
                                onMouseEnter={() => setHoveredId(track.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                className={`group relative overflow-hidden rounded-lg border border-border transition-all duration-300 ${isHovered ? 'shadow-lg border-primary/50' : 'shadow-sm'
                                    }`}
                            >
                                {/* Album Art Background */}
                                <div
                                    className={`relative pb-[100%] w-full transition-all duration-300 ${colors.bg}`}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-primary/20 to-primary/5">
                                        <div className={`p-6 rounded-full ${colors.bg}`}>
                                            <Music className={`w-12 h-12 ${colors.text} transition-transform duration-300 group-hover:scale-110`} />
                                        </div>
                                    </div>

                                    {/* Hover Overlay */}
                                    {isHovered && (
                                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center gap-2 animate-in fade-in duration-200">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="bg-white/90 hover:bg-white text-black h-10 w-10 p-0 rounded-full"
                                                onClick={() => onEdit(track)}
                                                title="Edit track"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="bg-white/90 hover:bg-white text-destructive h-10 w-10 p-0 rounded-full"
                                                onClick={() => handleDelete(track.id)}
                                                title="Delete track"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* Track Details */}
                                <div className="p-4 bg-card space-y-3">
                                    <div>
                                        <h4 className="font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors">
                                            {track.title}
                                        </h4>
                                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                            {track.album_name}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-border">
                                        <Badge className={badgeStyle} variant="secondary">
                                            {track.genre.charAt(0).toUpperCase() + track.genre.slice(1)}
                                        </Badge>
                                        <div className="flex items-center text-xs text-muted-foreground gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(track.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
