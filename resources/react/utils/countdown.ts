export interface ICountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

function toArabicNumerals(str: string): string {
  return str.replace(/\d/g, (d) => ARABIC_DIGITS[Number(d)]);
}

export function padTime(n: number, locale?: string): string {
  const padded = String(n).padStart(2, "0");
  return locale?.startsWith("ar") ? toArabicNumerals(padded) : padded;
}

export function getCountdownParts(target: Date): ICountdownParts {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}
