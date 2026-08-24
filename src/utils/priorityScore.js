// Priority Scoring Engine
// Computes transparent priority scores per ward based on actual data.
// Weights and thresholds are documented for full transparency.

import { wards } from '../data/wards.js';

/**
 * Compute a priority score (0–100) for a single ward.
 * Returns: { wardId, wardName, score, tier, factors, breakdown }
 *
 * Factors:
 *   A. Infrastructure Condition  (max 30 pts) — worse = higher score
 *   B. Complaint Density         (max 25 pts) — more unresolved = higher
 *   C. Project Delays            (max 20 pts) — more delayed = higher
 *   D. Critical Infrastructure   (max 15 pts) — more critical items = higher
 *   E. Infrastructure Gap        (max 10 pts) — fewer items per km² = higher
 */
export function computeWardPriorityScore(wardId, infrastructure, issues, projects) {
  const ward = wards.find(w => w.id === wardId);
  if (!ward) return null;

  const wardInfra = infrastructure.filter(i => i.wardId === wardId);
  const wardIssues = issues.filter(i => i.wardId === wardId);
  const wardProjects = projects.filter(p => p.wardId === wardId);

  // ── A. Infrastructure Condition ───────────────────────────────────────────────
  // Average condition of all infra; invert so worse infra = higher score
  const avgCondition = wardInfra.length > 0
    ? wardInfra.reduce((sum, i) => sum + i.condition, 0) / wardInfra.length
    : 5;
  // Map [10→0, 1→30]
  const infraConditionScore = Math.round(((10 - avgCondition) / 9) * 30);

  // ── B. Unresolved Complaint Density ───────────────────────────────────────────
  const unresolvedIssues = wardIssues.filter(
    i => !['Resolved', 'Closed'].includes(i.status)
  );
  // Per 10,000 population
  const complaintDensity = (unresolvedIssues.length / (ward.population / 10000));
  // Cap at 5 per 10k → score 25
  const complaintScore = Math.min(Math.round((complaintDensity / 5) * 25), 25);

  // ── C. Project Delays ─────────────────────────────────────────────────────────
  const delayedProjects = wardProjects.filter(p => p.status === 'Delayed');
  // 1 delayed = 7pts, 2 = 14pts, 3+ = 20pts (cap)
  const delayScore = Math.min(delayedProjects.length * 7, 20);

  // ── D. Critical Infrastructure (condition ≤ 4) ────────────────────────────────
  const criticalItems = wardInfra.filter(i => i.condition <= 4);
  // Each critical item = 5pts, max 15
  const criticalScore = Math.min(criticalItems.length * 5, 15);

  // ── E. Infrastructure Gap ─────────────────────────────────────────────────────
  // City average: 40 items / total area km²
  const totalArea = wards.reduce((s, w) => s + w.area, 0);
  const cityAvgDensity = infrastructure.length / totalArea;
  const wardDensity = wardInfra.length / ward.area;
  // Below average = gap = higher score
  const gapRatio = Math.max(0, cityAvgDensity - wardDensity) / cityAvgDensity;
  const gapScore = Math.round(gapRatio * 10);

  const totalScore = Math.min(
    infraConditionScore + complaintScore + delayScore + criticalScore + gapScore,
    100
  );

  const tier = totalScore >= 60 ? 'HIGH'
    : totalScore >= 35 ? 'MEDIUM'
    : 'LOW';

  return {
    wardId,
    wardName: ward.name,
    population: ward.population,
    area: ward.area,
    score: totalScore,
    tier,
    factors: {
      infraConditionScore,
      complaintScore,
      delayScore,
      criticalScore,
      gapScore,
    },
    details: {
      avgCondition: Math.round(avgCondition * 10) / 10,
      unresolvedCount: unresolvedIssues.length,
      totalIssues: wardIssues.length,
      delayedCount: delayedProjects.length,
      totalProjects: wardProjects.length,
      criticalCount: criticalItems.length,
      infraCount: wardInfra.length,
      complaintDensity: Math.round(complaintDensity * 10) / 10,
    }
  };
}

/**
 * Compute priority scores for all wards.
 */
export function computeAllWardPriorities(infrastructure, issues, projects) {
  return wards
    .map(w => computeWardPriorityScore(w.id, infrastructure, issues, projects))
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);
}

export const TIER_STYLES = {
  HIGH:   { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', border: 'border-red-300 dark:border-red-700', dot: '#ef4444' },
  MEDIUM: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-300 dark:border-amber-700', dot: '#f59e0b' },
  LOW:    { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', border: 'border-green-300 dark:border-green-700', dot: '#22c55e' },
};

export const FACTOR_LABELS = {
  infraConditionScore: { label: 'Infrastructure Condition', max: 30, desc: 'Based on average condition score of ward infrastructure (lower condition = higher priority weight).' },
  complaintScore:      { label: 'Unresolved Complaints',   max: 25, desc: 'Based on number of unresolved citizen complaints per 10,000 population.' },
  delayScore:          { label: 'Project Delays',           max: 20, desc: 'Based on number of development projects currently in "Delayed" status.' },
  criticalScore:       { label: 'Critical Infrastructure',  max: 15, desc: 'Count of infrastructure items with condition ≤ 4 (Poor/Critical).' },
  gapScore:            { label: 'Infrastructure Gap',       max: 10, desc: 'Ratio of infrastructure density vs city average — wards with fewer items per km² score higher.' },
};
