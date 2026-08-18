export interface IContactApiResponse {
  success: boolean;
  message: string;
  data: { lead_id: number } | null;
  errors: unknown;
  meta: unknown;
}

export interface IContactFormData {
  name: string;
  phone: string;
  subject: string;
  message: string;
}
