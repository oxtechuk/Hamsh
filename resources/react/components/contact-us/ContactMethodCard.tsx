import type { IContactMethodCardProps } from "../../interfaces/IContactMethodCardProps";

export default function ContactMethodCard({
  icon,
  title,
  description,
  href,
  external = false,
  transparent = false,
  id,
  className,
  dataTracking,
  dataId,
  dataChannel,
  ariaLabel,
  onClick,
}: IContactMethodCardProps) {
  const content = (
    <div
      className={[
        "flex min-h-[185px] h-full flex-col",
        "items-start justify-start",
        transparent ? "bg-transparent" : "bg-white",
        "px-6 py-8",
        "text-start",
        "transition duration-300",
        href ? "cursor-pointer hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(48,58,84,0.08)]" : "",
      ].join(" ")}
    >
      <div className="text-[var(--brand-primary-color)] transition-transform duration-300 group-hover:scale-105">
        {icon}
      </div>

      <h3 className="mt-5 text-[21px] font-extrabold text-[#20283A]">
        {title}
      </h3>

      <p className="mt-2 text-[12px] leading-6 text-[#687084]">
        {description}
      </p>
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <a
      id={id}
      data-id={dataId}
      data-tracking={dataTracking}
      data-channel={dataChannel}
      aria-label={ariaLabel}
      onClick={onClick}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`block h-full no-underline group cursor-pointer ${className || ""}`}
    >
      {content}
    </a>
  );
}
