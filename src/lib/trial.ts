import { addDays } from "date-fns";

export const TRIAL_DAYS = 7;

export function trialEndDate(from = new Date()) {
  return addDays(from, TRIAL_DAYS);
}

export function isTrialActive(trialEndsAt: Date, status: string) {
  return status === "trial" && trialEndsAt > new Date();
}

export function trialDaysRemaining(trialEndsAt: Date) {
  const ms = trialEndsAt.getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}
