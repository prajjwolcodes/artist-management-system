'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Pagination } from '@/lib/types';

interface PaginationControlsProps {
  pagination: Pagination;
  pathName?: string;
}

export function PaginationControls({ pagination, pathName }: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`${pathName}?${params.toString()}`);
  };

  const handleLimitChange = (newLimit: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('limit', newLimit.toString());
    params.set('page', '1');
    router.push(`${pathName}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between gap-6 rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
          {pagination.total} items
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={!pagination.hasPrevPage}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="text-sm font-medium">
          Page {pagination.page} of {pagination.totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={!pagination.hasNextPage}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <select
        value={pagination.limit}
        onChange={(e) => handleLimitChange(parseInt(e.target.value))}
        className="rounded border border-border bg-background px-3 py-1 text-sm"
      >
        <option value="5">5 per page</option>
        <option value="10">10 per page</option>
        <option value="25">25 per page</option>
        <option value="50">50 per page</option>
      </select>
    </div>
  );
}
