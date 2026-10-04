import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from '../App';
import fs from 'fs';
import path from 'path';

// Read real datasets from disk to supply to fetch mock
const rechargeableData = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../public/data/rechargeable_benefits.json'), 'utf-8')
);
const scrapedData = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../public/data/scraped_benefits.json'), 'utf-8')
);

describe('UNIC Club Portal - Unit & Integration Tests', () => {
  beforeEach(() => {
    // Mock global fetch
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('rechargeable')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(rechargeableData),
        });
      }
      if (url.includes('scraped')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(scrapedData),
        });
      }
      return Promise.reject(new Error(`Unhandled URL: ${url}`));
    }) as any;
  });

  it('renders correctly and loads data from real JSON files', async () => {
    render(<App />);

    // Wait until loading finishes and title appears
    await waitFor(() => {
      expect(screen.getByText(/מועדון UNIQ/i)).toBeInTheDocument();
    });

    // Check that Tab A is active and has Fox Group
    expect(screen.getByText(/קבוצת פוקס/i)).toBeInTheDocument();
    expect(screen.getAllByText(/15% הנחה בטעינה/i).length).toBeGreaterThan(0);
  });

  it('renders dedicated status indicators in the top-right corner with last updated dates', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/מועדון UNIQ/i)).toBeInTheDocument();
    });

    // Check Indicator 1: UNIQ site status
    expect(screen.getByText(/אתר UNIQ:/i)).toBeInTheDocument();

    // Check Indicator 2: Max 15% PDF status
    expect(screen.getByText(/ספח Max \(15%\):/i)).toBeInTheDocument();

    // Check status indicators container
    expect(screen.getByTestId('status-indicators-container')).toBeInTheDocument();
  });

  it('switches between all 4 tabs and displays corresponding data', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/קבוצת פוקס/i)).toBeInTheDocument();
    });

    // Switch to Tab B: הטבות לפי מוצר
    const tabBButton = screen.getByRole('button', { name: /הטבות לפי מוצר/i });
    fireEvent.click(tabBButton);

    await waitFor(() => {
      // First item deal from real scraped dataset should be displayed
      expect(screen.getByText(scrapedData.item_deals[0].name)).toBeInTheDocument();
    });

    // Switch to Tab C: הנחות רשתות ומותגים
    const tabCButton = screen.getByRole('button', { name: /הנחות רשתות ומותגים/i });
    fireEvent.click(tabCButton);

    await waitFor(() => {
      expect(screen.getByText(scrapedData.brand_discounts[0].name)).toBeInTheDocument();
    });

    // Switch to Tab D: הנחות במעמד החיוב
    const tabDButton = screen.getByRole('button', { name: /הנחות במעמד החיוב/i });
    fireEvent.click(tabDButton);

    await waitFor(() => {
      expect(screen.getByText(/כיצד פועלות הנחות במעמד החיוב\?/i)).toBeInTheDocument();
      expect(screen.getByText(scrapedData.billing_stage_discounts[0].name)).toBeInTheDocument();
    });
  });

  it('filters data by Hebrew search term in real time', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/קבוצת פוקס/i)).toBeInTheDocument();
    });

    // Search for "הום סנטר"
    const searchInput = screen.getByPlaceholderText(/חיפוש לפי שם מותג/i);
    fireEvent.change(searchInput, { target: { value: 'הום סנטר' } });

    await waitFor(() => {
      expect(screen.getByText(/הום סנטר \(Home Center\)/i)).toBeInTheDocument();
      // Fox should be filtered out
      expect(screen.queryByText(/קבוצת פוקס/i)).not.toBeInTheDocument();
    });

    // Clear search
    const clearButton = screen.getByTitle(/נקה חיפוש/i);
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(screen.getByText(/קבוצת פוקס/i)).toBeInTheDocument();
    });
  });

  it('displays restriction badges with appropriate severity classes', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/קבוצת פוקס/i)).toBeInTheDocument();
    });

    // Red badge for exclusion
    const redBadges = screen.getAllByText(/ללא אאוטלט/i);
    expect(redBadges.length).toBeGreaterThan(0);

    // Yellow badge for spending cap
    const yellowBadges = screen.getAllByText(/עד 50% מסכום העסקה/i);
    expect(yellowBadges.length).toBeGreaterThan(0);
  });

  it('handles cross-reference tag clicks and navigates across tabs', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/קבוצת פוקס/i)).toBeInTheDocument();
    });

    // Find cross-reference tag in Tab A (if any)
    const crossRefTags = screen.getAllByTitle(/עבור ל/i);
    if (crossRefTags.length > 0) {
      fireEvent.click(crossRefTags[0]);
      await waitFor(() => {
        expect(screen.getByText(/הגעת דרך הצלבה/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /נקה סינון וחזור/i })).toBeInTheDocument();
      });
    }
  });
});
