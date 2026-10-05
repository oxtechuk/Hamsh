declare global {
  interface Window {
    dataLayer?: any[];
    fbq?: (...args: any[]) => void;
    ttq?: {
      page: () => void;
      track: (event: string, params?: Record<string, any>) => void;
      [key: string]: any;
    };
    snaptr?: (...args: any[]) => void;
  }
}

/**
 * Tracks a PageView on all active tracking pixels and GTM dataLayer.
 */
export function trackPageView(_url?: string): void {
  try {
    if (typeof window !== "undefined") {
      if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push({
          event: "page_view",
          page_path: _url || window.location.pathname + window.location.search,
        });
      }
      if (typeof window.fbq === "function") {
        window.fbq("track", "PageView");
      }
      if (window.ttq && typeof window.ttq.page === "function") {
        window.ttq.page();
      }
      if (typeof window.snaptr === "function") {
        window.snaptr("track", "PAGE_VIEW");
      }
    }
  } catch (error) {
    console.debug("[Analytics] trackPageView error:", error);
  }
}

/**
 * Tracks a Lead submission event on Meta, TikTok, and Snapchat.
 */
export function trackLead(params?: {
  content_name?: string;
  value?: number;
  currency?: string;
}): void {
  try {
    if (typeof window !== "undefined") {
      const currency = params?.currency || "SAR";
      const value = params?.value || 0;
      const contentName = params?.content_name || "Lead Submission";

      if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push({
          event: "lead_submission",
          lead_value: value,
          currency,
          content_name: contentName,
        });
      }

      if (typeof window.fbq === "function") {
        window.fbq("track", "Lead", {
          content_name: contentName,
          value,
          currency,
        });
      }
      if (window.ttq && typeof window.ttq.track === "function") {
        window.ttq.track("SubmitForm", {
          content_name: contentName,
          value,
          currency,
        });
      }
      if (typeof window.snaptr === "function") {
        window.snaptr("track", "SIGN_UP", {
          price: value,
          currency,
        });
      }
    }
  } catch (error) {
    console.debug("[Analytics] trackLead error:", error);
  }
}

/**
 * Tracks a Contact event on Meta, TikTok, and Snapchat.
 */
export function trackContact(params?: {
  content_name?: string;
}): void {
  try {
    if (typeof window !== "undefined") {
      const contentName = params?.content_name || "Contact Us";

      if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push({
          event: "contact",
          content_name: contentName,
        });
      }

      if (typeof window.fbq === "function") {
        window.fbq("track", "Contact", {
          content_name: contentName,
        });
      }
      if (window.ttq && typeof window.ttq.track === "function") {
        window.ttq.track("Contact", {
          content_name: contentName,
        });
      }
      if (typeof window.snaptr === "function") {
        window.snaptr("track", "CUSTOM_EVENT_1", {
          description: contentName,
        });
      }
    }
  } catch (error) {
    console.debug("[Analytics] trackContact error:", error);
  }
}

/**
 * Tracks ViewContent (e.g. Viewing a car details page).
 */
export function trackViewContent(params: {
  id?: string | number;
  name?: string;
  price?: number;
  category?: string;
}): void {
  try {
    if (typeof window !== "undefined") {
      const currency = "SAR";

      if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push({
          event: "view_item",
          item_id: params.id ? String(params.id) : undefined,
          item_name: params.name,
          item_category: params.category || "Vehicle",
          price: params.price,
          currency: params.price ? currency : undefined,
        });
      }

      if (typeof window.fbq === "function") {
        window.fbq("track", "ViewContent", {
          content_ids: params.id ? [String(params.id)] : undefined,
          content_name: params.name,
          content_type: "product",
          value: params.price,
          currency: params.price ? currency : undefined,
        });
      }
      if (window.ttq && typeof window.ttq.track === "function") {
        window.ttq.track("ViewContent", {
          contents: [
            {
              content_id: params.id ? String(params.id) : undefined,
              content_name: params.name,
              content_category: params.category || "Vehicle",
              price: params.price,
            },
          ],
          value: params.price,
          currency,
        });
      }
      if (typeof window.snaptr === "function") {
        window.snaptr("track", "VIEW_CONTENT", {
          item_ids: params.id ? [String(params.id)] : undefined,
          price: params.price,
          currency,
        });
      }
    }
  } catch (error) {
    console.debug("[Analytics] trackViewContent error:", error);
  }
}
