import type { IBookingApiResponse } from "../../interfaces/IBookingApiResponse";
import api from "./http";
import { trackLead } from "../../utils/analytics";
import { getAttributionPayload } from "../../utils/attribution";

export async function submitBooking(data: Record<string, unknown>): Promise<IBookingApiResponse> {
  const attribution = getAttributionPayload();
  const payload = {
    ...attribution,
    ...data,
  };

  const response = await api.post<IBookingApiResponse>("store/booking", payload);
  trackLead({
    content_name: (data.booking_type as string) || "Car Booking",
    value: Number(data.total_price || data.cash_price) || 0,
  });
  return response.data;
}
