/**
 * Date calculation and staleness helper utilities
 */

export const getDaysDifference = (isoString?: string): number | null => {
  if (!isoString) return null;
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return null;

  const now = new Date();
  const diffTime = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 ? diffDays : 0;
};

export const isDataStale = (isoString?: string, thresholdDays: number = 10): boolean => {
  const days = getDaysDifference(isoString);
  if (days === null) return false;
  return days > thresholdDays;
};

export const formatHebrewDate = (isoString?: string): string => {
  if (!isoString) return 'לא זמין';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString('he-IL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
};
