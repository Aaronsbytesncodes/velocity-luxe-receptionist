/** Velocity Luxe Media — public pricing (USD/mo, after 7-day trial) */

export const TRIAL_DAYS = 7;

export const PRICING = {
  essentials: {
    name: "Essentials",
    monthly: 297,
    tagline: "Business hours coverage",
    includes: [
      "1 business line",
      "AI answers & qualifies leads",
      "Real calendar booking",
      "SMS lead alerts",
      "500 voice minutes / mo",
    ],
  },
  professional: {
    name: "Professional",
    monthly: 497,
    tagline: "24/7 — most popular",
    popular: true,
    includes: [
      "Everything in Essentials",
      "24/7 answering",
      "Emergency call prioritization",
      "Call transcripts & dashboard",
      "1,200 voice minutes / mo",
    ],
  },
  elite: {
    name: "Elite",
    monthly: 797,
    tagline: "Multi-location & high volume",
    includes: [
      "Everything in Professional",
      "2 dedicated lines",
      "Outbound appointment reminders",
      "Priority onboarding & script tuning",
      "2,500 voice minutes / mo",
    ],
  },
} as const;

/** Default tier quoted on cold calls */
export const DEFAULT_SALES_TIER = PRICING.professional;

export function formatMonthly(amount: number) {
  return `$${amount.toLocaleString("en-US")}`;
}

export function roiPitch(monthly: number) {
  return `One booked job you would have missed covers ${Math.max(1, Math.floor(2500 / monthly))}+ months.`;
}
