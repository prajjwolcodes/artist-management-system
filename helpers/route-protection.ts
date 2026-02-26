import { UserRole } from '@/lib/types';

export function getDashboardRoute(role: UserRole): string {
    switch (role) {
        case 'super_admin':
            return '/dashboard';
        case 'artist_manager':
            return '/manager';
        case 'artist':
            return '/artist';
        default:
            return '/login';
    }
}
export function hasAccessToRoute(role: UserRole, pathname: string): boolean {
    if (pathname === '/dashboard') return role === 'super_admin';
    if (pathname === '/manager') return role === 'artist_manager';
    if (pathname === '/artist') return role === 'artist';
    return false;
}
