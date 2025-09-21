export default function DashboardLoading() {
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48" />
        <div className="h-6 bg-gray-100 rounded animate-pulse w-32" />
      </div>
      
      {/* Stats Grid Loading */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-1" />
            <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
          </div>
        ))}
      </div>

      {/* Recent Activity Loading */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-4">
        <div className="col-span-3 border rounded-lg p-6">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mb-4" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                </div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="border rounded-lg p-6">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-24 mb-4" />
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}