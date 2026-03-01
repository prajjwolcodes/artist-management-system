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
import { toast } from 'sonner';

const createManagerSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type CreateManagerFormData = z.infer<typeof createManagerSchema>;

interface CreateManagerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateManager: (email: string) => void;
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
      await onCreateManager(data.email);
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
      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-md p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Create Manager</DialogTitle>
          <DialogDescription>
            Send an invite link to create a manager account
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? 'Sending...' : 'Send Invite'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
