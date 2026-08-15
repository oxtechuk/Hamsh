import type { ICompareCarSlotProps } from "../../interfaces/ICompareCarSlotProps";
import CompareCarCard from "./CompareCarCard";
import CarSelect from "./CarSelect";
import LoadingSlot from "./LoadingSlot";
import EmptySlot from "./EmptySlot";

export default function CompareCarSlot({
  slug,
  car,
  isLoading,
  showSearch,
  label,
  dir,
  onSelect,
  onRemove,
  onShowSearch,
  onHideSearch,
}: ICompareCarSlotProps) {
  if (slug && car) {
    return <CompareCarCard car={car} label={label} onRemove={onRemove} />;
  }
  if (slug && isLoading) {
    return <LoadingSlot />;
  }
  if (showSearch) {
    return (
      <CarSelect
        selectedSlug={slug}
        onSelect={onSelect}
        onCancel={onHideSearch}
        dir={dir}
      />
    );
  }
  return <EmptySlot onClick={onShowSearch} />;
}
