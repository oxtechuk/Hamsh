import React, { useState, useEffect, useRef, useMemo } from "react";
import type { FormEvent } from "react";
import {
  Search,
  RotateCcw,
  X,
  Loader2,
  Car as CarIcon,
  Layers,
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  SlidersHorizontal,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import Select from "./Select";
import { localize } from "../utils/localize";
import { searchCars } from "../services/api/cars.service";
import type { CarItem } from "../types/home.types";
import { getImageUrl } from "../constants/app-images";
import LazyImg from "./LazyImg";

import type { ICarsSearchSectionProps } from "../interfaces/ICarsSearchSectionProps";

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
  const uniqueModels = useMemo(() => {
    return Array.from(
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
  }, [models]);

  const activeFiltersCount = [
    Boolean(search.trim()),
    Boolean(brandId),
    Boolean(model),
    Boolean(year),
  ].filter(Boolean).length;

  const hasActiveFilters = activeFiltersCount > 0;

  const selectBaseCls = [
    "h-[42px] sm:h-[46px] w-full",
    "bg-gray-50/80 hover:bg-white text-gray-800",
    "text-[12px] sm:text-[13px] font-medium",
    "rounded-xl border",
    "outline-none transition-all duration-200 shadow-2xs",
    "focus:bg-white focus:border-[var(--brand-primary-color,#DDBB68)]",
    "focus:ring-2 focus:ring-[var(--brand-primary-color,#DDBB68)]/20",
  ].join(" ");

  return (
    <section
      dir={i18n.dir()}
      className={`w-full bg-gradient-to-b from-gray-50/60 via-white to-gray-50/30 py-6 sm:py-8 lg:py-10 border-b border-gray-100/90 ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Title Header */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/50 text-[11px] sm:text-xs font-bold text-amber-800 mb-2">
            <Sparkles size={13} className="text-amber-600" />
            <span>{isRTL ? "البحث المباشر والفلترة" : "Live Search & Filter"}</span>
          </div>
          <h2 className="text-lg sm:text-2xl lg:text-3xl font-black tracking-tight text-gray-900">
            {title ?? (isRTL ? "ابحث عن سيارتك المثالية" : "Find Your Perfect Car")}
          </h2>
        </div>

        {/* Compact Luxury Search & Filter Card */}
        <div className="mx-auto max-w-4xl bg-white rounded-2xl sm:rounded-3xl border border-gray-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-3 sm:p-5 transition-all">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 sm:gap-4">
            {/* 1. Main Search Bar with Integrated Action Button */}
            <div className="flex items-center gap-2">
              <div className="relative min-w-0 flex-1" ref={dropdownRef}>
                <Search
                  size={18}
                  strokeWidth={2}
                  className="pointer-events-none absolute start-3.5 sm:start-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors"
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
                      ? "ابحث بالاسم، الموديل، أو المواصفات..."
                      : "Search by name, model or specs..."
                  }
                  className={[
                    "h-[46px] sm:h-[50px] w-full",
                    "border border-gray-200/90 bg-gray-50/50 hover:bg-white ps-10 sm:ps-11 pe-9 sm:pe-10",
                    "text-[13px] sm:text-[14px] text-gray-900 font-medium rounded-xl sm:rounded-2xl",
                    "outline-none transition-all duration-200 shadow-2xs",
                    "placeholder:text-gray-400 placeholder:text-xs sm:placeholder:text-sm",
                    "focus:bg-white focus:border-[var(--brand-primary-color,#DDBB68)]",
                    "focus:ring-2 focus:ring-[var(--brand-primary-color,#DDBB68)]/20",
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
                    className="absolute end-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}

                {/* Autocomplete / Live Search Dropdown */}
                {showDropdown && search.trim().length > 0 && (
                  <div className="absolute start-0 end-0 top-[52px] sm:top-[56px] z-50 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl transition-all animate-in fade-in slide-in-from-top-2 duration-150">
                    {isLoadingSuggestions ? (
                      <div className="flex items-center justify-center gap-2 py-6 text-xs sm:text-sm text-gray-500">
                        <Loader2 className="h-4 w-4 animate-spin text-[var(--brand-primary-color,#DDBB68)]" />
                        <span>{isRTL ? "جاري البحث..." : "Searching..."}</span>
                      </div>
                    ) : suggestions.length > 0 ? (
                      <div className="max-h-[340px] overflow-y-auto divide-y divide-gray-50">
                        <div className="bg-gray-50/80 px-4 py-2 text-[11px] font-bold text-gray-500 flex items-center justify-between">
                          <span>{isRTL ? "السيارات المطابقة" : "Matching Cars"}</span>
                          <span className="text-[10px] text-gray-400">({suggestions.length})</span>
                        </div>
                        {suggestions.map((car) => {
                          const img =
                            getImageUrl(car.thumbnail || car.main_image) || "";
                          const brandName = localize(car.brand?.name, i18n.language);
                          return (
                            <div
                              key={car.id}
                              onClick={() => handleSelectCar(car)}
                              className="group flex items-center justify-between gap-3 p-2.5 sm:p-3 sm:px-4 transition-colors hover:bg-amber-50/50 cursor-pointer text-start"
                            >
                              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                                <div className="h-10 w-14 sm:h-12 sm:w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-100 flex items-center justify-center">
                                  {img ? (
                                    <LazyImg
                                      src={img}
                                      alt={car.name}
                                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                    />
                                  ) : (
                                    <CarIcon className="h-5 w-5 text-gray-400" />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[var(--brand-primary-color,#CBA458)] truncate transition-colors">
                                    {localize(car.name, i18n.language)}
                                  </h4>
                                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-0.5">
                                    {brandName && <span>{brandName}</span>}
                                    {car.year && <span>• {car.year}</span>}
                                  </div>
                                </div>
                              </div>

                              <div className="shrink-0 text-end">
                                {car.cash_price ? (
                                  <span className="text-xs sm:text-sm font-extrabold text-[var(--brand-primary-color,#DDBB68)]">
                                    {car.cash_price.toLocaleString()}{" "}
                                    <small className="text-[9px] sm:text-[10px] text-gray-500 font-normal">
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
                          className="w-full bg-gray-50 hover:bg-gray-100 px-4 py-2.5 text-center text-xs font-bold text-amber-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-t border-gray-100"
                        >
                          <span>
                            {isRTL
                              ? `عرض جميع النتائج لـ "${search}"`
                              : `View all results for "${search}"`}
                          </span>
                          {isRTL ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
                        </button>
                      </div>
                    ) : (
                      <div className="py-6 text-center text-xs sm:text-sm text-gray-500">
                        <CarIcon className="mx-auto h-6 w-6 text-gray-300 mb-1.5" />
                        <p>{isRTL ? "لا توجد نتائج مطابقة لبحثك" : "No matching cars found"}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Search Button */}
              <button
                type="submit"
                disabled={isSearching}
                className={[
                  "flex h-[46px] sm:h-[50px] px-4 sm:px-6 shrink-0",
                  "items-center justify-center gap-1.5",
                  "bg-[var(--brand-primary-color,#DDBB68)] text-white font-bold rounded-xl sm:rounded-2xl",
                  "text-xs sm:text-sm shadow-sm transition-all duration-200",
                  "hover:brightness-105 active:scale-95 cursor-pointer",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                ].join(" ")}
              >
                {isSearching ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span className="hidden sm:inline">{isRTL ? "جاري البحث..." : "Searching..."}</span>
                  </>
                ) : (
                  <>
                    <Search size={15} className="sm:hidden" />
                    <span>{isRTL ? "بحث" : "Search"}</span>
                  </>
                )}
              </button>

              {/* Reset Button (Visible if filters active or on desktop) */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleReset}
                  title={isRTL ? "إعادة تعيين الفلاتر" : "Reset filters"}
                  className={[
                    "flex h-[46px] sm:h-[50px] px-3 sm:px-4 shrink-0",
                    "items-center justify-center gap-1.5",
                    "border border-gray-200/90 rounded-xl sm:rounded-2xl",
                    "bg-gray-50/60 hover:bg-gray-100 text-gray-600 hover:text-gray-900",
                    "text-xs sm:text-sm font-semibold transition-all duration-200",
                    "cursor-pointer shadow-2xs active:scale-95",
                  ].join(" ")}
                >
                  <RotateCcw size={14} className="text-gray-500" />
                  <span className="hidden sm:inline">{isRTL ? "إعادة تعيين" : "Reset"}</span>
                </button>
              )}
            </div>

            {/* 2. Compact 3-Column Select Grid (Brand | Model | Year) */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
              {/* 1. العلامة التجارية */}
              <div className="relative">
                <Select
                  placeholder={isRTL ? "العلامة" : "Brand"}
                  value={brandId}
                  onChange={(val) => {
                    setBrandId(val);
                    onSearch({ search, brandId: val, model, year });
                  }}
                  options={brands.map((b) => ({
                    label: localize(b.name, i18n.language),
                    value: String(b.id),
                  }))}
                  className={`${selectBaseCls} ${brandId ? "border-[var(--brand-primary-color,#DDBB68)] bg-amber-50/20 font-bold" : "border-gray-200/80"}`}
                />
              </div>

              {/* 2. الموديل */}
              <div className="relative">
                <Select
                  placeholder={isRTL ? "الموديل" : "Model"}
                  value={model}
                  onChange={(val) => {
                    setModel(val);
                    onSearch({ search, brandId, model: val, year });
                  }}
                  options={uniqueModels.map((m) => ({
                    label: m,
                    value: m,
                  }))}
                  className={`${selectBaseCls} ${model ? "border-[var(--brand-primary-color,#DDBB68)] bg-amber-50/20 font-bold" : "border-gray-200/80"}`}
                />
              </div>

              {/* 3. سنة الصنع */}
              <div className="relative">
                <Select
                  placeholder={isRTL ? "السنة" : "Year"}
                  value={year}
                  onChange={(val) => {
                    setYear(val);
                    onSearch({ search, brandId, model, year: val });
                  }}
                  options={years.map((y) => {
                    const val =
                      typeof y === "object" && y !== null
                        ? String(y.year)
                        : String(y);
                    return { label: val, value: val };
                  })}
                  className={`${selectBaseCls} ${year ? "border-[var(--brand-primary-color,#DDBB68)] bg-amber-50/20 font-bold" : "border-gray-200/80"}`}
                />
              </div>
            </div>

            {/* Active Filter Badges Bar (Mobile / Desktop) */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-gray-600">
                <span className="text-[10px] sm:text-xs font-bold text-gray-400 flex items-center gap-1">
                  <SlidersHorizontal size={11} />
                  {isRTL ? "الفلاتر النشطة:" : "Active:"}
                </span>

                {brandId && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200/60 text-amber-900 font-medium">
                    {brands.find((b) => String(b.id) === brandId)?.name?.ar ||
                      brands.find((b) => String(b.id) === brandId)?.name ||
                      brandId}
                    <button
                      type="button"
                      onClick={() => {
                        setBrandId("");
                        onSearch({ search, brandId: "", model, year });
                      }}
                      className="hover:text-red-500"
                    >
                      <X size={11} />
                    </button>
                  </span>
                )}

                {model && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200/60 text-amber-900 font-medium">
                    {model}
                    <button
                      type="button"
                      onClick={() => {
                        setModel("");
                        onSearch({ search, brandId, model: "", year });
                      }}
                      className="hover:text-red-500"
                    >
                      <X size={11} />
                    </button>
                  </span>
                )}

                {year && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200/60 text-amber-900 font-medium">
                    {year}
                    <button
                      type="button"
                      onClick={() => {
                        setYear("");
                        onSearch({ search, brandId, model, year: "" });
                      }}
                      className="hover:text-red-500"
                    >
                      <X size={11} />
                    </button>
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleReset}
                  className="ms-auto text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                >
                  {isRTL ? "مسح الكل" : "Clear all"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
