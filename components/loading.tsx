export default function Loading() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-9 w-64 bg-gray-100 rounded-lg animate-pulse mb-2"></div>
          <div className="h-4 w-48 bg-gray-100 rounded-md animate-pulse"></div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
              {/* Card Header */}
              <div className="p-5 pb-3">
                <div className="flex justify-between items-center mb-4">
                  <div className="h-6 w-32 bg-gray-100 rounded-md animate-pulse"></div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-gray-100 rounded-full animate-pulse"></div>
                    <div className="h-6 w-6 bg-gray-100 rounded-md animate-pulse"></div>
                  </div>
                </div>
                
                {/* Price Skeleton */}
                <div className="space-y-2">
                  <div className="h-8 w-24 bg-indigo-100 rounded-md animate-pulse"></div>
                  <div className="h-4 w-20 bg-gray-100 rounded-md animate-pulse"></div>
                </div>
              </div>

              {/* Divider */}
              <div className="px-5">
                <div className="h-px bg-gray-100"></div>
              </div>

              {/* Details Skeleton */}
              <div className="p-5 space-y-3">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex justify-between">
                    <div className="h-4 w-20 bg-gray-100 rounded-md animate-pulse"></div>
                    <div className="h-4 w-24 bg-gray-100 rounded-md animate-pulse"></div>
                  </div>
                ))}
              </div>

              {/* Footer Skeleton */}
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="h-3 w-20 bg-gray-100 rounded-md animate-pulse"></div>
                  <div className="h-4 w-16 bg-gray-100 rounded-md animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}