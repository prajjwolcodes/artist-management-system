import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Music,
  Play,
  PlusCircle,
  Upload,
  Users
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from "@/components/ui/badge";

export default function MusicLandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* --- Navigation --- */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-18  flex items-center justify-between">
          <div className="flex items-center gap-4 font-bold text-xl tracking-tight">
            <div className="bg-primary p-1.5 rounded-lg text-primary-foreground">
              <Music size={24} />
            </div>
            <span>Cloco Music</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:inline-block">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/register" className="inline-block">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* --- Hero Section --- */}
        <section className="relative h-[calc(100vh-5rem)] overflow-hidden border-b flex items-center justify-start">
          {/* Subtle background decoration */}
          <div className="absolute inset-0 bg-primary/[0.02]" />
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/[0.05] -skew-x-12 transform origin-top-right hidden lg:block" />
          <div className="container mx-auto px-4 relative z-10 mb-14">
            <div className="max-w-3xl text-center space-y-8">
              {/* Badge */}
              <div className="flex justify-center">
                <Badge variant="outline" className="px-4 py-1.5 text-sm font-medium">
                  For Artists, By Managers
                </Badge>
              </div>

              {/* Main Headline */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl font-extrabold tracking-tighter leading-[1.1]">
                <span className="block text-foreground">Create Your Identity.</span>
                <span className="block text-primary mt-2">Release Your Sound.</span>
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                The all-in-one platform where managers can build their brand from scratch,
                manage multiple artist profiles, and distribute music directly to the world.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" className="h-14 px-14 text-base font-semibold">
                  Create Artist Profile <PlusCircle className="ml-2 h-5 w-5" />
                </Button>
                <Link href="/login" className="inline-block">
                  <Button size="lg" variant="outline" className="h-14 px-14 text-base font-semibold">
                    Upload Music <Upload className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-8 justify-center items-center pt-8 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">
                    <span className="text-foreground font-bold">500+</span> Active Artists
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">
                    <span className="text-foreground font-bold">10K+</span> Tracks Released
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">
                    <span className="text-foreground font-bold">1M+</span> Monthly Streams
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Artist "Create" Call to Action --- */}
        <section className="py-28 border-y">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-[1.3fr_0.7fr] gap-16 items-center">

              {/* LEFT SIDE */}
              <div className="space-y-10">
                <div className="space-y-4">
                  <h2 className="text-5xl font-bold tracking-tight leading-tight">
                    Multiple Artists, Endless Music.
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-xl">
                    Create your identity, publish your sound, and grow your fanbase — all in one place.
                  </p>
                </div>

                <div className="space-y-10">

                  {/* Step 1 */}
                  <div className="flex gap-5">
                    <div className="bg-primary/10 p-3 rounded-xl h-fit">
                      <PlusCircle className="text-primary w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-semibold">
                        Step 1: Create your Artist
                      </h4>
                      <p className="text-muted-foreground">
                        Set up your stage name, genre, bio, and visuals in seconds.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-5">
                    <div className="bg-primary/10 p-3 rounded-xl h-fit">
                      <Upload className="text-primary w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-semibold">
                        Step 2: Upload your Music
                      </h4>
                      <p className="text-muted-foreground">
                        Release singles, EPs, or full albums with full creative control.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-5">
                    <div className="bg-primary/10 p-3 rounded-xl h-fit">
                      <Users className="text-primary w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-semibold">
                        Step 3: Grow your Fanbase
                      </h4>
                      <p className="text-muted-foreground">
                        Share your profile and let fans stream your music instantly.
                      </p>
                    </div>
                  </div>
                </div>

                <Link href="/register" className="inline-block cursor-pointer">
                  <Button size="lg" className="px-10 mt-4">
                    Get Started Now
                  </Button>
                </Link>
              </div>

              {/* RIGHT SIDE */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>

                <div className="relative bg-background border rounded-3xl p-6 shadow-2xl overflow-hidden">

                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 animate-pulse" />
                      <div className="space-y-1">
                        <div className="w-20 h-3 bg-zinc-800 rounded animate-pulse" />
                        <div className="w-14 h-2 bg-zinc-800 rounded animate-pulse" />
                      </div>
                    </div>
                    <Badge variant="secondary">Live Preview</Badge>
                  </div>

                  {/* Music Preview Box */}
                  <div className="aspect-square bg-muted rounded-xl mb-4 flex items-center justify-center border-dashed border-2">
                    <Music className="text-muted-foreground/30 h-14 w-14" />
                  </div>

                  {/* Track Info Skeleton */}
                  <div className="space-y-2">
                    <div className="w-full h-2 bg-muted rounded" />
                    <div className="w-2/3 h-2 bg-muted rounded" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* --- Featured Artists --- */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold">Trending Artists</h2>
                <p className="text-muted-foreground">Discover who's making noise this week.</p>
              </div>
              <Link href="/login" className="hidden sm:block cursor-pointer">
                <Button variant="ghost">View All <ChevronRight size={16} /></Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="aspect-square bg-muted rounded-full mb-3 overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="text-white fill-current" size={32} />
                    </div>
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=artist${i}`}
                      alt="Artist"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="font-semibold text-center group-hover:text-primary transition-colors">Artist Name {i}</p>
                  {i % 2 === 0 && <p className="text-xs text-muted-foreground text-center">Rock / Rnb</p>}
                  {i % 2 !== 0 && i !== 1 && <p className="text-xs text-muted-foreground text-center">Pop / Hip-Hop</p>}
                  {i === 1 && <p className="text-xs text-muted-foreground text-center">Country</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-muted py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 font-bold text-xl mb-4">
                <div className="bg-primary p-1 rounded-md text-primary-foreground">
                  <Music size={20} />
                </div>
                <span>Cloco Music</span>
              </div>
              <p className="text-sm text-muted-foreground">The platform designed for the modern independent musician. Own your profile, own your music.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-widest">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/login" className="hover:text-foreground">Upload Music</Link></li>
                <li><Link href="/login" className="hover:text-foreground">Artist Dashboard</Link></li>
                <li><Link href="/login" className="hover:text-foreground">Analytics</Link></li>
                <li><Link href="/login" className="hover:text-foreground">Royalties</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-widest">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/login" className="hover:text-foreground">Artist Help Center</Link></li>
                <li><Link href="/login" className="hover:text-foreground">Mastering Guide</Link></li>
                <li><Link href="/login" className="hover:text-foreground">Copyright 101</Link></li>
                <li><Link href="/login" className="hover:text-foreground">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-widest">Newsletter</h4>
              <p className="text-sm text-muted-foreground mb-4">Get the latest artist tips and industry updates.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email address"
                  className="bg-background border rounded-md px-3 py-1 text-sm w-full outline-none focus:ring-2 focus:ring-primary/20"
                />
                <Button size="sm">Join</Button>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t flex flex-col md:flex-row justify-between gap-4 text-xs text-muted-foreground">
            <p>© 2026 Cloco Music. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Copyright</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}