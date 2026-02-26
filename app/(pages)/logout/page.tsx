"use client";

import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import React from 'react'

const page = () => {
    const { logout } = useAuth();

    function handleLogout() {
        logout();
        toast.success('Logout successful');
    }

    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default page