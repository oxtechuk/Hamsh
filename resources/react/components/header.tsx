import { NavLink } from "react-router-dom";

import { useLanguageStore } from "../store/language.store";
import type { IHeaderProps } from "../interfaces/IHeaderProps";
import Button from "./button";
import LazyImg from "./LazyImg";

export default function Header({
  logoSrc,
  logoAlt = "Logo",
  navItems,
  ctaText,
  ctaPath,
}: IHeaderProps) {
  const direction = useLanguageStore((s) => s.direction);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E5E7EB] bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="flex h-[76px] items-center justify-between gap-6"
          dir={direction}
        >
          {/* Logo */}
          <NavLink to="/" className="shrink-0">
            <LazyImg
              src={logoSrc}
              alt={logoAlt}
              className="h-[58px] w-auto object-contain"
            />
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
                    isActive ||
                    (item.path !== "/" &&
                      window.location.pathname.startsWith(item.path))
                      ? "text-[var(--brand-primary-color)]! border-b-2 border-[var(--brand-primary-color)]"
                      : "text-[#1F2937] border-b-2 border-transparent hover:border-[var(--brand-primary-color)] hover:text-[var(--brand-primary-color)]",
                  ].join(" ")
                }
                end={item.path === "/"}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex shrink-0 items-center">
            <Button
              to={ctaPath}
              bgColor="bg-[var(--brand-primary-color)]"
              textColor="text-[#20283A]!"
              className="!h-[44px] !rounded-[8px] px-6 text-[14px] font-bold"
            >
              {ctaText}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
