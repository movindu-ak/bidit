/**
 * Pricing Suggestion Service
 *
 * Architecture: Strategy Pattern
 * ─────────────────────────────
 * The `PricingStrategy` interface decouples the algorithm from the caller.
 * Today: RuleBasedPricingStrategy (deterministic multipliers).
 * Future: swap in AIPricingStrategy (POST /api/pricing/suggest → LLM).
 *
 * To add AI later:
 *   1. Create AIPricingStrategy implementing PricingStrategy
 *   2. Change the `activeStrategy` export below to `new AIPricingStrategy()`
 *   3. No other file needs to change.
 */

// ── Types ────────────────────────────────────────────────────────────────────

export interface PricingInput {
  basePrice: number;
  condition: string;       // "New" | "Excellent" | "Good" | "Fair" | "Poor"
  year: number;            // manufacture year
  mileage?: number;        // km
  category?: string;
}

export interface PricingResult {
  suggestedStartingBid: number;
  discountPercent: number;   // e.g. 15 means "15% below base price"
  reasoning: string;         // human-readable explanation shown in the form
}

// ── Strategy Interface ───────────────────────────────────────────────────────

export interface PricingStrategy {
  suggest(input: PricingInput): PricingResult;
}

// ── Rule-Based Implementation ────────────────────────────────────────────────

/**
 * RuleBasedPricingStrategy
 *
 * Starting bid = basePrice × conditionMultiplier × ageFactor
 *
 * conditionMultiplier:
 *   New       → 95% (small discount to attract first bidder)
 *   Excellent → 88%
 *   Good      → 80%
 *   Fair      → 70%
 *   Poor      → 60%
 *
 * ageFactor: lose 0.5% per year over 3 years (capped at -10%)
 */
class RuleBasedPricingStrategy implements PricingStrategy {
  private readonly conditionMultipliers: Record<string, number> = {
    new: 0.95,
    excellent: 0.88,
    good: 0.80,
    fair: 0.70,
    poor: 0.60,
  };

  suggest(input: PricingInput): PricingResult {
    const currentYear = new Date().getFullYear();
    const conditionKey = input.condition.toLowerCase();
    const conditionMult = this.conditionMultipliers[conditionKey] ?? 0.80;

    // Age penalty: 0.5% per year over 3 years, max 10%
    const vehicleAge = Math.max(0, currentYear - input.year);
    const agePenalty = Math.min(0.10, Math.max(0, vehicleAge - 3) * 0.005);
    const totalMult = conditionMult - agePenalty;

    const suggestedStartingBid = Math.round(input.basePrice * totalMult / 1000) * 1000;
    const discountPercent = Math.round((1 - totalMult) * 100);

    const conditionLabel = input.condition.charAt(0).toUpperCase() + input.condition.slice(1).toLowerCase();
    const agePart = vehicleAge > 3
      ? `, ${vehicleAge} year old vehicle`
      : "";
    const reasoning = `${conditionLabel} condition${agePart} → ${discountPercent}% below base price`;

    return { suggestedStartingBid, discountPercent, reasoning };
  }
}

// ── Active Strategy (swap this to enable AI) ─────────────────────────────────

const activeStrategy: PricingStrategy = new RuleBasedPricingStrategy();

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * suggestStartingBid
 *
 * Single entry point — delegates to the active strategy.
 * Returns null if basePrice is 0 or invalid.
 */
export function suggestStartingBid(input: PricingInput): PricingResult | null {
  if (!input.basePrice || input.basePrice <= 0) return null;
  return activeStrategy.suggest(input);
}
