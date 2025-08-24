import { Suspense } from 'react';
import { SettingsPage } from '@/components/settings/SettingsPage';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function Settings() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SettingsPage />
    </Suspense>
  );
}
