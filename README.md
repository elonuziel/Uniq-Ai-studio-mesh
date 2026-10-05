# UNIQ Club Benefits & Discounts Portal

[![Deploy to GitHub Pages](https://github.com/ElonUziel/uniq-card-discounts/actions/workflows/deploy.yml/badge.svg)](https://github.com/ElonUziel/uniq-card-discounts/actions/workflows/deploy.yml)
[![Weekly Scraper Automation](https://github.com/ElonUziel/uniq-card-discounts/actions/workflows/scrape.yml/badge.svg)](https://github.com/ElonUziel/uniq-card-discounts/actions/workflows/scrape.yml)

> A modern, responsive portal tailored for Hebrew (RTL) that consolidates, filters, and cross-references all benefits, discounts, and vouchers for the UNIQ / MAX Executive Club credit card.

## 🌐 Live Website (GitHub Pages)

- **GitHub Pages Live Site:** [https://elonuziel.github.io/uniq-card-discounts/](https://elonuziel.github.io/uniq-card-discounts/)
- **GitHub Repository:** [https://github.com/ElonUziel/uniq-card-discounts](https://github.com/ElonUziel/uniq-card-discounts)

---

## 📋 Overview: The 4 Benefit Pillars

The portal categorizes all UNIQ club discounts into 4 distinct tabs:

1. **Tab A — 15% Rechargeable Gift Card:**
   - Covers all participating retail chains, fashion brands, restaurants, and home goods groups.
   - Verified directly against the official Max Executive PDF document (`gc-ex-digital.pdf`).
   - Detailed terms: daily/monthly recharge limits, maximum card balances, exclusions (e.g., outlet stores, Eilat branches), and operational notes.
2. **Tab B — Item-Specific Deals & Vouchers:**
   - Synchronized live from the UNIQ website GraphQL API (`uniq-club.co.il`).
   - Exclusive club prices, vouchers, and product deals across electronics, home, lifestyle, and food.
3. **Tab C — Brand & Retailer Discounts:**
   - Online coupons, physical branch vouchers, and ongoing brand privileges.
4. **Tab D — Billing-Stage Statement Discounts:**
   - Automatic discounts (ranging from 1% to 50%) deducted directly on the monthly credit card bill at gas stations, dining, services, and supermarkets. No coupon or voucher required.

---

## ✨ Key Features & Architecture

- **Dedicated Real-Time Scraper Status Indicators:**
  - 🟢 **UNIQ Official Website:** Displays the exact synchronization timestamp from `scraped_benefits.json` metadata, total item count, and an active status badge.
  - 🟢 **Max PDF (15% Rechargeable):** Shows the verification timestamp and cryptographic SHA-256 hash of the verified Max terms sheet.
- **Smart Data Staleness Warning System:**
  - Automatically assesses the freshness of the scraped website data.
  - If the website data is older than **10 days**, the status indicator transitions from emerald green to an amber warning badge with the exact age (e.g., *14 days old*), and a subtle dismissible notification banner alerts the user that online prices or promotions might have changed.
  - The Max PDF status remains independent and isolated.
- **Direct Link Integration:**
  - One-click external links on every card and inside the detail modal navigate directly to the specific deal or benefit on the official UNIQ website (e.g., `/product/2982` or `/benefit/1025`).
- **Cross-Referencing Engine:**
  - Identifies overlapping brands present across multiple discount categories (e.g., brands available via both the 15% Rechargeable Card and a billing-stage discount).
  - Clicking a cross-reference tag instantly navigates to the target tab, filters by the brand, and highlights the corresponding card with a glowing visual pulse.
- **Visual Restriction & Policy Badges:**
  - 🔴 **Red:** Exclusions and restrictions (e.g., *No outlets*, *Not valid in Duty Free*, *No club stacking*, *Excludes Eilat*).
  - 🟡 **Yellow:** Spending caps & thresholds (e.g., *Up to 500 ₪*, *Up to 50% of transaction*).
  - 🔵 **Blue / Slate:** Usage conditions (e.g., *Online only*, *In-store only*, *Free shipping*).
- **Sanitized Typography & Clean Modal Formatting:**
  - HTML entities (such as `&nbsp;`, `&amp;`, quotes) are decoded and cleaned.
  - Multi-clause conditions and delivery guidelines are structured into clean, numbered bullet points and legible paragraphs.
- **Automated CI/CD Workflows:**
  - **Weekly Scraper Automation (`.github/workflows/scrape.yml`):** Runs every Sunday at midnight via GitHub Actions to fetch updated GraphQL catalog items, update JSON data, and commit fresh data.
  - **GitHub Pages Deployment (`.github/workflows/deploy.yml`):** Automatically builds and publishes the production bundle on pushes to `main`.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Testing:**
  - **Frontend:** Vitest, React Testing Library, `@testing-library/jest-dom` (11 unit/integration test cases)
  - **Scraper / Data:** Python 3, Pytest (5 data integrity test cases)
- **Data Pipelines:** Python 3 (`urllib`, `re`, `html`, `hashlib`, `json`) querying the UNIQ GraphQL API and downloading the Max PDF.

---

## 📂 Project Structure

```text
├── .github/
│   └── workflows/
│       ├── deploy.yml            # Automated GitHub Pages CI/CD
│       └── scrape.yml            # Scheduled weekly data refresh
├── public/
│   └── data/
│       ├── rechargeable_benefits.json  # Tab A verified data (Max PDF)
│       └── scraped_benefits.json       # Tabs B, C, D data (UNIQ website)
├── scripts/
│   ├── scrape_max_pdf.py         # Dedicated Max PDF downloader & parser
│   ├── scrape_uniq_site.py       # GraphQL scraper for uniq-club.co.il
│   └── scraper.py                # Pipeline orchestrator & cross-referencer
├── src/
│   ├── components/
│   │   ├── BadgePill.tsx         # Color-coded restriction badges
│   │   ├── CrossReferenceTag.tsx # Inter-tab cross-link tags
│   │   ├── DetailModal.tsx       # Full policy & terms dialog with direct link
│   │   ├── GlobalRulesCard.tsx   # Card-level recharging limits & rules
│   │   ├── Navbar.tsx            # Navigation tabs & counters
│   │   ├── SearchAndFilterBar.tsx# Dynamic search and category filtering
│   │   ├── StatusIndicators.tsx  # Live sync status & staleness indicators
│   │   ├── TabAView.tsx          # 15% Rechargeable Card grid
│   │   ├── TabBView.tsx          # Item deals grid
│   │   ├── TabCView.tsx          # Brand discounts grid
│   │   └── TabDView.tsx          # Billing-stage discounts grid
│   ├── test/
│   │   ├── App.test.tsx          # Vitest integration & navigation tests
│   │   └── StatusIndicators.test.tsx # Staleness warning unit tests
│   ├── utils/
│   │   ├── dateUtils.ts          # Date difference & staleness calculations
│   │   └── textUtils.ts          # HTML entity decoding & text formatting
│   ├── types.ts                  # Shared TypeScript interfaces
│   ├── App.tsx                   # Main stateful application
│   └── index.css                 # Tailwind directives & RTL styling
├── tests/
│   └── test_scraper_data.py      # Pytest data validation & entity checks
├── package.json
├── vite.config.ts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** v18 or later (v20+ recommended)
- **npm:** v9 or later
- **Python:** v3.9 or later (for scraper scripts and pytest)

### Installation

```bash
# Clone the repository
git clone https://github.com/ElonUziel/uniq-card-discounts.git
cd uniq-card-discounts

# Install JavaScript dependencies
npm install

# Install Python testing dependencies (optional, for pytest)
pip install pytest
```

### Development Server

Run the local Vite development server:

```bash
npm run dev
```

Open your browser at `http://localhost:3000`.

---

## 🧪 Testing

### Running Frontend Tests (Vitest)

```bash
npm test
```

Runs all 11 Vitest test suites verifying:
- Data loading from real JSON assets.
- Seamless navigation between all 4 tabs.
- Cross-reference click-throughs and pulse animations.
- Direct external link routing for specific items (e.g. `/product/2982`).
- Sanitization of HTML entities (`&nbsp;`) in terms and descriptions.
- Staleness status indicator state transitions and day calculations.

### Running Data Integrity Tests (Pytest)

```bash
npm run test:python
# or
pytest tests/test_scraper_data.py
```

Verifies:
- Valid schema and non-empty datasets for Tabs A, B, C, and D.
- Verification of SHA-256 metadata for the Max PDF.
- Existence of bidirectional cross-references.
- Zero raw HTML entities (`&nbsp;`, `&amp;`) in scraped item terms.

### Code Linting & Type Checking

```bash
npm run lint
```

### Production Build

```bash
npm run build
```

Build outputs are generated in the `dist/` folder, ready for deployment to GitHub Pages or static hosting.

---

## 🔄 Updating Data

To manually run the scraper pipeline and synchronize the latest discounts from both the official Max PDF and the UNIQ GraphQL API:

```bash
python3 scripts/scraper.py
```

This will:
1. Re-validate and parse `gc-ex-digital.pdf`.
2. Query all catalog branches of `admin.uniq-club.co.il/api/graphql`.
3. Compute cross-references between the datasets.
4. Save the updated datasets to `public/data/`.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
