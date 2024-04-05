export default function Loading() {
  return (
    <div className="flex w-full h-3/4 flex-col justify-center items-center mt-5 mb-5">
      <div className="flex gap-2 w-full justify-center">
        <div className="w-3 h-3 rounded-full animate-pulse bg-blue-600"></div>
        <div className="w-3 h-3 rounded-full animate-pulse bg-blue-600"></div>
        <div className="w-3 h-3 rounded-full animate-pulse bg-blue-600"></div>
        <div className="w-3 h-3 rounded-full animate-pulse bg-blue-600"></div>
      </div>
      <span className="mt-4 text-gray-700">Loading...</span>
    </div>
  );
}
