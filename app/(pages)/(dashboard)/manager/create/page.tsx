'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';
import { Label } from '@/components/ui/label';

export default function CreateArtistPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', displayName: '' });
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [showCsvWarning, setShowCsvWarning] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.displayName) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.displayName,
        }),
      });

      const data = (await res.json()) as { message?: string; error?: string };

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create artist');
      }

      toast.success(data.message || 'Artist created successfully. Invitation email sent.');
      setFormData({ email: '', displayName: '' });
      router.push('/manager/artists');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create artist');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCsvFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
    }
  };

  const parseCsvFile = async (file: File): Promise<Array<{ name: string; email: string }>> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const csv = event.target?.result as string;
          const lines = csv.trim().split('\n');

          if (lines.length < 2) {
            reject(new Error('CSV file must contain at least a header row and one data row'));
            return;
          }

          const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
          const nameIndex = headers.findIndex(h => h === 'name' || h === 'displayname' || h === 'display name');
          const emailIndex = headers.findIndex(h => h === 'email');

          if (nameIndex === -1 || emailIndex === -1) {
            reject(new Error('CSV must contain "name" and "email" columns'));
            return;
          }

          const artists: Array<{ name: string; email: string }> = [];
          const errors: string[] = [];

          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue; // Skip empty lines

            const values = line.split(',').map(v => v.trim());
            const name = values[nameIndex];
            const email = values[emailIndex];

            if (!name || !email) {
              errors.push(`Row ${i + 1}: Missing name or email`);
              continue;
            }

            if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
              errors.push(`Row ${i + 1}: Invalid email format (${email})`);
              continue;
            }

            artists.push({ name, email });
          }

          if (artists.length === 0) {
            reject(new Error('No valid artist entries found in CSV'));
            return;
          }

          if (errors.length > 0) {
            console.warn('CSV parsing warnings:', errors);
            toast.warning(`${errors.length} row(s) skipped due to errors`);
          }

          resolve(artists);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read CSV file'));
      reader.readAsText(file);
    });
  };

  const handleBulkUpload = async () => {
    if (!csvFile) {
      toast.error('Please select a CSV file');
      return;
    }

    setIsBulkUploading(true);
    setShowCsvWarning(false);

    try {
      const artists = await parseCsvFile(csvFile);

      const successCount = { value: 0 };
      const failedCount = { value: 0 };
      const failedArtists: string[] = [];

      for (const artist of artists) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: artist.email,
              name: artist.name,
            }),
          });

          const data = (await res.json()) as { message?: string; error?: string };

          if (!res.ok) {
            failedCount.value++;
            failedArtists.push(`${artist.name} (${artist.email}): ${data.error || 'Unknown error'}`);
          } else {
            successCount.value++;
          }
        } catch (error) {
          failedCount.value++;
          failedArtists.push(`${artist.name} (${artist.email}): ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setCsvFile(null);

      // Show summary
      if (successCount.value > 0) {
        toast.success(`Successfully invited ${successCount.value} artist(s)`);
      }

      if (failedCount.value > 0) {
        const errorMessage = failedArtists.slice(0, 3).join('\n') +
          (failedArtists.length > 3 ? `\n... and ${failedArtists.length - 3} more` : '');
        toast.error(`Failed to invite ${failedCount.value} artist(s):\n${errorMessage}`);
      }

      // Refresh if any succeeded
      if (successCount.value > 0) {
        router.push('/manager/artists');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to process CSV file');
    } finally {
      setIsBulkUploading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header with Import Button */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create Artist</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">Invite a new artist and send activation</p>
        </div>
        <Button
          onClick={() => {
            setCsvFile(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
            setShowCsvWarning(true);
          }}
          className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
        >
          Import CSV
        </Button>
      </div>

      {/* Manual Form Card */}
      <Card className="bg-card border border-border max-w-2xl w-full">
        <CardHeader>
          <CardTitle>Artist Invitation</CardTitle>
          <CardDescription>Enter artist name and email to send invite link</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="displayName">Name *</Label>
              <Input
                id="displayName"
                placeholder="Artist Name"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="artist@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
              >
                {isLoading ? 'Sending Invite...' : 'Send Invite'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setFormData({ email: '', displayName: '' })} className="w-full sm:w-auto">
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* CSV Import Card */}
      <Dialog open={showCsvModal} onOpenChange={setShowCsvModal}>
        <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-md p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Bulk Import Artists</DialogTitle>
            <DialogDescription>Upload a CSV file to invite multiple artists at once</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Yellow Warning Box */}
            <div className="flex items-start gap-3 bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded border border-yellow-300 dark:border-yellow-700">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                CSV must contain columns: <strong>name</strong> and <strong>email</strong>
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="csvFile" className="text-sm font-medium">
                CSV File *
              </label>
              <Input
                ref={fileInputRef}
                id="csvFile"
                type="file"
                accept=".csv"
                onChange={handleCsvFileSelect}
                disabled={isBulkUploading}
                className="cursor-pointer"
              />
            </div>

            {csvFile && (
              <div className="text-sm text-muted-foreground bg-secondary p-2 rounded">
                Selected: {csvFile.name}
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCsvModal(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleBulkUpload}
                disabled={!csvFile || isBulkUploading}
                className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
              >
                {isBulkUploading ? 'Uploading...' : 'Upload CSV'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* CSV Warning Dialog */}
      <AlertDialog open={showCsvWarning} onOpenChange={setShowCsvWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>CSV Import Requirements</AlertDialogTitle>
            <AlertDialogDescription asChild className="space-y-3 mt-4">
              <div>
                <div>
                  <p className="font-semibold text-foreground mb-2">Your CSV file must contain:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>name</strong> – Artist name (required)</li>
                    <li><strong>email</strong> – Valid email address (required)</li>
                  </ul>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded text-sm">
                  <p className="text-amber-900 dark:text-amber-100">
                    ⚠️ <strong>Note:</strong> Empty rows and invalid email formats will be skipped. You'll receive a summary of successful and failed invitations.
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Example CSV format:
                </p>
                <pre className="bg-muted p-2 rounded text-xs overflow-auto">
                  {`name,email
Prajjwol Shrestha,prajjwol@example.com
Ram Thapa,thaparam@example.com`}
                </pre>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => setShowCsvModal(true)} disabled={isBulkUploading}>
              {isBulkUploading ? 'Processing...' : 'Continue'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
