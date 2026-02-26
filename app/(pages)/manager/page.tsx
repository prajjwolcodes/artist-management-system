'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Music } from 'lucide-react';
import { useEffect } from 'react';

export default function ManagerDashboard() {
    const { currentUser, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!currentUser || currentUser.role !== 'manager') {
            router.push('/login');
        }
    }, [currentUser, router]);

    if (!currentUser) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Music className="w-8 h-8 text-primary" />
                        <h1 className="text-2xl font-bold">Manager Dashboard</h1>
                    </div>
                    <Button
                        onClick={() => {
                            logout();
                            router.push('/login');
                        }}
                        variant="outline"
                    >
                        Logout
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Welcome, {currentUser.name}</CardTitle>
                        <CardDescription>Artist Management Portal</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">Email: {currentUser.email}</p>
                        <p className="text-muted-foreground mb-6">
                            This is your manager dashboard where you can manage multiple artists and their music.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="bg-muted">
                                <CardHeader>
                                    <CardTitle className="text-lg">Managed Artists</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-bold text-primary">0</p>
                                    <p className="text-sm text-muted-foreground mt-2">Artists under management</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-muted">
                                <CardHeader>
                                    <CardTitle className="text-lg">Total Tracks</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-bold text-primary">0</p>
                                    <p className="text-sm text-muted-foreground mt-2">Across all artists</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-muted">
                                <CardHeader>
                                    <CardTitle className="text-lg">Active Artists</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-bold text-primary">0</p>
                                    <p className="text-sm text-muted-foreground mt-2">Currently active</p>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
