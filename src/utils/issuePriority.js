// ============================================================
// CIVIC ISSUE PRIORITY ENGINE
// ============================================================
// This engine works with REAL Supabase issue records.
// It does NOT depend on static/demo issue data.
//
// Score: 0–100
//
// Factors:
//   A. Severity              → 25
//   B. Safety Risk           → 25
//   C. Location Criticality  → 15
//   D. Urgency               → 10
//   E. Waiting Time          → 5
//   F. Context / Impact      → 20
//
// Total = 100
// ============================================================

const clamp = (value, min = 0, max = 100) =>
  Math.min(Math.max(value, min), max);


// ------------------------------------------------------------
// A. SEVERITY
// ------------------------------------------------------------

function calculateSeverity(issue) {
  const category = String(issue.category || '').toLowerCase();
  const description = String(issue.description || '').toLowerCase();

  let score = 50;
  const reasons = [];

  if (
    category.includes('flood') ||
    category.includes('drain') ||
    category.includes('water')
  ) {
    score = 90;
    reasons.push('Water or flooding-related issue');
  } else if (
    category.includes('road') ||
    category.includes('pothole')
  ) {
    score = 70;
    reasons.push('Road/infrastructure issue');
  } else if (
    category.includes('electric') ||
    category.includes('streetlight') ||
    category.includes('lighting')
  ) {
    score = 60;
    reasons.push('Electrical or lighting issue');
  } else if (
    category.includes('garbage') ||
    category.includes('waste')
  ) {
    score = 55;
    reasons.push('Waste management issue');
  }

  const criticalWords = [
    'danger',
    'dangerous',
    'emergency',
    'critical',
    'collapsed',
    'collapse',
    'blocked',
    'flooded',
    'flooding',
    'accident',
    'unsafe',
  ];

  const matches = criticalWords.filter(word =>
    description.includes(word)
  );

  if (matches.length > 0) {
    score += Math.min(matches.length * 5, 15);

    reasons.push(
      `Critical indicators: ${matches.join(', ')}`
    );
  }

  return {
    score: clamp(score),
    reasons,
  };
}


// ------------------------------------------------------------
// B. SAFETY RISK
// ------------------------------------------------------------

function calculateSafetyRisk(issue) {
  const description = String(issue.description || '').toLowerCase();
  const category = String(issue.category || '').toLowerCase();

  let score = 40;
  const reasons = [];

  const highRiskWords = [
    'school',
    'hospital',
    'accident',
    'danger',
    'dangerous',
    'unsafe',
    'children',
    'traffic',
    'main road',
    'highway',
    'junction',
    'electric',
    'exposed wire',
    'flood',
    'flooded',
  ];

  const matches = highRiskWords.filter(word =>
    description.includes(word)
  );

  if (matches.length > 0) {
    score += Math.min(matches.length * 10, 50);

    reasons.push(
      `Safety-sensitive context: ${matches.join(', ')}`
    );
  }

  if (
    category.includes('flood') ||
    category.includes('electric')
  ) {
    score += 15;
  }

  return {
    score: clamp(score),
    reasons,
  };
}


// ------------------------------------------------------------
// C. LOCATION CRITICALITY
// ------------------------------------------------------------

function calculateLocationCriticality(issue) {
  const description = String(issue.description || '').toLowerCase();

  let score = 30;
  const reasons = [];

  const criticalLocations = [
    'school',
    'hospital',
    'clinic',
    'market',
    'bus stand',
    'bus stop',
    'railway',
    'station',
    'highway',
    'main road',
    'junction',
    'bridge',
  ];

  const matches = criticalLocations.filter(place =>
    description.includes(place)
  );

  if (matches.length > 0) {
    score += Math.min(matches.length * 15, 60);

    reasons.push(
      `Critical location: ${matches.join(', ')}`
    );
  }

  if (issue.latitude != null && issue.longitude != null) {
    score += 10;
    reasons.push('Precise geographic location available');
  }

  return {
    score: clamp(score),
    reasons,
  };
}


// ------------------------------------------------------------
// D. URGENCY
// ------------------------------------------------------------

function calculateUrgency(issue) {
  const description = String(issue.description || '').toLowerCase();

  let score = 40;
  const reasons = [];

  const urgencyWords = [
    'urgent',
    'immediately',
    'immediate',
    'emergency',
    'today',
    'danger',
    'dangerous',
    'blocked',
    'flooded',
  ];

  const matches = urgencyWords.filter(word =>
    description.includes(word)
  );

  if (matches.length > 0) {
    score += Math.min(matches.length * 12, 50);

    reasons.push(
      `Urgency indicators: ${matches.join(', ')}`
    );
  }

  return {
    score: clamp(score),
    reasons,
  };
}


