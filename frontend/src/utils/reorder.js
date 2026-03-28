const DEFAULTS = {
  avg_daily_usage: 1, // units/day
  lead_time_days: 7, // supplier restock lead time
  safety_days: 2, // buffer to avoid stockouts
  min_order_qty: 1, // supplier minimum order quantity
};

const toFiniteNumber = (value, fallback) => {
  const num = typeof value === 'number' ? value : parseFloat(value);
  return Number.isFinite(num) ? num : fallback;
};

const toFiniteInt = (value, fallback) => {
  const num = typeof value === 'number' ? value : parseInt(value, 10);
  return Number.isFinite(num) ? num : fallback;
};

/**
 * Computes reorder quantity using a simple coverage model:
 * reorderPointQty = dailyUsage * (leadTimeDays + safetyDays)
 * recommendedReorderQty = ceil(max(reorderPointQty - currentQty, 0) / minOrderQty) * minOrderQty
 */
export const getReorderAdvice = (item) => {
  const currentQty = toFiniteInt(item?.quantity, 0);

  const dailyUsageRaw = item?.avg_daily_usage;
  const leadTimeRaw = item?.lead_time_days;
  const safetyRaw = item?.safety_days;
  const minOrderQtyRaw = item?.min_order_qty;

  const dailyUsage = toFiniteNumber(dailyUsageRaw, DEFAULTS.avg_daily_usage);
  const leadTimeDays = Math.max(
    0,
    toFiniteNumber(leadTimeRaw, DEFAULTS.lead_time_days)
  );
  const safetyDays = Math.max(0, toFiniteNumber(safetyRaw, DEFAULTS.safety_days));
  const minOrderQty = Math.max(1, toFiniteInt(minOrderQtyRaw, DEFAULTS.min_order_qty));

  const reorderPointDays = leadTimeDays + safetyDays;
  const reorderPointQty = dailyUsage * reorderPointDays;

  const daysOfSupply = dailyUsage > 0 ? currentQty / dailyUsage : Infinity;
  const reorderQtyUnrounded = Math.max(0, reorderPointQty - currentQty);

  const reorderQty =
    reorderQtyUnrounded === 0
      ? 0
      : Math.ceil(reorderQtyUnrounded / minOrderQty) * minOrderQty;

  const urgency =
    reorderQty > 0
      ? daysOfSupply <= safetyDays
        ? 'critical'
        : daysOfSupply <= reorderPointDays
          ? 'soon'
          : 'later'
      : 'ok';

  const usedDefaults =
    dailyUsageRaw == null ||
    leadTimeRaw == null ||
    safetyRaw == null ||
    minOrderQtyRaw == null;

  const confidence = usedDefaults ? 'low' : 'high';

  return {
    currentQty,
    dailyUsage,
    leadTimeDays,
    safetyDays,
    minOrderQty,
    reorderPointDays,
    reorderPointQty,
    daysOfSupply,
    reorderQty,
    urgency,
    confidence,
    usedDefaults,
  };
};

export const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

