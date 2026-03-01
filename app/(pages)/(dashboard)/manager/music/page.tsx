'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Music, Loader2, Filter } from 'lucide-react';
import { MusicGalleryView } from '@/components/manager/music-gallery-view';
import { PaginationControls } from '@/components/pagination/pagination-controls';
import { Pagination } from '@/lib/types';
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface MusicTrack {
    id: string;
    title: string;
    album_name: string;
    genre: 'rnb' | 'country' | 'classic' | 'rock' | 'jazz';
    created_at: string;
    artist_name: string;
    artist_email: string;
}

interface Artist {
    id: string;
    name: string;
    email: string;
    is_active: boolean;
}

interface MusicApiResponse {
    music: MusicTrack[];
    pagination: Pagination;
}

interface ArtistsApiResponse {
    artists: Artist[];
}

export default function ManagerMusicPage() {
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const [tracks, setTracks] = useState<MusicTrack[]>([]);
    const [artists, setArtists] = useState<Artist[]>([]);
    const [selectedArtistId, setSelectedArtistId] = useState<string>('all');
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArtists();
    }, []);

    useEffect(() => {
        if (artists.length > 0 || selectedArtistId === 'all') {
            fetchTracks();
        }
    }, [page, limit, selectedArtistId]);

    const fetchArtists = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist?page=1&limit=1000`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch artists');
            }

            const data: ArtistsApiResponse = await response.json();
            const activeArtists = data.artists.filter(artist => artist.is_active === true); // Filter out artists without a name
            setArtists(activeArtists);
        } catch (error) {
            console.error('Error fetching artists:', error);
            toast.error('Failed to load artists list');
        }
    };

    const fetchTracks = async () => {
        try {
            setLoading(true);
            const artistParam = selectedArtistId !== 'all' ? `&artist_id=${selectedArtistId}` : '';
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/music?page=${page}&limit=${limit}${artistParam}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch music');
            }

            const data: MusicApiResponse = await response.json();
            setTracks(data.music);
            setPagination(data.pagination);
        } catch (error) {
            console.error('Error fetching tracks:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to load music');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading music...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex items-start sm:items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Music className="w-5 h-5 text-primary" />
                </div>
                <div className='flex flex-col sm:flex-row justify-between sm:items-center gap-3 w-full'>
                    <h1 className="text-xl sm:text-2xl font-bold text-foreground">Your Artists&apos; Music</h1>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <Filter className="w-5 h-5 text-muted-foreground" />
                        <div className="flex items-center gap-2 w-full">
                            <Select
                                value={selectedArtistId}
                                onValueChange={(value) => setSelectedArtistId(value)}
                            >
                                <SelectTrigger className="w-full sm:w-62.5">
                                    <SelectValue placeholder="Select an artist" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Artists</SelectItem>
                                    {artists.map((artist) => (
                                        <SelectItem key={artist.id} value={artist.id}>
                                            {artist.name || artist.email}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {selectedArtistId !== 'all' && (
                            <button
                                onClick={() => setSelectedArtistId('all')}
                                className="text-sm text-muted-foreground hover:text-foreground underline"
                            >
                                Clear filter
                            </button>
                        )}
                    </div>
                </div>


            </div>
            <p className="text-sm sm:text-base text-muted-foreground">View all your tracks and albums</p>
            {/* Filter Section */}


            {/* Music Gallery */}
            <MusicGalleryView tracks={tracks} artistCount={artists.length} />

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
                <PaginationControls
                    pagination={pagination}
                    pathName="/manager/music"
                />
            )}
        </div>
    );
}
