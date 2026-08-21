import type { IFooterLink } from "./FooterLink";
import type { ISocialLink } from "./ISocialLink";

export interface IFooterProps {
  logoSrc?: string;
  logoAlt?: string;
  quickLinks: IFooterLink[];
  socialLinks?: ISocialLink[];
  address?: string;
  copyright?: string;
}
