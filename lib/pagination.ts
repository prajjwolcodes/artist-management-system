import { Pagination, PaginatedResponse } from './types';

export function paginateArray<T>(
  items: T[],
  page: number = 1,
  limit: number = 10
): PaginatedResponse<T> {
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  
  // Ensure page is within valid range
  const validPage = Math.max(1, Math.min(page, totalPages || 1));
  
  const startIndex = (validPage - 1) * limit;
  const endIndex = startIndex + limit;
  
  const rows = items.slice(startIndex, endIndex);
  
  const pagination: Pagination = {
    page: validPage,
    limit,
    total,
    totalPages,
    hasNextPage: validPage < totalPages,
    hasPrevPage: validPage > 1,
  };
  
  return {
    rows,
    pagination,
  };
}

export function getPaginationParams(
  searchParams: Record<string, string | string[] | undefined>
): { page: number; limit: number } {
  const page = Math.max(1, parseInt(searchParams.page as string) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.limit as string) || 10));
  
  return { page, limit };
}
