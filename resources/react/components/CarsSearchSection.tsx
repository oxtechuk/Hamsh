import React, { useState, useEffect, useRef } from "react";
import type { FormEvent } from "react";
import { Search, RotateCcw, X, Loader2, Car as CarIcon, ArrowRight, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import Select from "./Select";
import { localize } from "../utils/localize";
import { searchCars } from "../services/api/cars.service";
import type { CarItem } from "../types/home.types";
import { getImageUrl } from "../constants/app-images";
import LazyImg from "./LazyImg";

import type { ICarsSearchSectionProps } from "../interfaces/ICarsSearchSectionProps";

const selectCls = [
  "h-[48px] w-full",
  "border border-[#E1E5EB]",
  "bg-white",
  "text-[12px] text-[#4A5568]",
  "rounded-md",
  "outline-none",
  "transition duration-200",
  "focus:border-[#DDBB68]",
  "focus:ring-1 focus:ring-[#DDBB68]/30",
].join(" ");

export default function CarsSearchSection({
  title,
  brands = [],
  models = [],
  years = [],
  onSearch,
  onReset,
  className = "",
  isSearching = false,
}: ICarsSearchSectionProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.dir() === "rtl";

  const [search, setSearch] = useState("");
  const [brandId, setBrandId] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

  // Autocomplete suggestions state
  const [suggestions, setSuggestions] = useState<CarItem[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search query for autocomplete suggestions
  useEffect(() => {
    const trimmed = search.trim();
    if (trimmed.length < 1) {
      setSuggestions([]);
      setIsLoadingSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchCars(trimmed);
        setSuggestions(results.slice(0, 6));
      } catch (err) {
        console.error("Error fetching search suggestions:", err);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [search]);

  // Click outside to close autocomplete dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (event?: FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();
    setShowDropdown(false);
    onSearch({ search, brandId, model, year });
  };

  const handleReset = () => {
    setSearch("");
    setBrandId("");
    setModel("");
    setYear("");
    setSuggestions([]);
    setShowDropdown(false);
    onReset?.();
  };

  const handleSelectCar = (car: CarItem) => {
    setShowDropdown(false);
    navigate(`/cars/${car.slug}`);
  };

  // Distinct list of models
  const uniqueModels = Array.from(
    new Set(
      models.length
        ? models
        : [
            "Camry LE",
            "Yaris Y",
            "Accent Fleet",
            "Elantra Smart",
            "Sonata Smart",
            "K3 LX",
            "K4 EX",
            "K5 LX",
            "Accord LX Turbo",
            "Altima S",
            "Cruze LT",
          ],
    ),
  ).filter(Boolean);

  return (
    <section
      dir={i18n.dir()}
      className={`w-full bg-white py-10 sm:py-12 lg:py-14 border-b border-gray-100 ${className}`}
    >
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-[24px] font-extrabold leading-tight text-[#151A2A] sm:text-[30px]">
          {title ?? (isRTL ? "إبحث عن سيارتك المثالية" : "Find Your Perfect Car")}
        </h2>

        <form onSubmit={handleSubmit} className="mt-8">
          {/* Main Search Input with Autocomplete */}
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative min-w-0 flex-1" ref={dropdownRef}>
              <Search
                size={19}
                strokeWidth={1.8}
                className="pointer-events-none absolute start-5 top-1/2 -translate-y-1/2 text-[#778097]"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => {
                  if (search.trim().length > 0) setShowDropdown(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setShowDropdown(false);
                }}
                placeholder={
                  isRTL
                    ? "ابحث عن سيارة بالاسم، العلامة التجارية، الموديل، أو المواصفات..."
                    : "Search car by name, brand, model or specifications..."
                }
                className={[
                  "h-[56px] w-full",
                  "border border-[#E1E5EB]",
                  "bg-white ps-14 pe-10",
                  "text-[14px] text-[#151A2A] font-medium rounded-md",
                  "outline-none",
                  "placeholder:text-[#8B92A2]",
                  "transition duration-200",
                  "focus:border-[#DDBB68]",
                  "focus:ring-2 focus:ring-[#DDBB68]/15",
                ].join(" ")}
                autoComplete="off"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSuggestions([]);
                    setShowDropdown(false);
                  }}
                  className="absolute end-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              )}

              {/* Autocomplete / Live Search Dropdown */}
              {showDropdown && search.trim().length > 0 && (
                <div className="absolute start-0 end-0 top-[60px] z-50 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-2xl transition-all animate-in fade-in slide-in-from-top-2 duration-150">
                  {isLoadingSuggestions ? (
                    <div className="flex items-center justify-center gap-2 py-8 text-sm text-gray-500">
                      <Loader2 className="h-5 w-5 animate-spin text-[#DDBB68]" />
                      <span>{isRTL ? "جاري البحث..." : "Searching..."}</span>
                    </div>
                  ) : suggestions.length > 0 ? (
                    <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-50">
                      <div className="bg-gray-50/80 px-4 py-2 text-xs font-semibold text-gray-500">
                        {isRTL ? "السيارات المطابقة" : "Matching Cars"}
                      </div>
                      {suggestions.map((car) => {
                        const img =
                          getImageUrl(car.thumbnail || car.main_image) || "";
                        const brandName = localize(car.brand?.name, i18n.language);
                        return (
                          <div
                            key={car.id}
                            onClick={() => handleSelectCar(car)}
                            className="group flex items-center justify-between gap-3 p-3 sm:px-4 transition-colors hover:bg-amber-50/50 cursor-pointer text-start"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="h-12 w-16 sm:h-14 sm:w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-100 flex items-center justify-center">
                                {img ? (
                                  <LazyImg
                                    src={img}
                                    alt={car.name}
                                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                  />
                                ) : (
                                  <CarIcon className="h-6 w-6 text-gray-400" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#A67C2E] truncate transition-colors">
                                  {localize(car.name, i18n.language)}
                                </h4>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                  {brandName && <span>{brandName}</span>}
                                  {car.year && <span>• {car.year}</span>}
                                  {car.type && (
                                    <span className="hidden sm:inline">
                                      • {localize(car.type, i18n.language)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="shrink-0 text-end">
                              {car.cash_price ? (
                                <span className="text-sm font-bold text-[#DDBB68]">
                                  {car.cash_price.toLocaleString()}{" "}
                                  <small className="text-[10px] text-gray-500 font-normal">
                                    {isRTL ? "ر.س" : "SAR"}
                                  </small>
                                </span>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}

                      {/* Footer: View all results */}
                      <button
                        type="button"
                        onClick={() => handleSubmit()}
                        className="w-full bg-gray-50 hover:bg-gray-100 px-4 py-3 text-center text-xs font-bold text-[#A67C2E] flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-t border-gray-100"
                      >
                        <span>
                          {isRTL
                            ? `عرض جميع النتائج لـ "${search}"`
                            : `View all results for "${search}"`}
                        </span>
                        {isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                      </button>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-sm text-gray-500">
                      <CarIcon className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                      <p>{isRTL ? "لا توجد نتائج مطابقة لبحثك" : "No matching cars found"}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Search Button */}
            <button
              type="submit"
              disabled={isSearching}
              className={[
                "flex h-[56px] min-w-[140px]",
                "items-center justify-center gap-2",
                "bg-[var(--brand-primary-color,#DDBB68)] px-8",
                "text-[15px] font-bold text-white rounded-md shadow-sm",
                "transition duration-200",
                "hover:bg-[#CBA458] active:scale-[0.99] cursor-pointer",
                "disabled:cursor-not-allowed disabled:opacity-60",
              ].join(" ")}
            >
              {isSearching ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{isRTL ? "جاري البحث..." : "Searching..."}</span>
                </>
              ) : (
                <span>{isRTL ? "بحث" : "Search"}</span>
              )}
            </button>

            {/* Reset Button */}
            <button
              type="button"
              onClick={handleReset}
              className={[
                "flex h-[56px] min-w-[130px]",
                "items-center justify-center gap-1.5",
                "border border-[#E1E5EB] rounded-md",
                "bg-white px-5",
                "text-[14px] font-semibold text-gray-700",
                "transition duration-200",
                "hover:bg-gray-50 hover:text-gray-900 cursor-pointer shadow-xs",
              ].join(" ")}
            >
              <RotateCcw size={15} className="text-gray-400" />
              <span>{isRTL ? "إعادة تعيين" : "Reset"}</span>
            </button>
          </div>

          {/* 3 Main Filters: العلامة التجارية | الموديل | سنة الصنع */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 1. العلامة التجارية */}
            <div>
              <label className="mb-2 block text-start text-[13px] font-bold text-[#303A54]">
                {isRTL ? "العلامة التجارية" : "Brand"}
              </label>
              <Select
                placeholder={isRTL ? "جميع العلامات" : "All Brands"}
                value={brandId}
                onChange={setBrandId}
                options={brands.map((b) => ({
                  label: localize(b.name, i18n.language),
                  value: String(b.id),
                }))}
                className={selectCls}
              />
            </div>

            {/* 2. الموديل */}
            <div>
              <label className="mb-2 block text-start text-[13px] font-bold text-[#303A54]">
                {isRTL ? "الموديل" : "Model"}
              </label>
              <Select
                placeholder={isRTL ? "جميع الموديلات" : "All Models"}
                value={model}
                onChange={setModel}
                options={uniqueModels.map((m) => ({
                  label: m,
                  value: m,
                }))}
                className={selectCls}
              />
            </div>

            {/* 3. سنة الصنع */}
            <div>
              <label className="mb-2 block text-start text-[13px] font-bold text-[#303A54]">
                {isRTL ? "سنة الصنع" : "Year"}
              </label>
              <Select
                placeholder={isRTL ? "جميع السنوات" : "All Years"}
                value={year}
                onChange={setYear}
                options={years.map((y) => {
                  const val =
                    typeof y === "object" && y !== null
                      ? String(y.year)
                      : String(y);
                  return { label: val, value: val };
                })}
                className={selectCls}
              />
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
