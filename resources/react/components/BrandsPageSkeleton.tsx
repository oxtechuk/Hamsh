import Skeleton from "./Skeleton";

export default function BrandsPageSkeleton() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading brands page"
      className="w-full select-none py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <Skeleton className="h-9 w-56 rounded-lg bg-gray-200/50 md:h-10 md:w-72" />
        </div>

        <div className="mb-12">
          <Skeleton className="h-[52px] w-full max-w-md rounded-[10px] bg-gray-200/50" />
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex h-[150px] flex-col items-center justify-center rounded-[16px] border border-gray-100 bg-white p-4 shadow-sm"
            >
              <Skeleton className="h-[52px] w-[52px] rounded-full bg-gray-200/50" />
              <Skeleton className="mt-4 h-5 w-20 rounded-md bg-gray-200/40" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
