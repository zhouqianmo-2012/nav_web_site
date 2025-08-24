import { Suspense } from 'react';
import { HomePage } from '@/components/home/HomePage';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function Home() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HomePage />
    </Suspense>
  );
}
