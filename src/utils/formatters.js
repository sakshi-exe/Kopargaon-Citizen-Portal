// Utility: formatters used across the application

export const formatCurrency = (amount) => {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatDateShort = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
};

export const isOverdue = (expectedEndDate) => {
  if (!expectedEndDate) return false;
  return new Date(expectedEndDate) < new Date();
};

export const getDaysOverdue = (expectedEndDate) => {
  if (!expectedEndDate) return 0;
  const diff = new Date() - new Date(expectedEndDate);
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
};

export const getProgressColor = (progress) => {
  if (progress >= 80) return 'bg-green-500';
  if (progress >= 50) return 'bg-blue-500';
  if (progress >= 20) return 'bg-amber-500';
  return 'bg-red-500';
};

export const conditionToPercent = (condition) => Math.round((condition / 10) * 100);

export const getBudgetUtilization = (spent, budget) => {
  if (!budget) return 0;
  return Math.round((spent / budget) * 100);
};

export const getRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week(s) ago`;
  if (days < 365) return `${Math.floor(days / 30)} month(s) ago`;
  return `${Math.floor(days / 365)} year(s) ago`;
};

export const pluralize = (n, word) => `${n} ${word}${n !== 1 ? 's' : ''}`;
