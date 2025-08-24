import { Suspense } from 'react';
import { UploadPage } from '@/components/upload/UploadPage';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function Upload() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <UploadPage />
    </Suspense>
  );
}
