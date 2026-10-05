import os
import json
import pytest

RECHARGEABLE_PATH = "public/data/rechargeable_benefits.json"
SCRAPED_PATH = "public/data/scraped_benefits.json"

def test_files_exist():
    assert os.path.exists(RECHARGEABLE_PATH), f"Missing {RECHARGEABLE_PATH}"
    assert os.path.exists(SCRAPED_PATH), f"Missing {SCRAPED_PATH}"

def test_rechargeable_benefits_structure_and_metadata():
    with open(RECHARGEABLE_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    assert "metadata" in data
    assert "global_rules" in data
    assert "brands" in data
    
    meta = data["metadata"]
    assert "last_updated" in meta or "last_verified" in meta
    assert meta.get("scraper") == "scrape_max_pdf.py" or "source_pdf_url" in meta
    assert "source_pdf_hash" in meta
    assert meta.get("verification_status") == "VERIFIED_LIVE_SOURCE"

    rules = data["global_rules"]
    assert "minimum_load" in rules
    assert "daily_load_cap" in rules
    assert "monthly_load_cap" in rules
    assert "maximum_card_balance" in rules
    assert "validity" in rules
    
    brands = data["brands"]
    assert len(brands) >= 30, f"Expected at least 30 brands, got {len(brands)}"
    
    for brand in brands:
        assert "id" in brand
        assert "name" in brand
        assert "category" in brand
        assert "discount" in brand
        assert "restrictions" in brand
        assert "badges" in brand
        assert isinstance(brand["badges"], list)
        assert len(brand["badges"]) > 0

def test_scraped_benefits_tabs_integrity_and_metadata():
    with open(SCRAPED_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    assert "metadata" in data
    assert "item_deals" in data
    assert "brand_discounts" in data
    assert "billing_stage_discounts" in data
    
    meta = data["metadata"]
    assert "last_updated" in meta or "scraped_at" in meta
    assert "api_endpoint" in meta
    assert "counts" in meta
    
    tab_b = data["item_deals"]
    tab_c = data["brand_discounts"]
    tab_d = data["billing_stage_discounts"]
    
    assert len(tab_b) > 20, f"Expected >20 item deals in Tab B, found {len(tab_b)}"
    assert len(tab_c) > 20, f"Expected >20 brand discounts in Tab C, found {len(tab_c)}"
    assert len(tab_d) > 20, f"Expected >20 billing discounts in Tab D, found {len(tab_d)}"
    
    required_fields = ["id", "name", "category", "discount", "terms"]
    
    for item in tab_b:
        for rf in required_fields:
            assert rf in item, f"Tab B item {item.get('id')} missing {rf}"
            
    for item in tab_c:
        for rf in required_fields:
            assert rf in item, f"Tab C item {item.get('id')} missing {rf}"
            
    for item in tab_d:
        for rf in required_fields:
            assert rf in item, f"Tab D item {item.get('id')} missing {rf}"

def test_cross_referencing():
    with open(RECHARGEABLE_PATH, "r", encoding="utf-8") as f:
        rec_data = json.load(f)
    with open(SCRAPED_PATH, "r", encoding="utf-8") as f:
        scraped_data = json.load(f)

    total_refs_a = sum(len(b.get("cross_references", [])) for b in rec_data["brands"])
    assert total_refs_a >= 1, "Tab A should have cross references to overlapping brands"

def test_no_html_entities_in_scraped_data():
    with open(SCRAPED_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    for category_key in ["item_deals", "brand_discounts", "billing_stage_discounts"]:
        for item in data[category_key]:
            terms = item.get("terms", "")
            name = item.get("name", "")
            assert "&nbsp;" not in terms, f"Found &nbsp; in {item['id']} terms: {terms}"
            assert "&nbsp;" not in name, f"Found &nbsp; in {item['id']} name: {name}"
            assert "&amp;" not in terms, f"Found &amp; in {item['id']} terms: {terms}"

