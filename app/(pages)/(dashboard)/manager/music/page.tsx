'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Music, Loader2 } from 'lucide-react';
import { MusicGalleryView } from '@/components/manager/music-gallery-view';
import { PaginationControls } from '@/components/pagination/pagination-controls';
import { Pagination } from '@/lib/types';
import { toast } from 'sonner';

interface MusicTrack {
    id: string;
    title: string;
    album_name: string;
    genre: 'rnb' | 'country' | 'classic' | 'rock' | 'jazz';
    created_at: string;
    artist_name: string;
    artist_email: string;
}

interface MusicApiResponse {
    music: MusicTrack[];
    pagination: Pagination;
}

export default function ManagerMusicPage() {
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const [tracks, setTracks] = useState<MusicTrack[]>([]);
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
        fetchTracks();
    }, [page, limit]);

    const fetchTracks = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/music?page=${page}&limit=${limit}`
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
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Music className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Your Artists&apos; Music</h1>
                    <p className="text-muted-foreground mt-1">View music created by your managed artists</p>
                </div>
            </div>

            {/* Music Gallery */}
            <MusicGalleryView tracks={tracks} />

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
