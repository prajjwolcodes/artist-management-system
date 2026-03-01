'use client';

import { User } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, RefreshCw } from 'lucide-react';

interface ManagerTableProps {
  managers: (User & { password?: string; is_active?: boolean })[];
  onDelete: (managerId: string) => void;
  onResendActivation: (manager: User & { password?: string; is_active?: boolean }) => void;
  isResending: string | null;
}

export function ManagerTable({ managers, onDelete, onResendActivation, isResending }: ManagerTableProps) {
  const getStatusColor = (isActive?: boolean) => {
    if (isActive) {
      return 'bg-green-500/10 text-green-700 dark:text-green-400';
    }

    return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {managers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No managers found
              </TableCell>
            </TableRow>
          ) : (
            managers.map((manager) => (
              <TableRow key={manager.id}>
                <TableCell className="font-medium">{manager.name}</TableCell>
                <TableCell>{manager.email}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{manager.id}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(manager.is_active)} variant="outline">
                    {manager.is_active ? 'Active' : 'Pending'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {!manager.is_active && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-xs"
                        disabled={isResending === manager.id}
                        onClick={() => onResendActivation(manager)}
                        title="Resend activation link"
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        {isResending === manager.id ? 'Sending...' : 'Resend'}
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogTitle>Delete Manager</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {manager.name}? This action cannot be
                          undone.
                        </AlertDialogDescription>
                        <div className="flex gap-2 justify-end">
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(manager.id)}
                            className="bg-destructive text-destructive-foreground"
                          >
                            Delete
                          </AlertDialogAction>
                        </div>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
