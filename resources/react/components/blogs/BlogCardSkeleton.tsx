import Skeleton from "../Skeleton";

export default function BlogCardSkeleton() {
    return (
        <article className="block w-full">
            <div className="relative w-full overflow-hidden rounded-[12px] bg-[#E8E8E8] aspect-[1.54/1]">
                <Skeleton className="h-full w-full rounded-none bg-gray-200/50" />
                <Skeleton className="absolute start-5 top-5 h-[30px] w-20 rounded-[6px] bg-gray-200/60" />
            </div>

            <div className="px-1 pt-3">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-16 rounded-md bg-gray-200/40" />
                    <Skeleton className="h-4 w-16 rounded-md bg-gray-200/40" />
                </div>

                <Skeleton className="mt-3 h-5 w-full rounded-md bg-gray-200/50" />
                <Skeleton className="mt-2 h-5 w-2/3 rounded-md bg-gray-200/40" />
            </div>
        </article>
    );
}
