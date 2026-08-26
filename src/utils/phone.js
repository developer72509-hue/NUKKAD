/**
 * Validates and normalizes an Indian mobile number.
 * Accepts common ways people type it (+91, spaces, dashes, leading 0)
 * and reduces to a plain 10-digit string starting 6-9, or null if invalid.
 */
export function normalizeIndianPhone(raw) {
  if (!raw) return null;
  let digits = String(raw).replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  if (/^[6-9]\d{9}$/.test(digits)) return digits;
  return null;
}

export function isValidIndianPhone(raw) {
  return normalizeIndianPhone(raw) !== null;
}

/**
 * Masks a phone number for privacy, e.g. "7250960371" -> "72XXXX0371".
 * Keeps the first 2 and last 4 digits visible so it's still recognisable
 * without exposing the full number.
 */
export function maskPhone(phone) {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length <= 6) return '•'.repeat(digits.length);

  const prefix = digits.slice(0, 2);
  const suffix = digits.slice(-4);
  const masked = '•'.repeat(digits.length - 6);
  return `${prefix} ${masked} ${suffix}`;
}

/**
 * Statuses at which contact numbers between customer and shop should be
 * hidden again — before the order exists, or once it's fully resolved.
 */
const NUMBER_HIDDEN_STATUSES = new Set(['DELIVERED', 'CANCELLED', 'REJECTED']);

export function shouldShowFullNumber(orderStatus) {
  return Boolean(orderStatus) && !NUMBER_HIDDEN_STATUSES.has(orderStatus);
}
