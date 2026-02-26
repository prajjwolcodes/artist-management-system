"use client";

import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

const LogoutButton = () => {
    const { logout } = useAuth();
    const router = useRouter();

    function handleLogout() {
        logout();
        toast.success('Logout successful');
        router.push('/login');
    }

    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default LogoutButton