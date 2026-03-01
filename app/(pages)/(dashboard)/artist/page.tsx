'use client'

import {
  Disc3,
  Music,
  Calendar,
  Loader2,
  TrendingUp,
} from 'lucide-react'
import { ArtistStatCard } from '@/components/artist/stat-card'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'

interface ArtistStats {
  totalAlbums: number
  totalTracks: number
  firstReleaseYear: number
  totalPlays: number
}

interface MusicTrack {
  id: number
  title: string
  album_name: string
  genre: string
  plays: number
  created_at: string
}

export default function ArtistDashboard() {
  const { currentUser } = useAuth()
  const [stats, setStats] = useState<ArtistStats>({
    totalAlbums: 0,
    totalTracks: 0,
    firstReleaseYear: 0,
    totalPlays: 0,
  })

  const [topTracks, setTopTracks] = useState<MusicTrack[]>([])
  const [loading, setLoading] = useState(true)


  const genreColors: Record<string, { bg: string; text: string }> = {
    rock: { bg: 'bg-red-50 dark:bg-red-950', text: 'text-red-700 dark:text-red-300' },
    rnb: { bg: 'bg-blue-50 dark:bg-blue-950', text: 'text-blue-700 dark:text-blue-300' },
    jazz: { bg: 'bg-amber-50 dark:bg-amber-950', text: 'text-amber-700 dark:text-amber-300' },
    classic: { bg: 'bg-purple-50 dark:bg-purple-950', text: 'text-purple-700 dark:text-purple-300' },
    country: { bg: 'bg-orange-50 dark:bg-orange-950', text: 'text-orange-700 dark:text-orange-300' },
  };

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/music?limit=100`
      )

      if (!response.ok) throw new Error('Failed to fetch music')

      const data = await response.json()
      const music = data.music || []

      const uniqueAlbums = new Set(
        music.map((track: any) => track.album_name)
      ).size

      const totalPlays = music.reduce(
        (acc: number, track: any) => acc + (track.plays || 0),
        0
      )

      // Sort by plays
      const sortedByPlays = [...music].sort(
        (a: any, b: any) => (b.plays || 0) - (a.plays || 0)
      )

      const oldestReleaseYear =
        music.length > 0
          ? new Date(
            Math.min(
              ...music.map((track: any) => new Date(track.created_at).getTime())
            )
          ).getFullYear()
          : 0

      setStats({
        totalAlbums: uniqueAlbums,
        totalTracks: music.length,
        firstReleaseYear: oldestReleaseYear,
        totalPlays,
      })

      setTopTracks(sortedByPlays.slice(0, 5))
    } catch (error) {
      toast.error('Failed to load dashboard stats')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      {/* Header */}
      <div className="rounded-xl">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Welcome Back, {currentUser?.name || 'Artist'}!</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <ArtistStatCard
          icon={Disc3}
          label="Albums"
          value={stats.totalAlbums}
          description="Total released"
        />
        <ArtistStatCard
          icon={Music}
          label="Tracks"
          value={stats.totalTracks}
          description="Songs uploaded"
        />
        <ArtistStatCard
          icon={TrendingUp}
          label="Total Plays"
          value={stats.totalPlays}
          description="All-time streams"
        />
        <ArtistStatCard
          icon={Calendar}
          label="First Release"
          value={stats.firstReleaseYear}
          description="Years active"
        />
      </div>

      {/* Performance + Quick Actions */}
      <div className="">
        {/* Top Performing Tracks */}
        <Card className="lg:col-span-2 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Top Performing Tracks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-5">
            {topTracks.length > 0 ? (
              topTracks.map((track, index) => (
                <div
                  key={track.id}
                  className="flex items-center gap-3 sm:gap-4 group"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center font-semibold text-primary text-sm sm:text-base">
                    {index + 1}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium group-hover:text-primary transition text-sm sm:text-base">
                      {track.title}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {track.album_name}
                    </p>

                    {/* <Progress
                      value={
                        (track.plays / stats.totalPlays) * 100 || 0
                      }
                      className="h-2 mt-2"
                    /> */}
                  </div>

                  <div className="text-right">
                    {/* <p className="font-semibold">
                      {track.plays || 0}
                    </p> */}
                    <Badge className={genreColors[track.genre]?.bg + ' ' + genreColors[track.genre]?.text + ' text-xs sm:text-sm'} variant="outline">
                      {track.genre}

                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">
                No performance data yet
              </p>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}