import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StatusIndicators } from '../components/StatusIndicators';
import { isDataStale, getDaysDifference } from '../utils/dateUtils';

describe('StatusIndicators & Staleness Warning', () => {
  it('correctly detects staleness only when date is older than 10 days', () => {
    const now = new Date();
    
    // Fresh: today
    expect(isDataStale(now.toISOString(), 10)).toBe(false);

    // Fresh: 5 days ago
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    expect(isDataStale(fiveDaysAgo.toISOString(), 10)).toBe(false);
    expect(getDaysDifference(fiveDaysAgo.toISOString())).toBe(5);

    // Boundary: 10 days ago (not yet older than 10 days)
    const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
    expect(isDataStale(tenDaysAgo.toISOString(), 10)).toBe(false);

    // Stale: 11 days ago
    const elevenDaysAgo = new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000);
    expect(isDataStale(elevenDaysAgo.toISOString(), 10)).toBe(true);
    expect(getDaysDifference(elevenDaysAgo.toISOString())).toBe(11);

    // Stale: 25 days ago
    const twentyFiveDaysAgo = new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000);
    expect(isDataStale(twentyFiveDaysAgo.toISOString(), 10)).toBe(true);
    expect(getDaysDifference(twentyFiveDaysAgo.toISOString())).toBe(25);
  });

  it('renders green indicator when site data is fresh (<= 10 days)', () => {
    const freshDate = new Date().toISOString();
    const pdfDate = new Date().toISOString();

    render(
      <StatusIndicators
        siteLastUpdated={freshDate}
        pdfLastUpdated={pdfDate}
      />
    );

    const siteIndicator = screen.getByTestId('site-status-indicator');
    expect(siteIndicator).toHaveClass('bg-emerald-50/90');
    expect(siteIndicator).not.toHaveClass('bg-amber-50/95');

    // PDF indicator is unchanged and pink
    const pdfIndicator = screen.getByTestId('pdf-status-indicator');
    expect(pdfIndicator).toHaveClass('bg-pink-50/90');
  });

  it('changes color to amber warning indicator when site data is older than 10 days', () => {
    const staleDate = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
    const pdfDate = new Date().toISOString();

    render(
      <StatusIndicators
        siteLastUpdated={staleDate}
        pdfLastUpdated={pdfDate}
      />
    );

    const siteIndicator = screen.getByTestId('site-status-indicator');
    // Color change: from emerald to amber warning
    expect(siteIndicator).toHaveClass('bg-amber-50/95');
    expect(siteIndicator).toHaveClass('border-amber-300');
    expect(siteIndicator).not.toHaveClass('bg-emerald-50/90');

    // Shows 14 days badge
    expect(screen.getByText(/14 ימים/)).toBeInTheDocument();

    // Max PDF indicator remains strictly unchanged (pink)
    const pdfIndicator = screen.getByTestId('pdf-status-indicator');
    expect(pdfIndicator).toHaveClass('bg-pink-50/90');
    expect(pdfIndicator).not.toHaveClass('bg-amber-50/95');

    // Hover tooltip shows staleness warning
    fireEvent.mouseEnter(siteIndicator.parentElement!);
    expect(screen.getByText(/אזהרת עדכניות נתונים/i)).toBeInTheDocument();
  });
});
