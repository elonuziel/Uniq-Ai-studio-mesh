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

  it('opens direct link to relevant discount on UNIQ website for specific items', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/מועדון UNIQ/i)).toBeInTheDocument();
    });

    // Switch to Tab B: הטבות לפי מוצר
    const tabBButton = screen.getByRole('button', { name: /הטבות לפי מוצר/i });
    fireEvent.click(tabBButton);

    // Search for "מגש פירות"
    const searchInput = screen.getByPlaceholderText(/חיפוש לפי שם מותג/i);
    fireEvent.change(searchInput, { target: { value: 'מגש פירות' } });

    await waitFor(() => {
      expect(screen.getByText(/מגש פירות עם יין \/ עוגה/i)).toBeInTheDocument();
    });

    // Check direct link on card points to product 2982
    const directLink = screen.getByTitle(/פתח את מגש פירות עם יין \/ עוגה באתר UNIQ/i);
    expect(directLink).toHaveAttribute('href', 'https://www.uniq-club.co.il/product/2982');

    // Click on card to open detail modal
    fireEvent.click(screen.getByText(/מגש פירות עם יין \/ עוגה/i));

    await waitFor(() => {
      const modalLink = screen.getByRole('link', { name: /פתח הטבה זו ישירות באתר הרשמי/i });
      expect(modalLink).toHaveAttribute('href', 'https://www.uniq-club.co.il/product/2982');
    });
  });

  it('cleans HTML entities and &nbsp; from terms and additional details', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/מועדון UNIQ/i)).toBeInTheDocument();
    });

    // Switch to Tab B: הטבות לפי מוצר
    const tabBButton = screen.getByRole('button', { name: /הטבות לפי מוצר/i });
    fireEvent.click(tabBButton);

    // Search for "מגש פירות"
    const searchInput = screen.getByPlaceholderText(/חיפוש לפי שם מותג/i);
    fireEvent.change(searchInput, { target: { value: 'מגש פירות' } });

    await waitFor(() => {
      expect(screen.getByText(/מגש פירות עם יין \/ עוגה/i)).toBeInTheDocument();
    });

    // Open detail modal
    fireEvent.click(screen.getByText(/מגש פירות עם יין \/ עוגה/i));

    await waitFor(() => {
      expect(screen.getByText(/פרטים נוספים:/i)).toBeInTheDocument();
    });

    // Verify raw &nbsp; is NOT present in document
    const modalContent = document.body.innerHTML;
    expect(modalContent).not.toContain('&amp;nbsp;');
    expect(modalContent).not.toContain('&nbsp;');
    // Verify phone number is preserved
    expect(screen.getAllByText(/03-6018282/).length).toBeGreaterThan(0);
  });

  it('searches across all tabs when "חיפוש בכל הלשוניות" is toggled', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/מועדון UNIQ/i)).toBeInTheDocument();
    });

    // Locate the search across all tabs toggle button
    const allTabsToggle = screen.getByTestId('search-all-tabs-toggle');
    expect(allTabsToggle).toBeInTheDocument();
    expect(screen.getAllByText(/חיפוש בכל הלשוניות/i).length).toBeGreaterThan(0);

    // Toggle search across all tabs
    fireEvent.click(allTabsToggle);

    await waitFor(() => {
      // The AllTabsView container should be active
      expect(screen.getByTestId('all-tabs-view')).toBeInTheDocument();
      expect(screen.getByText(/תוצאות חיפוש בכל 4 הלשוניות/i)).toBeInTheDocument();
    });

    // Enter a search query present across tabs (e.g. "פוקס")
    const searchInput = screen.getByPlaceholderText(/חיפוש בכל 4 הלשוניות/i);
    fireEvent.change(searchInput, { target: { value: 'פוקס' } });

    await waitFor(() => {
      // Tab A section should display Fox Group
      expect(screen.getByText(/קבוצת פוקס/i)).toBeInTheDocument();
      expect(screen.getByText(/לשונית א': כרטיס נטען 15% הנחה/i)).toBeInTheDocument();
    });

    // Click "הצג רק לשונית זו" to jump to single tab view
    const showOnlyTabA = screen.getByRole('button', { name: /הצג רק לשונית זו/i });
    fireEvent.click(showOnlyTabA);

    await waitFor(() => {
      // AllTabsView should no longer be active, single Tab A view should be shown
      expect(screen.queryByTestId('all-tabs-view')).not.toBeInTheDocument();
      expect(screen.getByText(/קבוצת פוקס/i)).toBeInTheDocument();
    });
  });

  it('shows smart discovery prompt when item is not in current tab but exists in other tabs', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/קבוצת פוקס/i)).toBeInTheDocument();
    });

    // Search for an item deal that is in Tab B (e.g., "מגש פירות") while currently on Tab A
    const searchInput = screen.getByPlaceholderText(/חיפוש לפי שם מותג/i);
    fireEvent.change(searchInput, { target: { value: 'מגש פירות' } });

    await waitFor(() => {
      // Prompt should appear offering to search across all tabs
      expect(screen.getByText(/לא נמצאו תוצאות עבור/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /הצג תוצאות מכל הלשוניות/i })).toBeInTheDocument();
    });

    // Clicking the button activates all-tabs search
    const viewAllBtn = screen.getByRole('button', { name: /הצג תוצאות מכל הלשוניות/i });
    fireEvent.click(viewAllBtn);

    await waitFor(() => {
      expect(screen.getByTestId('all-tabs-view')).toBeInTheDocument();
      expect(screen.getByText(/מגש פירות עם יין \/ עוגה/i)).toBeInTheDocument();
    });
  });

  it('keeps light mode as default and toggles dark mode via the top button', async () => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/מועדון UNIQ/i)).toBeInTheDocument();
    });

    // Verify light mode is default
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    const darkModeToggle = screen.getByTestId('dark-mode-toggle');
    expect(darkModeToggle).toBeInTheDocument();
    expect(screen.getByText(/מצב כהה/i)).toBeInTheDocument();

    // Toggle dark mode on
    fireEvent.click(darkModeToggle);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(screen.getByText(/מצב בהיר/i)).toBeInTheDocument();

    // Toggle back to light mode
    fireEvent.click(darkModeToggle);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
    expect(screen.getByText(/מצב כהה/i)).toBeInTheDocument();
  });
});
