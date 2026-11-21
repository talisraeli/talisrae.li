import { PUBLIC_CLARITY_PROJECT_ID, PUBLIC_GA_MEASUREMENT_ID } from "astro:env/client";

/** The optional analytics providers a visitor can allow or decline, each on its own. */
export interface Consent {
  googleAnalytics: boolean;
  clarity: boolean;
}

interface StoredConsent extends Consent {
  version: number;
  updatedAt: string;
}

// Bump this when a provider is added or the Privacy Policy changes materially, so every visitor is asked again.
const CONSENT_VERSION = 1;
const STORAGE_KEY = "cookie-consent";

export const isAnalyticsConfigured = Boolean(PUBLIC_GA_MEASUREMENT_ID || PUBLIC_CLARITY_PROJECT_ID);

/** The visitor's saved choice, or null when they have not chosen yet (or chose under an older version). */
export function getConsent(): Consent | null {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as StoredConsent | null;
    if (!stored || stored.version !== CONSENT_VERSION) return null;
    return { googleAnalytics: stored.googleAnalytics === true, clarity: stored.clarity === true };
  } catch {
    return null;
  }
}

/** Saves the choice and applies it. Withdrawing a consent that was given erases that provider's cookies. */
export function setConsent(consent: Consent) {
  const previous = getConsent();
  const stored: StoredConsent = { ...consent, version: CONSENT_VERSION, updatedAt: new Date().toISOString() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Storage is blocked (e.g. a strict private window): the choice still applies to this page view.
  }

  const withdrewGoogleAnalytics = previous?.googleAnalytics && !consent.googleAnalytics;
  const withdrewClarity = previous?.clarity && !consent.clarity;
  if (withdrewGoogleAnalytics) deleteCookies((name) => name === "_ga" || name.startsWith("_ga_"));
  if (withdrewClarity) {
    window.clarity?.("consent", false); // Erases Clarity's cookies and stops tracking.
    deleteCookies((name) => name === "_clck" || name === "_clsk");
  }

  // A loaded script can't be unloaded, so reload the page to stop it from running any further.
  if (withdrewGoogleAnalytics || withdrewClarity) {
    window.location.reload();
    return;
  }
  applyConsent(consent);
}

/** Loads the providers the visitor allowed. Safe to call more than once. */
export function applyConsent(consent: Consent) {
  if (consent.googleAnalytics) loadGoogleAnalytics();
  if (consent.clarity) loadClarity();
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[] };
  }
}

function loadScript(src: string) {
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function loadGoogleAnalytics() {
  if (!PUBLIC_GA_MEASUREMENT_ID || window.gtag) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    // gtag.js expects the `arguments` object itself, not an array.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  // Analytics only: advertising storage and signals stay denied.
  window.gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("js", new Date());
  window.gtag("config", PUBLIC_GA_MEASUREMENT_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(PUBLIC_GA_MEASUREMENT_ID)}`);
}

function loadClarity() {
  if (!PUBLIC_CLARITY_PROJECT_ID || window.clarity) return;

  const clarity: NonNullable<Window["clarity"]> = function () {
    // Like gtag.js, Clarity's queue expects the `arguments` object itself.
    // eslint-disable-next-line prefer-rest-params
    (clarity.q = clarity.q || []).push(arguments);
  };
  window.clarity = clarity;
  // Analytics only: Microsoft advertising storage stays denied.
  clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" });
  loadScript(`https://www.clarity.ms/tag/${encodeURIComponent(PUBLIC_CLARITY_PROJECT_ID)}`);
}

/** Deletes matching cookies on this host and its parent domains, wherever the provider may have set them. */
function deleteCookies(matches: (name: string) => boolean) {
  const hostParts = window.location.hostname.split(".");
  const domains = [""];
  for (let i = 0; i < hostParts.length - 1; i++) domains.push(`; domain=.${hostParts.slice(i).join(".")}`);

  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (!name || !matches(name)) continue;
    for (const domain of domains) document.cookie = `${name}=; Max-Age=0; path=/${domain}`;
  }
}
