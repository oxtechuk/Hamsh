import type { IContactMethodCardProps } from "../../interfaces/IContactMethodCardProps";

export default function ContactMethodCard({
  icon,
  title,
  description,
  href,
  external = false,
  transparent = false,
}: IContactMethodCardProps) {
  const content = (
    <div
      className={[
        "flex min-h-[185px] flex-col",
        "items-start justify-start",
        transparent ? "bg-transparent" : "bg-white",
        "px-6 py-8",
        "text-start",
        "transition duration-300",
        "hover:-translate-y-1",
        "hover:shadow-[0_12px_28px_rgba(48,58,84,0.08)]",
      ].join(" ")}
    >
      <div className="text-[var(--brand-primary-color)]">
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
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {content}
    </a>
  );
}
