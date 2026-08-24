// Planning Insights Engine
// Generates natural-language planning insights based on ward data analysis.
// Uses "recommended", "potential priority", "based on available data" phrasing
// throughout — these are NOT official government decisions.

/**
 * Generate insights for a single ward given its priority score result.
 * @returns string[] — list of natural-language insight strings
 */
export function generateWardInsights(scoreResult, infrastructure, issues, projects) {
  const { wardId, wardName, tier, details, factors } = scoreResult;
  const wardInfra = infrastructure.filter(i => i.wardId === wardId);
  const wardIssues = issues.filter(i => i.wardId === wardId);
  const wardProjects = projects.filter(p => p.wardId === wardId);

  const insights = [];

  // ── Infrastructure Condition Insights ─────────────────────────────────────────
  if (details.avgCondition <= 4.0) {
    const criticalTypes = wardInfra.filter(i => i.condition <= 4).map(i => i.type);
    const uniqueTypes = [...new Set(criticalTypes)].slice(0, 3).join(', ');
    insights.push({
      type: 'critical',
      icon: '⚠️',
      title: 'Critical Infrastructure Condition',
      text: `Based on available data, ${wardName} has an average infrastructure condition score of ${details.avgCondition}/10 — below acceptable thresholds. ${details.criticalCount} item(s) are in poor or critical condition, particularly ${uniqueTypes}. Immediate maintenance and rehabilitation may be recommended as a potential priority action.`
    });
  } else if (details.avgCondition <= 6.0) {
    insights.push({
      type: 'warning',
      icon: '🔧',
      title: 'Deteriorating Infrastructure',
      text: `${wardName} shows a moderate infrastructure condition score of ${details.avgCondition}/10. Based on available data, planned preventive maintenance of ${details.criticalCount > 0 ? `${details.criticalCount} deteriorating item(s)` : 'key assets'} may be recommended to prevent further deterioration.`
    });
  }

  // ── Complaint Density Insights ─────────────────────────────────────────────────
  if (details.complaintDensity >= 4.0) {
    const topCategories = getTopIssueCategories(wardIssues);
    insights.push({
      type: 'critical',
      icon: '📢',
      title: 'High Citizen Complaint Density',
      text: `${wardName} has a potential high-priority concern: ${details.unresolvedCount} unresolved citizen complaint(s) (${details.complaintDensity} per 10,000 population). Based on available data, the most common complaints are related to ${topCategories}. Focused civic response and resource allocation may be recommended.`
    });
  } else if (details.unresolvedCount >= 3) {
    insights.push({
      type: 'warning',
      icon: '📋',
      title: 'Pending Citizen Issues',
      text: `${wardName} has ${details.unresolvedCount} unresolved citizen complaint(s). Based on available data, timely resolution — especially for ${getTopIssueCategories(wardIssues)} issues — may improve citizen satisfaction and prevent issue escalation.`
    });
  }

  // ── Project Delay Insights ─────────────────────────────────────────────────────
  if (details.delayedCount >= 2) {
    const delayedNames = wardProjects.filter(p => p.status === 'Delayed').map(p => p.name).join('; ');
    insights.push({
      type: 'critical',
      icon: '⏰',
      title: 'Multiple Delayed Projects',
      text: `${wardName} has ${details.delayedCount} delayed development project(s): ${delayedNames}. Based on available data, re-evaluation of contractor performance, resource allocation, and funding may be recommended to get these projects back on track.`
    });
  } else if (details.delayedCount === 1) {
    const delayed = wardProjects.find(p => p.status === 'Delayed');
    insights.push({
      type: 'warning',
      icon: '⏰',
      title: 'Project Delay Detected',
      text: `"${delayed?.name}" in ${wardName} is currently behind schedule. Based on available data, monitoring of contractor progress and potential resource intervention may be recommended.`
    });
  }

  // ── Infrastructure Gap Insights ────────────────────────────────────────────────
  if (factors.gapScore >= 7) {
    insights.push({
      type: 'info',
      icon: '🗺️',
      title: 'Infrastructure Gap Identified',
      text: `${wardName} appears to have below-average infrastructure coverage relative to its area (${details.infraCount} items across ${scoreResult.area} km²). Based on available data, expanding infrastructure inventory — particularly in underserved sub-areas — may be a recommended potential priority.`
    });
  }

  // ── Population Density vs Infrastructure ──────────────────────────────────────
  const infraPerCapita = details.infraCount / (scoreResult.population / 10000);
  if (infraPerCapita < 1.0 && scoreResult.population > 40000) {
    insights.push({
      type: 'info',
      icon: '👥',
      title: 'High Population — Low Infrastructure Coverage',
      text: `${wardName} has a population of ${scoreResult.population.toLocaleString()} but only ${details.infraCount} registered infrastructure items. Based on available data, population density vs infrastructure coverage analysis suggests this ward may be a potential priority for infrastructure expansion planning.`
    });
  }

  // ── Positive Insights ──────────────────────────────────────────────────────────
  if (tier === 'LOW' && details.avgCondition >= 7) {
    insights.push({
      type: 'success',
      icon: '✅',
      title: 'Well-Maintained Infrastructure',
      text: `${wardName} demonstrates good infrastructure maintenance with an average condition score of ${details.avgCondition}/10. Based on available data, this ward may serve as a benchmark for maintenance practices across other wards.`
    });
  }

  if (details.delayedCount === 0 && details.totalProjects >= 2) {
    insights.push({
      type: 'success',
      icon: '🏗️',
      title: 'Projects On Schedule',
      text: `All ${details.totalProjects} active development project(s) in ${wardName} are progressing on schedule. Based on available data, continued monitoring is recommended to maintain this performance.`
    });
  }

  // Fallback
  if (insights.length === 0) {
    insights.push({
      type: 'info',
      icon: '📊',
      title: 'Monitoring Recommended',
      text: `${wardName} shows moderate infrastructure and civic indicators. Based on available data, routine monitoring and preventive maintenance may be recommended to maintain current performance levels.`
    });
  }

  return insights;
}

