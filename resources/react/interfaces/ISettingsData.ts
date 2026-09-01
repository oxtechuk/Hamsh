export interface ISocialMediaItem {
  icon: string;
  link: string;
  color: string;
  // legacy aliases for compat
  platform?: string;
  url?: string;
}

export interface IWorkingHours {
  from: string;
  to: string;
  days: string[];
}

export interface IContactInfo {
  email: string;
  phone: string;
  whatsapp?: string;
  address: string;
  sales_phone?: string | null;
  finance_phone?: string | null;
  aftersales_phone?: string | null;
}

export interface IMaintenanceSettings {
  enabled: boolean;
  title: string;
  message: string;
  image: string | null;
  show_contact: boolean;
  is_admin?: boolean;
}

export interface ISettingsData {
  logo: string | null;
  logo_color?: string | null;
  favicon: string | null;
  site_name: string;
  footer_text: string | null;
  contact: IContactInfo;
  working_hours?: IWorkingHours;
  social_media: ISocialMediaItem[];
  car_popup_enabled?: boolean;
  maintenance?: IMaintenanceSettings;
}
