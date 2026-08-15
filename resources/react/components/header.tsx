import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { useLanguageStore } from "../store/language.store";
import type { IHeaderProps } from "../interfaces/IHeaderProps";
import Button from "./button";
import LazyImg from "./LazyImg";
import CarFinder from "./CarFinder";
import { getCarsMeta } from "../services/api";

export default function Header({
  logoSrc,
  logoAlt = "Logo",
  navItems,
  ctaText,
  ctaPath,
}: IHeaderProps) {
  const direction = useLanguageStore((s) => s.direction);
  const navigate = useNavigate();
  const [finderOpen, setFinderOpen] = useState(false);

  const { data: meta } = useQuery({
    queryKey: ["cars-meta"],
    queryFn: getCarsMeta,
    staleTime: 5 * 60 * 1000,
    enabled: finderOpen,
  });

  const handleSearch = (values: {
    brandId: string;
    typeId: string;
    categoryId: string;
    year: string;
    search: string;
  }) => {
    const params = new URLSearchParams();
    if (values.search) params.set("q", values.search);
    if (values.brandId) params.set("brands[]", values.brandId);
    if (values.typeId) params.set("type", values.typeId);
    if (values.categoryId) params.set("category_id", values.categoryId);
    if (values.year) params.set("year", values.year);
    navigate(`/cars?${params.toString()}`);
    setFinderOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[64px] items-center justify-between gap-6" dir={direction}>

            {/* Logo */}
            <NavLink to="/" className="shrink-0">
              <LazyImg src={logoSrc} alt={logoAlt} className="h-[44px] w-auto object-contain" />
            </NavLink>

            {/* Nav */}
            <nav className="hidden flex-1 items-center justify-center gap-10 text-[15px] font-medium md:flex">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    [
                      "transition-colors duration-200 whitespace-nowrap inline-block pb-0.5",
                      isActive || (item.path !== "/" && window.location.pathname.startsWith(item.path))
                        ? "text-[var(--brand-secondary-color)]! border-b-2 border-[var(--brand-secondary-color)]"
                        : "text-[#1F2937] border-b-2 border-transparent hover:border-[var(--brand-secondary-color)] hover:text-[var(--brand-secondary-color)]",
                    ].join(" ")
                  }
                  end={item.path === "/"}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Search + CTA */}
            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setFinderOpen(true)}
                className="flex h-[36px] w-[36px] items-center justify-center rounded-full text-[#6B7280] transition hover:text-[var(--brand-secondary-color)]"
                aria-label="بحث"
              >
                <Search size={20} strokeWidth={1.8} />
              </button>

              <Button
                to={ctaPath}
                bgColor="bg-[var(--brand-secondary-color)]"
                textColor="text-white!"
                className="!h-[40px] !rounded-[8px] px-5 text-[14px] font-semibold"
              >
                {ctaText}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* CarFinder — renders directly below the header in DOM flow */}
      {finderOpen && (
        <>
          <div className="relative z-[49] w-full bg-[var(--brand-primary-color)] shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
            <button
              type="button"
              onClick={() => setFinderOpen(false)}
              className="absolute end-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
              aria-label="إغلاق"
            >
              <X size={18} />
            </button>

            <CarFinder
              brands={meta?.filter_brands ?? []}
              types={meta?.filter_types ?? []}
              categories={meta?.filter_categories ?? []}
              years={meta?.filter_years ?? []}
              onSearch={handleSearch}
              onReset={() => setFinderOpen(false)}
            />
          </div>

          {/* Backdrop below the panel */}
          <div
            className="fixed inset-0 z-[48] bg-black/50"
            onClick={() => setFinderOpen(false)}
          />
        </>
      )}
    </>
  );
}