/**
 * Generate city-level strategic insights from all ward data.
 */
export function generateCityInsights(allScores, infrastructure, issues, projects) {
  const cityInsights = [];

  const highPriority = allScores.filter(s => s.tier === 'HIGH');
  const delayed = projects.filter(p => p.status === 'Delayed');
  const totalUnresolved = issues.filter(i => !['Resolved', 'Closed'].includes(i.status)).length;
  const criticalInfra = infrastructure.filter(i => i.condition <= 3);
  const avgCondition = infrastructure.reduce((s, i) => s + i.condition, 0) / infrastructure.length;

  if (highPriority.length > 0) {
    cityInsights.push({
      type: 'critical',
      title: 'High-Priority Wards Identified',
      text: `Based on available data, ${highPriority.map(s => s.wardName).join(' and ')} ${highPriority.length > 1 ? 'are' : 'is'} identified as potential high-priority area(s) requiring urgent attention and recommended resource allocation.`
    });
  }

  if (criticalInfra.length >= 3) {
    cityInsights.push({
      type: 'critical',
      title: 'Critical Infrastructure Requires Attention',
      text: `${criticalInfra.length} infrastructure item(s) across the city are in critical condition. Based on available data, an emergency maintenance audit may be recommended for these assets.`
    });
  }

  if (delayed.length >= 3) {
    cityInsights.push({
      type: 'warning',
      title: 'Multiple Project Delays',
      text: `${delayed.length} development project(s) are currently delayed. Based on available data, a cross-departmental review of contractor performance and resource allocation may be recommended to accelerate delivery.`
    });
  }

  if (totalUnresolved > 20) {
    cityInsights.push({
      type: 'warning',
      title: 'High Unresolved Complaint Backlog',
      text: `The city has ${totalUnresolved} unresolved citizen complaints. Based on available data, a complaint resolution drive and assignment review may be recommended to reduce the backlog.`
    });
  }

  if (avgCondition >= 5.5) {
    cityInsights.push({
      type: 'success',
      title: 'Overall Infrastructure Above Moderate',
      text: `City-wide average infrastructure condition is ${avgCondition.toFixed(1)}/10, which is above the moderate threshold. Based on available data, continued preventive maintenance programs are recommended to sustain this level.`
    });
  }

  return cityInsights;
}

// Helper: extract top issue categories from ward issues
function getTopIssueCategories(wardIssues) {
  const counts = {};
  wardIssues.forEach(i => {
    if (!['Resolved', 'Closed'].includes(i.status)) {
      counts[i.category] = (counts[i.category] || 0) + 1;
    }
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([cat]) => cat)
    .join(' and ') || 'various categories';
}

export const INSIGHT_TYPE_STYLES = {
  critical: { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', title: 'text-red-800 dark:text-red-300', icon: 'text-red-500' },
  warning:  { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', title: 'text-amber-800 dark:text-amber-300', icon: 'text-amber-500' },
  info:     { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', title: 'text-blue-800 dark:text-blue-300', icon: 'text-blue-500' },
  success:  { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800', title: 'text-green-800 dark:text-green-300', icon: 'text-green-500' },
};
