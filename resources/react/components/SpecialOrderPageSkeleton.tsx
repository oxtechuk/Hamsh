import Skeleton from "./Skeleton";

export default function SpecialOrderPageSkeleton() {
    return (
        <main
            aria-busy="true"
            aria-label="Loading special order page"
            className="min-h-screen w-full bg-gray-100"
        >
            <div className="mx-auto max-w-[1280px] px-5 pt-8 sm:px-8 lg:px-10">
                <Skeleton className="h-3 w-32 bg-gray-200/40" />
                <Skeleton className="mt-3 h-9 w-72 bg-gray-200/50 sm:h-10 sm:w-96" />
            </div>

            <section className="w-full pb-16 pt-10 sm:pt-12">
                <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10">
                    <div className="flex flex-col gap-8 lg:flex-row-reverse">
                        <div className="min-w-0 flex-1 space-y-4 lg:w-3/5">
                            <Skeleton className="h-6 w-48 bg-gray-200/50" />
                            <Skeleton className="h-[52px] w-full rounded-[10px] bg-gray-200/40" />
                            <Skeleton className="h-[52px] w-full rounded-[10px] bg-gray-200/40" />
                            <Skeleton className="h-[52px] w-full rounded-[10px] bg-gray-200/40" />
                            <Skeleton className="h-[52px] w-40 rounded-[12px] bg-gray-200/60" />
                        </div>

                        <aside className="w-full shrink-0 lg:w-2/5">
                            <div className="min-h-[470px] w-full space-y-4 bg-white px-8 py-10">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <Skeleton className="h-9 w-9 shrink-0 rounded-full bg-gray-200/50" />
                                        <Skeleton className="h-4 w-32 bg-gray-200/40" />
                                    </div>
                                ))}
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </main>
    );
}
