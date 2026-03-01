"use client";

import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const LogoutButton = () => {
    const { logout } = useAuth();
    const router = useRouter();

    function handleLogout() {
        logout();
        toast.success('Logout successful');
        router.push('/login');
    }

    return (
        <Button
            onClick={handleLogout}
            variant="outline"
            className="flex justify-start items-center px-4 py-5 rounded-lg transition-colors text-sm font-medium text-muted-foreground hover:bg-gray-800  hover:text-gray-100 mt-auto cursor-pointer w-full "
        >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
        </Button>
    )
}

export default LogoutButton