/**
 * Attribution & Visitor Traffic Source Engine.
 * Captures UTM tags, Click IDs (Snapchat, Instagram, Facebook, TikTok, Google),
 * and referrer domains, persisting them across sessions.
 */

export interface AttributionData {
  traffic_source: string;
  traffic_medium?: string;
  campaign_name?: string;
  referrer_url?: string;
  landing_page?: string;
  click_id?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  first_visit_at?: string;
}

const STORAGE_KEY = "hamsh_traffic_attribution";

/**
 * Initializes and captures visitor attribution data from the current URL and referrer.
 */
export function captureAttribution(): AttributionData {
  if (typeof window === "undefined") {
    return { traffic_source: "direct" };
  }

  try {
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get("utm_source");
    const utmMedium = params.get("utm_medium");
    const utmCampaign = params.get("utm_campaign");
    const utmContent = params.get("utm_content");
    const utmTerm = params.get("utm_term");

    const fbclid = params.get("fbclid");
    const scClickId = params.get("sc_click_id") || params.get("scclid");
    const ttclid = params.get("ttclid");
    const gclid = params.get("gclid");

    const clickId = scClickId || fbclid || ttclid || gclid || undefined;
    const referrer = document.referrer || "";
    const currentUrl = window.location.pathname + window.location.search;

    let detectedSource = utmSource?.toLowerCase() || "";

    // If source not explicitly in UTM, detect from click IDs or referrer
    if (!detectedSource) {
      if (scClickId) {
        detectedSource = "snapchat";
      } else if (ttclid) {
        detectedSource = "tiktok";
      } else if (gclid) {
        detectedSource = "google";
      } else if (fbclid) {
        detectedSource = referrer.toLowerCase().includes("instagram") ? "instagram" : "facebook";
      } else if (referrer) {
        const refLower = referrer.toLowerCase();
        if (refLower.includes("instagram.com")) {
          detectedSource = "instagram";
        } else if (refLower.includes("snapchat.com")) {
          detectedSource = "snapchat";
        } else if (refLower.includes("facebook.com") || refLower.includes("fb.com")) {
          detectedSource = "facebook";
        } else if (refLower.includes("tiktok.com")) {
          detectedSource = "tiktok";
        } else if (refLower.includes("google.")) {
          detectedSource = "google";
        }
      }
    }

    if (!detectedSource) {
      detectedSource = "direct";
    }

    // Load existing attribution if available (preserve first-touch if current is direct)
    const existingRaw = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
    let existing: AttributionData | null = null;
    if (existingRaw) {
      try {
        existing = JSON.parse(existingRaw);
      } catch {
        existing = null;
      }
    }

    // Only overwrite if new visit has an explicit campaign/source or no existing data
    if (!existing || (detectedSource !== "direct" && detectedSource !== existing.traffic_source)) {
      const data: AttributionData = {
        traffic_source: detectedSource,
        traffic_medium: utmMedium || (clickId ? "paid_ad" : (detectedSource !== "direct" ? "organic" : undefined)),
        campaign_name: utmCampaign || undefined,
        referrer_url: referrer || undefined,
        landing_page: currentUrl,
        click_id: clickId,
        utm_source: utmSource || undefined,
        utm_medium: utmMedium || undefined,
        utm_campaign: utmCampaign || undefined,
        utm_content: utmContent || undefined,
        utm_term: utmTerm || undefined,
        first_visit_at: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    }

    return existing;
  } catch {
    return { traffic_source: "direct" };
  }
}

/**
 * Retrieves attribution data to attach to forms and API submissions.
 */
export function getAttributionPayload(): Partial<AttributionData> {
  if (typeof window === "undefined") {
    return { traffic_source: "direct" };
  }

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }

  return captureAttribution();
}
