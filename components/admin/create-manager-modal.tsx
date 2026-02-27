'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User } from '@/lib/types';
import { toast } from 'sonner';

const createManagerSchema = z
  .object({
    displayName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type CreateManagerFormData = z.infer<typeof createManagerSchema>;

interface CreateManagerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateManager: (manager: User & { password: string }) => void;
}

export function CreateManagerModal({
  open,
  onOpenChange,
  onCreateManager,
}: CreateManagerModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateManagerFormData>({
    resolver: zodResolver(createManagerSchema),
  });

  const onSubmit = async (data: CreateManagerFormData) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const [firstName, ...lastNameParts] = data.displayName.split(' ');
      const lastName = lastNameParts.join(' ') || '';

      const newManager: User & { password: string } = {
        id: `user-manager-${Date.now()}`,
        email: data.email,
        name: data.displayName,
        role: 'manager',
        password: data.password,
        profile: {
          firstName,
          lastName,
          email: data.email,
        },
      };

      onCreateManager(newManager);
      reset();
    } catch (error) {
      toast.error('Failed to create manager');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Manager</DialogTitle>
          <DialogDescription>
            Add a new artist manager to the system
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Display Name</label>
            <Input
              placeholder="John Doe"
              {...register('displayName')}
              className="mt-1"
            />
            {errors.displayName && (
              <p className="mt-1 text-sm text-destructive">{errors.displayName.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="manager@example.com"
              {...register('email')}
              className="mt-1"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className="mt-1"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Confirm Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword')}
              className="mt-1"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Manager'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
