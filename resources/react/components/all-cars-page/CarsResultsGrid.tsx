import CarCard from "../CarCard";
import type { ICarsResultsGridProps } from "../../interfaces/ICarsResultsGridProps";
import PaginationBar from "./PaginationBar";

export default function CarsResultsGrid({
  cars,
  currentPage,
  totalPages,
  onPageChange,
}: ICarsResultsGridProps) {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 items-stretch justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cars.map((car, index) => (
          <CarCard key={car.id} {...car} eager={index < 4} />
        ))}
      </div>

      {totalPages > 1 && (
        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </section>
  );
}
