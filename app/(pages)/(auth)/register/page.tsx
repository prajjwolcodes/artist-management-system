'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Music, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface RegisterForm {
    first_name: string;
    last_name: string;
    email: string;
    dob: string;
    gender?: string;
    address: string;
    phone?: string;
    password: string;
    confirmPassword: string;
}

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [adminExists, setAdminExists] = useState<boolean | null>(null);

    const router = useRouter();

    const [formData, setFormData] = useState<RegisterForm>({
        first_name: '',
        last_name: '',
        email: '',
        dob: '',
        gender: undefined,
        address: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const handleInputChange = (
        field: keyof RegisterForm,
        value: string | undefined
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // ✅ Check if super_admin already exists
    useEffect(() => {
        async function checkAdminExists() {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/check-admin`
                );
                const data = await res.json();
                setAdminExists(data.exists);
            } catch (error) {
                toast.error('Failed to check system status');
                console.log(error)
                setAdminExists(true); // safer default
            }
        }
        checkAdminExists();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !formData.first_name ||
            !formData.last_name ||
            !formData.email ||
            !formData.dob ||
            !formData.gender ||
            !formData.address ||
            !formData.password
        ) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            setIsLoading(true);

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                }
            );

            if (!res.ok) {
                const data = await res.json();
                // If registration is closed, refresh the admin check
                if (res.status === 403) {
                    setAdminExists(true);
                    toast.error('Registration is closed. Use test credentials below.');
                } else {
                    throw new Error(data.error || 'Registration failed');
                }
                return;
            }

            toast.success('Super Admin account created successfully!');
            router.push('/login');
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : 'Registration failed'
            );
        } finally {
            setIsLoading(false);
        }
    };

    // 🔄 Loading state while checking
    if (adminExists === null) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Checking system status...</p>
            </div>
        );
    }

    // 🚫 Registration Closed UI
    if (adminExists) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
                <Card className="w-full max-w-md text-center border border-border bg-card">
                    <CardHeader>
                        <div className="flex justify-center mb-2">
                            <ShieldAlert className="w-8 h-8 text-destructive" />
                        </div>
                        <CardTitle className="text-xl">
                            Registration is Closed
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground text-sm mb-8">
                            You must be invited by an administrator to create an account.
                        </p>



                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">
                                    Demo Access
                                </span>
                            </div>
                        </div>

                        {/* Test Credentials */}
                        <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Email</span>
                                <span className="font-mono">{process.env.NEXT_PUBLIC_DEMO_EMAIL}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Password</span>
                                <span className="font-mono">{process.env.NEXT_PUBLIC_DEMO_PASSWORD}</span>
                            </div>
                        </div>


                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">
                                    OR
                                </span>
                            </div>
                        </div>
                        <Button asChild className="w-full">
                            <Link href="/login">Go to Login</Link>
                        </Button>

                    </CardContent>
                </Card>
            </div>
        );
    }

    // ✅ Normal Registration Form (only when no super_admin exists)
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
            <div className="w-full max-w-lg space-y-8">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2">
                    <Music className="w-8 h-8 text-primary" />
                    <h1 className="text-3xl font-bold">Cloco Music</h1>
                </div>

                <Card className="border border-border bg-card">
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Create Admin Account
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* First + Last Name */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first_name">First Name</Label>
                                    <Input
                                        id="first_name"
                                        value={formData.first_name}
                                        placeholder='Ram'
                                        onChange={(e) =>
                                            handleInputChange('first_name', e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="last_name">Last Name</Label>
                                    <Input
                                        id="last_name"
                                        value={formData.last_name}
                                        placeholder='Shrestha'
                                        onChange={(e) =>
                                            handleInputChange('last_name', e.target.value)
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="ramshhh@gmail.com"
                                    value={formData.email}
                                    onChange={(e) =>
                                        handleInputChange('email', e.target.value)
                                    }
                                    required
                                />
                            </div>

                            {/* DOB */}
                            <div className="space-y-2">
                                <Label htmlFor="dob">Date of Birth</Label>
                                <Input
                                    id="dob"
                                    type="date"
                                    value={formData.dob}
                                    onChange={(e) =>
                                        handleInputChange('dob', e.target.value)
                                    }
                                    required
                                />
                            </div>

                            {/* Gender + Phone */}
                            <div className="grid grid-cols-2 gap-4 w-full">
                                <div className="space-y-2 w-full">
                                    <Label>Gender</Label>
                                    <Select
                                        onValueChange={(value) =>
                                            handleInputChange('gender', value)
                                        }
                                    >
                                        <SelectTrigger className='w-full border-border'>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="m">Male</SelectItem>
                                            <SelectItem value="f">Female</SelectItem>
                                            <SelectItem value="o">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        placeholder="9841234567"
                                        onChange={(e) =>
                                            handleInputChange('phone', e.target.value)
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    value={formData.address}
                                    placeholder="Khalpitar, Balkot"
                                    onChange={(e) =>
                                        handleInputChange('address', e.target.value)
                                    }
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={(e) =>
                                        handleInputChange('password', e.target.value)
                                    }
                                    required
                                />
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={(e) =>
                                        handleInputChange('confirmPassword', e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </Button>

                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}