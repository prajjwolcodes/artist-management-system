'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { UserProfile } from '@/lib/types';

export default function ArtistProfilePage() {
  const { currentUser, updateProfile, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(
    currentUser?.profile || {
      first_name: '',
      last_name: '',
      email: '',
      dob: '',
      gender: undefined,
      address: '',
      first_release_year: undefined,
      no_of_albums_released: undefined,
    }
  );

  const isProfileIncomplete =
    !formData.first_name ||
    !formData.last_name ||
    !formData.email ||
    !formData.dob ||
    !formData.gender ||
    !formData.address;

  const handleInputChange = (field: keyof UserProfile, value: string | number | undefined) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isProfileIncomplete) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground mt-2">Edit your artist information</p>
      </div>

      {/* Incomplete Profile Warning */}
      {isProfileIncomplete && (
        <Alert className="border-yellow-500/50 bg-yellow-500/10">
          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          <AlertDescription className="text-yellow-700 dark:text-yellow-400">
            Your profile is incomplete. Please fill in all required fields to ensure a complete profile.
          </AlertDescription>
        </Alert>
      )}

      {/* Profile Form */}
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your artist profile details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name *</label>
                <Input
                  placeholder="John"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name *</label>
                <Input
                  placeholder="Doe"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email *</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date of Birth *</label>
              <Input
                type="date"
                value={formData.dob || ''}
                onChange={(e) => handleInputChange('dob', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Gender *</label>
              <Select
                value={formData.gender || ''}
                onValueChange={(value) => handleInputChange('gender', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Address *</label>
              <Input
                placeholder="123 Music Lane, Nashville, TN"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Release Year</label>
                <Input
                  type="number"
                  placeholder="2020"
                  value={formData.first_release_year || ''}
                  onChange={(e) =>
                    handleInputChange('first_release_year', e.target.value ? parseInt(e.target.value) : undefined)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Number of Albums</label>
                <Input
                  type="number"
                  placeholder="3"
                  value={formData.no_of_albums_released || ''}
                  onChange={(e) =>
                    handleInputChange('no_of_albums_released', e.target.value ? parseInt(e.target.value) : undefined)
                  }
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || authLoading}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isLoading ? 'Saving...' : 'Save Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
