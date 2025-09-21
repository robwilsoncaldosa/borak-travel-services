export default function PackagesLoading() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48" />
        <div className="h-10 bg-gray-200 rounded animate-pulse w-32" />
      </div>
      <div className="space-y-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}