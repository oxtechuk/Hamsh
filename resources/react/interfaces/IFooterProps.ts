import type { ISocialLink } from "./ISocialLink";

export interface IFooterProps {
  logoSrc?: string;
  logoAlt?: string;
  socialLinks?: ISocialLink[];
  address?: string;
  copyright?: string;
}
