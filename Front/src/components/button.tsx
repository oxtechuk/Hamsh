import { NavLink } from "react-router-dom";
import type { IButtonProps } from "../interfaces/IButtonProps";

export default function Button({
  children,
  textColor = "text-white!",
  bgColor = "bg-[var(--brand-primary-color)]",
  to,
  onClick,
  className = "",
}: IButtonProps) {
  const classes = `${bgColor} ${textColor} flex items-center justify-center px-10 py-4 rounded-[8px] text-lg font-medium hover:opacity-90 transition ${className}`;

  if (to) {
    const isExternal = /^(https?:\/\/|wa\.me|mailto:|tel:)/i.test(to);
    if (isExternal) {
      return (
        <a href={to} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      );
    }
    return (
      <NavLink to={to} className={classes}>
        {children}
      </NavLink>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
