import { Suspense } from 'react';
import { getPackagesServer } from '../lib/server-api';
import PackagesClient from './components/packages-client';

// Loading component
function PackagesLoading() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48" />
        <div className="h-10 bg-gray-200 rounded animate-pulse w-32" />
      </div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}

// Server component for packages content
async function PackagesContent() {
  const packages = await getPackagesServer();
  return <PackagesClient initialPackages={packages} />;
}

export default function PackagesPage() {
  return (
    <Suspense fallback={<PackagesLoading />}>
      <PackagesContent />
    </Suspense>
  );
}
