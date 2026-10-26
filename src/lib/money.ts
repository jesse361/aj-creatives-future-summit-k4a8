export function formatMoney(cents: number, currency: string) {
  if (!Number.isInteger(cents)) return "";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} ${currency}`;
  }
}

export function formatMajor(cents: number, currency: string) {
  if (!Number.isInteger(cents)) return "";
  if (cents === 0) return "Free";
  const major = cents / 100;
  const amount = Number.isInteger(major) ? String(major) : major.toFixed(2);
  return `${currency.toUpperCase()} ${amount}`;
}

export function parsePriceToCents(value: string) {
  const normalized = value.trim().replace(/,/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  const cents = Math.round(Number(normalized) * 100);
  if (!Number.isSafeInteger(cents) || cents < 0 || cents > 100_000_000) return null;
  return cents;
}
