'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Music } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface ActivateFormState {
    name: string;
    dob: string;
    gender: 'm' | 'f' | 'o' | '';
    address: string;
    password: string;
    confirmPassword: string;
}

export default function ActivateAccountPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { logout } = useAuth();
    const token = useMemo(() => searchParams.get('token') || '', [searchParams]);

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<ActivateFormState>({
        name: "",
        dob: "",
        gender: '',
        address: "",
        password: '',
        confirmPassword: '',
    });

    const handleInputChange = (field: keyof ActivateFormState, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        logout(); // Ensure any existing session is cleared before activation

        if (!token) {
            toast.error('Invalid or missing activation token');
            return;
        }

        if (
            !formData.name ||
            !formData.dob ||
            !formData.gender ||
            !formData.address

        ) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/artist/activate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    name: formData.name,
                    dob: formData.dob,
                    gender: formData.gender,
                    address: formData.address,
                    password: formData.password,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Activation failed');
            }

            toast.success('Account activated successfully. Please sign in.');
            router.push('/login');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Activation failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
            <div className="w-full max-w-md space-y-8">
                <div className="flex items-center justify-center gap-2">
                    <Music className="w-8 h-8 text-primary" />
                    <h1 className="text-2xl font-bold">Cloco Music</h1>
                </div>

                <Card className="border border-border bg-card">
                    <CardHeader>
                        <CardTitle>Complete Your Artist Account</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="first_name" className="text-sm font-medium">
                                    Full Name
                                </label>
                                <Input
                                    id="name"
                                    placeholder="Ram Thapa"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
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
                                    value={formData.dob}
                                    onChange={(e) => handleInputChange('dob', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="w-1/2 pr-4">
                                <label htmlFor="gender" className="text-sm font-medium">
                                    Gender
                                </label>
                                <Select
                                    value={formData.gender}
                                    onValueChange={(value) => handleInputChange('gender', value)}
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
                                    value={formData.password}
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
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary hover:bg-primary/90 mt-6"
                            >
                                {isLoading ? 'Activating...' : 'Activate Account'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div >
    );
}
