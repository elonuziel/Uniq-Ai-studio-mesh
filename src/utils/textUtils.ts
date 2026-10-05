/**
 * Utility functions for cleaning and formatting text from scraped sources
 */

/**
 * Unescapes HTML entities, strips residual HTML tags, and replaces non-breaking spaces
 */
export function cleanHtmlText(text?: string | null): string {
  if (!text) return '';

  return (
    text
      // Unescape common HTML entities
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;|&apos;/gi, "'")
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&rlm;|&lrm;/gi, '')
      .replace(/&ndash;/gi, '–')
      .replace(/&mdash;/gi, '—')
      .replace(/&bull;/gi, '•')
      // Unicode non-breaking space and zero-width spaces
      .replace(/[\u00a0\u1680\u2000-\u200a\u202f\u205f\u3000]/g, ' ')
      .replace(/[\u200b-\u200f\ufeff]/g, '')
      // Strip any stray HTML tags
      .replace(/<[^>]+>/g, '')
      // Normalize multiple horizontal spaces
      .replace(/[ \t]+/g, ' ')
      .trim()
  );
}

/**
 * Formats multi-clause terms into clear, readable paragraphs and bullet points
 */
export function formatDetailsText(text?: string | null): string[] {
  if (!text) return [];

  const cleaned = cleanHtmlText(text);

  // If text already has line breaks, split by line
  if (cleaned.includes('\n')) {
    return cleaned
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
  }

  // Look for inline numbered items like "1- ברכה" or "2- כתובת" (single/double digit followed by dash/dot and a word character)
  // Ensure we DO NOT break phone numbers like "03-6018282"
  const withLineBreaks = cleaned
    .replace(/(?:^|\s)([0-9]{1,2})\s*[-–.)]\s*(?=[א-תA-Za-z])/g, '\n• $1. ')
    .replace(/(\+\s*משלוח[^\n!.]+!)/g, '$1\n')
    .replace(/(לאחר הרכישה באתר המועדון)/g, '\n$1')
    .replace(/(אם המוצר נקנה כמתנה)/g, '\n$1');

  return withLineBreaks
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}
