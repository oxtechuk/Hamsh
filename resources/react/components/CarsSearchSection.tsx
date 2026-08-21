import { useState } from "react";
import type { FormEvent } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import Select from "./Select";
import { localize } from "../utils/localize";

import type { ICarsSearchSectionProps } from "../interfaces/ICarsSearchSectionProps";

const selectCls = [
    "h-[48px] w-full",
    "border border-[#E1E5EB]",
    "bg-white",
    "text-[11px] text-[#667085]",
    "outline-none",
    "transition duration-300",
    "focus:border-[#DDBB68]",
].join(" ");

export default function CarsSearchSection({
    title,
    brands = [],
    types = [],
    categories = [],
    years = [],
    onSearch,
    onReset,
    className = "",
    isSearching = false,
}: ICarsSearchSectionProps) {
    const { t, i18n } = useTranslation();

    const [search, setSearch] = useState("");
    const [brandId, setBrandId] = useState("");
    const [typeId, setTypeId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [year, setYear] = useState("");

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSearch({ search, brandId, typeId, categoryId, year });
    };

    const handleReset = () => {
        setSearch("");
        setBrandId("");
        setTypeId("");
        setCategoryId("");
        setYear("");
        onReset?.();
    };

    return (
        <section
            dir={i18n.dir()}
            className={`w-full bg-white py-10 sm:py-12 lg:py-14 ${className}`}
        >
            <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
                <h2 className="text-center text-[25px] font-extrabold leading-tight text-[#151A2A] sm:text-[30px]">
                    {title ?? t("carsPage.search.title")}
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 flex flex-col gap-3 lg:flex-row"
                >
                    {/* Search input */}
                    <div className="relative min-w-0 flex-1">
                        <Search
                            size={18}
                            strokeWidth={1.7}
                            className="pointer-events-none absolute start-5 top-1/2 -translate-y-1/2 text-[#778097]"
                        />

                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder={t("carsPage.search.placeholder")}
                            className={[
                                "h-[56px] w-full",
                                "border border-[#E1E5EB]",
                                "bg-white ps-14 pe-5",
                                "text-[14px] text-[#151A2A]",
                                "outline-none",
                                "placeholder:text-[#8B92A2]",
                                "transition duration-300",
                                "focus:border-[#DDBB68]",
                                "focus:ring-2 focus:ring-[#DDBB68]/15",
                            ].join(" ")}
                        />
                    </div>

                    {/* Search */}
                    <button
                        type="submit"
                        disabled={isSearching}
                        className={[
                            "flex h-[56px] min-w-[140px]",
                            "items-center justify-center",
                            "bg-[var(--brand-primary-color)] px-7",
                            "text-[15px] font-semibold text-[#151A2A] rounded-[4px]",
                            "transition duration-300",
                            "hover:bg-[#D4AD4F]",
                            "disabled:cursor-not-allowed",
                            "disabled:opacity-60",
                        ].join(" ")}
                    >
                        {isSearching
                            ? t("carsPage.search.searching")
                            : t("carsPage.search.button")}
                    </button>

                    {/* Reset */}
                    <button
                        type="button"
                        onClick={handleReset}
                        className={[
                            "flex h-[56px] min-w-[140px]",
                            "items-center justify-center",
                            "border border-[#172139] rounded-[4px]",
                            "bg-white px-6",
                            "text-[14px] font-semibold text-[#172139]",
                            "transition duration-300",
                            "hover:bg-[#172139]",
                            "hover:text-white",
                        ].join(" ")}
                    >
                        {t("carsPage.search.reset")}
                    </button>
                </form>

                {/* Filter selects */}
                <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <div>
                        <label className="mb-2 block text-start text-[12px] font-bold! text-[#303A54]">
                            {t("carsPage.search.brandLabel")}
                        </label>
                        <Select
                            placeholder={t("carsPage.search.brandPlaceholder")}
                            value={brandId}
                            onChange={setBrandId}
                            options={brands.map((b) => ({
                                label: localize(b.name, i18n.language),
                                value: String(b.id),
                            }))}
                            className={selectCls}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-start text-[12px] font-bold! text-[#303A54]">
                            {t("carsPage.search.typeLabel")}
                        </label>
                        <Select
                            placeholder={t("carsPage.search.typePlaceholder")}
                            value={typeId}
                            onChange={setTypeId}
                            options={types.map((type) => ({
                                label: localize(type.name, i18n.language),
                                value: String(type.id),
                            }))}
                            className={selectCls}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-start text-[12px] font-bold! text-[#303A54]">
                            {t("carsPage.search.categoryLabel")}
                        </label>
                        <Select
                            placeholder={t(
                                "carsPage.search.categoryPlaceholder",
                            )}
                            value={categoryId}
                            onChange={setCategoryId}
                            options={categories.map((category) => ({
                                label: localize(category.name, i18n.language),
                                value: String(category.id),
                            }))}
                            className={selectCls}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-start text-[12px] font-bold! text-[#303A54]">
                            {t("carsPage.search.yearLabel")}
                        </label>
                        <Select
                            placeholder={t("carsPage.search.yearPlaceholder")}
                            value={year}
                            onChange={setYear}
                            options={years.map((y) => {
                                const val =
                                    typeof y === "string"
                                        ? y
                                        : (y?.year ?? String(y));
                                return { label: val, value: val };
                            })}
                            className={selectCls}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
