/**
 * A shop's `is_open` column is a manual toggle the shopkeeper flips once
 * ("Mark as open" / "Mark as closed") — it does NOT auto-track opening_time /
 * closing_time. Left toggled on, a shop shows "Open now" forever, even hours
 * after its own closing_time has passed.
 *
 * This computes the *actual* live status: the shopkeeper's manual toggle
 * AND the current time falling inside [opening_time, closing_time).
 * Handles overnight windows too (e.g. 20:00 – 02:00).
 */
export function isShopOpenNow(shop, now = new Date()) {
  if (!shop) return false;
  if (!shop.is_open) return false;

  // No schedule configured — fall back to the manual toggle alone.
  if (!shop.opening_time || !shop.closing_time) return true;

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const open = toMinutes(shop.opening_time);
  const close = toMinutes(shop.closing_time);
  if (open == null || close == null) return true;

  if (open === close) return true; // 24-hour shop
  if (open < close) {
    // Same-day window, e.g. 09:00 – 21:00
    return nowMinutes >= open && nowMinutes < close;
  }
  // Overnight window, e.g. 20:00 – 02:00
  return nowMinutes >= open || nowMinutes < close;
}

function toMinutes(timeStr) {
  const match = /^(\d{1,2}):(\d{2})/.exec(timeStr);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}
