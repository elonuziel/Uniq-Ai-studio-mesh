export type TabKey = 'A' | 'B' | 'C' | 'D';

export interface Badge {
  type: 'red' | 'yellow' | 'blue' | 'slate';
  text: string;
}

export interface CrossReference {
  tab: TabKey;
  target_id?: string;
  name: string;
  label: string;
  tab_name?: string;
}

export interface RechargeableBrand {
  id: string;
  name: string;
  brands: string[];
  category: string;
  discount: string;
  restrictions: string[];
  badges: Badge[];
  notes?: string;
  cross_references?: CrossReference[];
}

export interface GlobalRuleLimit {
  label: string;
  value: string;
}

export interface GlobalRules {
  title: string;
  eligible_cards: string;
  minimum_load: string;
  daily_load_cap: string;
  monthly_load_cap: string;
  maximum_card_balance: string;
  daily_spend_cap: string;
  validity: string;
  default_exclusion: string;
  limits_summary: GlobalRuleLimit[];
}

export interface RechargeableDataset {
  metadata: {
    title: string;
    last_updated?: string;
    last_verified: string;
    scraper?: string;
    source_type?: string;
    source_pdf_url: string;
    source_pdf_hash: string;
    verification_status: string;
    total_brands?: number;
  };
  global_rules: GlobalRules;
  brands: RechargeableBrand[];
}

export interface ScrapedItemDeal {
  id: string;
  original_id: string;
  name: string;
  category: string;
  categories: string[];
  price?: number | null;
  original_price?: number | null;
  discount: string;
  restrictions: string[];
  badges: Badge[];
  terms: string;
  image_url?: string | null;
  tags?: string[];
  cross_references?: CrossReference[];
}

export interface ScrapedBrandDiscount {
  id: string;
  original_id: string;
  name: string;
  category: string;
  categories: string[];
  price?: number | null;
  original_price?: number | null;
  discount: string;
  restrictions: string[];
  badges: Badge[];
  terms: string;
  image_url?: string | null;
  logo_url?: string | null;
  tags?: string[];
  cross_references?: CrossReference[];
}

export interface ScrapedBillingDiscount {
  id: string;
  original_id: string;
  name: string;
  category: string;
  categories: string[];
  discount: string;
  discount_rate: string;
  type: string;
  restrictions: string[];
  badges: Badge[];
  terms: string;
  logo_url?: string | null;
  tags?: string[];
  cross_references?: CrossReference[];
}

export interface ScrapedDataset {
  metadata: {
    title: string;
    last_updated?: string;
    scraped_at: string;
    scraper?: string;
    source: string;
    api_endpoint: string;
    counts: {
      tab_b_deals: number;
      tab_c_brands: number;
      tab_d_billing: number;
      total: number;
    };
  };
  item_deals: ScrapedItemDeal[];
  brand_discounts: ScrapedBrandDiscount[];
  billing_stage_discounts: ScrapedBillingDiscount[];
}

export interface FilterState {
  searchQuery: string;
  selectedCategory: string;
  onlyWithCrossReferences: boolean;
  selectedBadgeType: string | null;
  selectedSort: 'default' | 'name-asc' | 'discount-desc';
}