// ------------------------------------------------------------
// E. WAITING TIME
// ------------------------------------------------------------

function calculateWaitingTime(issue) {
  if (!issue.created_at) {
    return {
      score: 20,
      reasons: ['Submission date unavailable'],
    };
  }

  const created = new Date(issue.created_at);
  const now = new Date();

  const ageMs = Math.max(
    0,
    now.getTime() - created.getTime()
  );

  const ageDays =
    ageMs / (1000 * 60 * 60 * 24);

  let score;

  if (ageDays >= 7) {
    score = 100;
  } else if (ageDays >= 5) {
    score = 80;
  } else if (ageDays >= 3) {
    score = 65;
  } else if (ageDays >= 1) {
    score = 45;
  } else {
    score = 20;
  }

  return {
    score,
    reasons: [
      `Issue has been pending for ${Math.floor(
        ageDays
      )} day(s)`,
    ],
  };
}


// ------------------------------------------------------------
// F. CONTEXT / IMPACT
// ------------------------------------------------------------

function calculateContextImpact(issue) {
  const description = String(issue.description || '').toLowerCase();

  let score = 40;
  const reasons = [];

  const impactIndicators = [
    'many people',
    'residents',
    'public',
    'traffic',
    'daily',
    'frequent',
    'multiple',
    'entire area',
    'neighborhood',
    'community',
    'school',
    'market',
    'hospital',
  ];

  const matches = impactIndicators.filter(word =>
    description.includes(word)
  );

  if (matches.length > 0) {
    score += Math.min(matches.length * 8, 40);

    reasons.push(
      `Potential community impact: ${matches.join(', ')}`
    );
  }

  return {
    score: clamp(score),
    reasons,
  };
}


// ============================================================
// MAIN FUNCTION
// ============================================================

export function computeIssuePriority(issue) {
  if (!issue) {
    return null;
  }

  const severity = calculateSeverity(issue);
  const safetyRisk = calculateSafetyRisk(issue);
  const locationCriticality =
    calculateLocationCriticality(issue);
  const urgency = calculateUrgency(issue);
  const waitingTime = calculateWaitingTime(issue);
  const contextImpact =
    calculateContextImpact(issue);

  // Weighted score
  const score = Math.round(
    severity.score * 0.25 +
    safetyRisk.score * 0.25 +
    locationCriticality.score * 0.15 +
    urgency.score * 0.10 +
    waitingTime.score * 0.05 +
    contextImpact.score * 0.20
  );

  let tier = 'LOW';

  if (score >= 75) {
    tier = 'CRITICAL';
  } else if (score >= 60) {
    tier = 'HIGH';
  } else if (score >= 40) {
    tier = 'MEDIUM';
  }

  const reasons = [
    ...severity.reasons,
    ...safetyRisk.reasons,
    ...locationCriticality.reasons,
    ...urgency.reasons,
    ...waitingTime.reasons,
    ...contextImpact.reasons,
  ];

  return {
    issueId: issue.id,

    score: clamp(score),

    tier,

    factors: {
      severity: Math.round(severity.score),
      safetyRisk: Math.round(safetyRisk.score),
      locationCriticality: Math.round(
        locationCriticality.score
      ),
      urgency: Math.round(urgency.score),
      waitingTime: Math.round(waitingTime.score),
      contextImpact: Math.round(
        contextImpact.score
      ),
    },

    reasons: [...new Set(reasons)],
  };
}


// ============================================================
// MULTIPLE ISSUES
// ============================================================

export function computeIssuePriorities(issues = []) {
  return issues
    .map(issue => ({
      issue,
      priority: computeIssuePriority(issue),
    }))
    .filter(item => item.priority)
    .sort(
      (a, b) =>
        b.priority.score -
        a.priority.score
    );
}


// ============================================================
// PRIORITY STYLES
// ============================================================

export const ISSUE_PRIORITY_STYLES = {
  CRITICAL: {
    label: 'Critical',
    className:
      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  },

  HIGH: {
    label: 'High',
    className:
      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  },

  MEDIUM: {
    label: 'Medium',
    className:
      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  },

  LOW: {
    label: 'Low',
    className:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  },
};