import type { IBookingApiResponse } from "../../interfaces/IBookingApiResponse";
import api from "./http";
import { trackLead } from "../../utils/analytics";

export async function submitBooking(data: Record<string, unknown>): Promise<IBookingApiResponse> {
  const response = await api.post<IBookingApiResponse>("store/booking", data);
  trackLead({
    content_name: (data.booking_type as string) || "Car Booking",
    value: Number(data.total_price || data.cash_price) || 0,
  });
  return response.data;
}
