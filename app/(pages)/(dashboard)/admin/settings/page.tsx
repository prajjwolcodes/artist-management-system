'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: 'Music Management Platform',
    maxUploadSize: '100',
    maintenanceMode: false,
  });

  const handleChange = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    // Simulate saving settings
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage platform settings and configuration</p>
      </div>

      <Card className="rounded-2xl border border-border bg-card p-6 shadow-sm max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium">Site Name</label>
            <Input
              value={settings.siteName}
              onChange={(e) => handleChange('siteName', e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Max Upload Size (MB)</label>
            <Input
              type="number"
              value={settings.maxUploadSize}
              onChange={(e) => handleChange('maxUploadSize', e.target.value)}
              className="mt-2"
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <div>
              <label className="text-sm font-medium">Maintenance Mode</label>
              <p className="mt-1 text-xs text-muted-foreground">
                Enable to temporarily disable the platform
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
              className="h-4 w-4"
            />
          </div>

          <div className="border-t border-border pt-6 flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleSave}>Save Settings</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
