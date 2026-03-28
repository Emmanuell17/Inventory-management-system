import { getReorderAdvice } from './reorder';

/**
 * Compact text snapshot of inventory for the AI assistant (read-only context).
 */
export function buildInventorySummaryForAI(items, userEmail) {
  const safeItems = Array.isArray(items) ? items : [];
  const lines = [
    `User: ${userEmail || 'unknown'}`,
    `Item count: ${safeItems.length}`,
    `Generated at: ${new Date().toISOString()}`,
    '',
  ];

  if (safeItems.length === 0) {
    lines.push('(No items in inventory.)');
    return lines.join('\n');
  }

  for (const item of safeItems) {
    const a = getReorderAdvice(item);
    const exp = item.expiration_date ? ` | exp:${item.expiration_date}` : '';
    lines.push(
      `- ${item.name} | id:${item.id} | category:${item.category} | qty:${item.quantity} | price:${item.price}${exp} | avgDailyUsage:${a.dailyUsage} | leadDays:${a.leadTimeDays} | safetyDays:${a.safetyDays} | minOrder:${a.minOrderQty} | suggestedReorderQty:${a.reorderQty} | urgency:${a.urgency} | daysOfSupply:${Number.isFinite(a.daysOfSupply) ? a.daysOfSupply.toFixed(1) : 'n/a'}`
    );
  }

  return lines.join('\n');
}
