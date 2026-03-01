import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronRight,
  Mic2,
  Music,
  Play,
  PlusCircle,
  TrendingUp,
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
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="bg-primary p-1.5 rounded-lg text-primary-foreground">
              <Music size={24} />
            </div>
            <span>VibeStudio</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#artists" className="hover:text-primary transition-colors">For Artists</Link>
            <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">Log in</Button>
            <Button size="sm">Start Creating</Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* --- Hero Section --- */}
        <section className="relative py-24 md:py-32 overflow-hidden border-b">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <Badge variant="outline" className="mb-4 px-3 py-1 text-sm">
                Built for Independent Creators
              </Badge>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Create Your Identity. <br />
                <span className="text-primary">Release Your Sound.</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
                The all-in-one platform where artists can build their brand from scratch,
                manage multiple artist profiles, and distribute music directly to the world.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-12 px-8 text-md font-semibold">
                  Create Artist Profile <PlusCircle className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 text-md font-semibold">
                  Upload Music <Upload className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
          {/* Abstract background element */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 transform origin-top-right hidden lg:block" />
        </section>

        {/* --- Key Features --- */}
        <section id="features" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">Everything an Artist Needs</h2>
              <p className="text-muted-foreground">From the first profile setup to your first million streams, we handle the infrastructure so you can handle the music.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-none shadow-sm bg-background">
                <CardHeader>
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center text-primary mb-4">
                    <Mic2 size={24} />
                  </div>
                  <CardTitle>Manage Artist Profiles</CardTitle>
                  <CardDescription>
                    Create and customize professional artist identities with bios, photos, and links.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-none shadow-sm bg-background">
                <CardHeader>
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center text-primary mb-4">
                    <Music size={24} />
                  </div>
                  <CardTitle>Seamless Music Upload</CardTitle>
                  <CardDescription>
                    Drag and drop your tracks. We support high-fidelity formats and automatic metadata tagging.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-none shadow-sm bg-background">
                <CardHeader>
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center text-primary mb-4">
                    <TrendingUp size={24} />
                  </div>
                  <CardTitle>Deep Analytics</CardTitle>
                  <CardDescription>
                    Track your growth with real-time data on streams, listener demographics, and regional trends.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* --- Artist "Create" Call to Action --- */}
        <section className="py-24 border-y">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold tracking-tight">One Artist, Endless Music.</h2>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="bg-primary/10 p-2 rounded-md h-fit">
                      <PlusCircle className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Step 1: Create your Artist</h4>
                      <p className="text-muted-foreground text-sm">Set up your stage name, genre, and visuals in seconds.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-primary/10 p-2 rounded-md h-fit">
                      <Upload className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Step 2: Create your Music</h4>
                      <p className="text-muted-foreground text-sm">Upload singles, EPs, or albums with full creative control.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-primary/10 p-2 rounded-md h-fit">
                      <Users className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Step 3: Build your Fanbase</h4>
                      <p className="text-muted-foreground text-sm">Share your profile and let fans listen directly on VibeStudio.</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full sm:w-auto px-10">Get Started Now</Button>
              </div>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-background border rounded-2xl p-8 shadow-2xl overflow-hidden">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-zinc-800 animate-pulse" />
                      <div className="space-y-1">
                        <div className="w-24 h-4 bg-zinc-800 rounded animate-pulse" />
                        <div className="w-16 h-3 bg-zinc-800 rounded animate-pulse" />
                      </div>
                    </div>
                    <Badge variant="secondary">Live Preview</Badge>
                  </div>
                  <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center border-dashed border-2">
                    <Music className="text-muted-foreground/30 h-16 w-16" />
                  </div>
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
              <Button variant="ghost" className="hidden sm:flex">View All <ChevronRight size={16} /></Button>
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
                  <p className="text-xs text-muted-foreground text-center">Electronic / Pop</p>
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
                <span>VibeStudio</span>
              </div>
              <p className="text-sm text-muted-foreground">The platform designed for the modern independent musician. Own your profile, own your music.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-widest">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Upload Music</Link></li>
                <li><Link href="#" className="hover:text-foreground">Artist Dashboard</Link></li>
                <li><Link href="#" className="hover:text-foreground">Analytics</Link></li>
                <li><Link href="#" className="hover:text-foreground">Royalties</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-widest">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Artist Help Center</Link></li>
                <li><Link href="#" className="hover:text-foreground">Mastering Guide</Link></li>
                <li><Link href="#" className="hover:text-foreground">Copyright 101</Link></li>
                <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
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
            <p>© 2024 VibeStudio. All rights reserved.</p>
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