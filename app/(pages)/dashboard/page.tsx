'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import LogoutButton from '@/components/LogoutButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Music } from 'lucide-react';
import { useEffect } from 'react';
import { getDashboardRoute } from '@/helpers/route-protection';

export default function ManagerDashboard() {
    const { currentUser, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        if (!currentUser) {
            router.push('/login');
        } else if (currentUser.role !== 'super_admin') {
            router.push(getDashboardRoute(currentUser.role));
        }
    }, [currentUser, isLoading, router]);

    if (!currentUser) {
        console.log(currentUser)
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Music className="w-8 h-8 text-primary" />
                        <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
                    </div>
                    <LogoutButton />
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
                            This is your super admin dashboard where you can manage all aspects of the system.
                        </p>
                        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        </div> */}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
