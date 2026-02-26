'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import Link from 'next/link';
import { Music } from 'lucide-react';
import { UserProfile } from '@/lib/types';

export default function ActivateAccountPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<UserProfile>({
        first_name: '',
        last_name: '',
        email: '',
        dob: '',
        gender: undefined,
        address: '',
        phone: undefined,
        password: '',
        confirmPassword: '',

    });

    const { register } = useAuth();
    const router = useRouter();

    const handleInputChange = (field: keyof UserProfile, value: string | number | undefined) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (
            !formData.first_name ||
            !formData.last_name ||
            !formData.email ||
            !formData.dob ||
            !formData.gender ||
            !formData.address
        ) {
            toast.error('Please fill in all required fields');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            await register(formData)
            console.log(formData)
            toast.success('Account created successfully!');
            router.push('/login');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
            <div className="w-full max-w-md space-y-8">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2">
                    <Music className="w-8 h-8 text-primary" />
                    <h1 className="text-2xl font-bold">MusicHub</h1>
                </div>

                {/* Card */}
                <Card className="border border-border bg-card">
                    <CardHeader>
                        <CardTitle>Register Your Account</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="first_name" className="text-sm font-medium">
                                        First Name
                                    </label>
                                    <Input
                                        id="first_name"
                                        placeholder="Ram"
                                        value={formData.first_name}
                                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="last_name" className="text-sm font-medium">
                                        Last Name
                                    </label>
                                    <Input
                                        id="last_name"
                                        placeholder="Thapa"
                                        value={formData.last_name}
                                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="ram@example.com"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="dob" className="text-sm font-medium">
                                    Date of Birth
                                </label>
                                <Input
                                    id="dob"
                                    type="date"
                                    value={formData.dob || ''}
                                    onChange={(e) => handleInputChange('dob', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex justify-between items-center w-full ">
                                <div className="w-1/2 pr-4">
                                    <label htmlFor="gender" className="text-sm font-medium">
                                        Gender
                                    </label>
                                    <Select
                                        value={formData.gender || ''}
                                        onValueChange={(value) =>
                                            handleInputChange('gender', value as any)
                                        }
                                    >
                                        <SelectTrigger>
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
                                    <label htmlFor="phone" className="text-sm font-medium">
                                        Phone
                                    </label>
                                    <Input
                                        id="phone"
                                        placeholder="9812345678"
                                        value={formData.phone || ''}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        required
                                    />
                                </div>

                            </div>

                            <div className="space-y-2">
                                <label htmlFor="address" className="text-sm font-medium">
                                    Address
                                </label>
                                <Input
                                    id="address"
                                    placeholder="Khalpitar, Balkot"
                                    value={formData.address}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    required
                                />
                            </div>



                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium">
                                    Password
                                </label>
                                <Input
                                    id="password"
                                    placeholder="Enter your password"
                                    type="password"
                                    value={formData.password || ''}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    required
                                />
                            </div>


                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="text-sm font-medium">
                                    Confirm Password
                                </label>
                                <Input
                                    id="confirmPassword"
                                    placeholder="Confirm your password"
                                    type="password"
                                    value={formData.confirmPassword || ''}
                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                    required
                                />
                            </div>



                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary hover:bg-primary/90 mt-6"
                            >
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Sign In Link */}
                <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary hover:underline font-medium">
                        Sign in
                    </Link>
                </p>
            </div >
        </div >
    );
}
