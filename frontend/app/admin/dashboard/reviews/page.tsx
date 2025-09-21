import { Suspense } from 'react';
import { getReviewsServer } from '../lib/server-api';
import ReviewsClient from './components/reviews-client';

// Loading component
function ReviewsLoading() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48" />
      </div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}

// Server component for reviews content
async function ReviewsContent() {
  const reviews = await getReviewsServer();
  return <ReviewsClient initialReviews={reviews} />;
}

export default function ReviewsPage() {
  return (
    <Suspense fallback={<ReviewsLoading />}>
      <ReviewsContent />
    </Suspense>
  );
}
