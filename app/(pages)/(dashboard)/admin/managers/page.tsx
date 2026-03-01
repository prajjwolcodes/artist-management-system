'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PaginationControls } from '@/components/pagination/pagination-controls';
import { ManagerTable } from '@/components/admin/manager-table';
import { CreateManagerModal } from '@/components/admin/create-manager-modal';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/lib/types';

export default function ManagersPage() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const [managers, setManagers] = useState<(User & { password?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isResending, setIsResending] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  useEffect(() => {
    fetchManagers();
  }, [page, limit]);

  const fetchManagers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users?page=${page}&limit=${limit}`);

      if (!response.ok) throw new Error('Failed to fetch managers');

      const data = await response.json();

      // Filter only managers (artist_manager role)
      const managersData = data.users
        .filter((u: any) => u.role === 'artist_manager')
        .map((manager: any) => ({
          id: manager.id,
          email: manager.email,
          name: `${manager.first_name || 'Not'} ${manager.last_name || 'Activated'}`.trim(),
          role: manager.role,
          is_active: manager.is_active,
          profile: {
            first_name: manager.first_name,
            last_name: manager.last_name,
            email: manager.email,
          },
        }));

      setManagers(managersData);

      // Adjust pagination for filtered managers
      setPagination({
        ...data.pagination,
        total: managersData.length,
        totalPages: Math.ceil(managersData.length / limit),
      });
    } catch (error) {
      console.error('Error fetching managers:', error);
      toast.error('Failed to load managers');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateManager = async (email: string) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          role: 'artist_manager',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create manager');
      }

      setIsCreateModalOpen(false);
      toast.success('Manager created successfully. Activation email sent.');

      // Refresh the managers list
      fetchManagers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create manager');
      console.error(error);
    }
  };

  const handleDeleteManager = async (managerId: string) => {
    try {
      const response = await fetch(`/api/users/${managerId}`, {
        method: 'DELETE',
      });

      console.log(response)
      if (!response.ok) throw new Error(response.status === 409 ? 'Cannot delete manager assigned to artists.' : 'Failed to delete manager');

      toast.success('Manager deleted successfully');

      // Refresh the managers list
      fetchManagers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete manager');
      console.log(error);
    }
  };

  const handleResendActivation = async (manager: User & { password?: string; is_active?: boolean }) => {
    setIsResending(manager.id);
    try {
      const response = await fetch('/api/users/resend-activation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: manager.email }),
      });

      const data = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend activation link');
      }

      toast.success(data.message || 'Activation link sent successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to resend activation link');
    } finally {
      setIsResending(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Managers</h1>
          <p className="mt-1 text-sm sm:text-base text-muted-foreground">Create and manage artist managers</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Create Manager
        </Button>
      </div>

      <Card className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">

        <ManagerTable
          managers={managers}
          onDelete={handleDeleteManager}
          onResendActivation={handleResendActivation}
          isResending={isResending}
        />
      </Card>

      {pagination.totalPages > 1 && (
        <PaginationControls
          pagination={pagination}
          pathName="/admin/managers"
        />
      )}

      <CreateManagerModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreateManager={handleCreateManager}
      />
    </div>
  );
}
