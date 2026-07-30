export interface IBookingFormData {
  client_name: string;
  client_phone: string;
  client_email: string;
  city: string;
  car_id: number;
  down_payment: number;
  duration_years: number | null;
  interest_rate: number;
  booking_type: string;
  notes: string;
}

export interface ISpecialOrderBookingData {
  client_name: string;
  client_phone: string;
  client_email: string;
  city: string;
  brand_name: string;
  model_name: string;
  model_year: string;
  preferred_color: string;
  salary_range: string;
  booking_type: string;
  notes: string;
}

export interface IBookingApiResponse {
  success: boolean;
  message: string;
  data: {
    booking_id: number;
    client_name: string;
    client_phone: string;
    booking_type: string;
    status: string;
  } | null;
  errors: unknown;
  meta: unknown;
}
