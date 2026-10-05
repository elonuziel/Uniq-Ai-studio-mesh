#!/usr/bin/env python3
"""
Dedicated Scraper for UNIQ Club Website
Source: https://admin.uniq-club.co.il/api/graphql
Output: public/data/scraped_benefits.json
"""

import urllib.request
import json
import re
import os
import html
from datetime import datetime

GRAPHQL_URL = "https://admin.uniq-club.co.il/api/graphql"
OUTPUT_PATH = "public/data/scraped_benefits.json"
RECHARGEABLE_PATH = "public/data/rechargeable_benefits.json"

HEADERS = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

def gql_request(query, variables=None):
    body = {"query": query, "variables": variables or {}}
    req = urllib.request.Request(GRAPHQL_URL, data=json.dumps(body).encode('utf-8'), headers=HEADERS)
    with urllib.request.urlopen(req, timeout=25) as resp:
        return json.loads(resp.read().decode('utf-8'))

def clean_html(text):
    if not text:
        return ""
    # Convert breaks to spaces
    text = re.sub(r'<(?:br\s*/?|/p|/div|/li)>', ' ', text, flags=re.IGNORECASE)
    text = re.sub(r'<li[^>]*>', '• ', text, flags=re.IGNORECASE)
    # Strip HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    # Unescape HTML entities (&nbsp;, &amp;, &quot;, &#39;, &gt;, &lt;, etc.)
    text = html.unescape(text)
    # Replace explicit &nbsp; and Unicode non-breaking spaces \xa0
    text = text.replace('\xa0', ' ').replace('&nbsp;', ' ').replace('&nbsp', ' ')
    # Clean zero-width chars
    text = re.sub(r'[\u200b\u200e\u200f\ufeff]', '', text)
    # Normalize multiple whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def scrape_categories():
    print(f"[UNIQ Site Scraper] Querying categories tree from {GRAPHQL_URL}...")
    tree_res = gql_request("""
    query CategoriesTree($shopId: String!) {
      getCategoriesTree(shopId: $shopId) {
        id
        name
        text
        url
      }
    }
    """, {"shopId": "1"})
    
    categories = tree_res.get("data", {}).get("getCategoriesTree", [])
    print(f"[UNIQ Site Scraper] Retrieved {len(categories)} categories")
    return categories

def scrape_items_for_categories(categories):
    union_query = """
    query getCategoryItems($filter: FilterProductsAndBenefitsOfCategoryInput!) {
      findViewEntityUnionProductBenefit(filter: $filter) {
        count
        items {
          __typename
          ... on Product {
            id
            name
            price
            originalPrice
            description
            type
            isFree
            isGift
            tags
            primaryImage {
              id
              url
            }
          }
          ... on Benefit {
            id
            name
            createdAt
            discount
            billingDiscountButtonText
            tags
            logoFile {
              id
              url
            }
          }
        }
      }
    }
    """
    raw_items = {}
    for cat in categories:
        cid = cat["id"]
        cname = cat["name"].strip()
        try:
            res = gql_request(union_query, {"filter": {"categories": [cid]}})
            data = res.get("data", {}).get("findViewEntityUnionProductBenefit", {})
            items = data.get("items", [])
            print(f"[UNIQ Site Scraper] Cat {cid} ({cname}): {len(items)} items")
            for item in items:
                key = f"{item['__typename']}_{item['id']}"
                if key not in raw_items:
                    item_dict = dict(item)
                    item_dict["category_ids"] = [cid]
                    item_dict["category_names"] = [cname]
                    raw_items[key] = item_dict
                else:
                    if cid not in raw_items[key]["category_ids"]:
                        raw_items[key]["category_ids"].append(cid)
                        raw_items[key]["category_names"].append(cname)
        except Exception as e:
            print(f"[UNIQ Site Scraper] Error fetching category {cid}: {e}")
    
    print(f"[UNIQ Site Scraper] Total unique items collected: {len(raw_items)}")
    return raw_items

def classify_items(raw_items):
    tab_b_deals = []
    tab_c_brands = []
    tab_d_billing = []

    for item in raw_items.values():
        typename = item.get("__typename")
        name = clean_html(item.get("name", "")).strip()
        desc = clean_html(item.get("description", ""))
        cats = item.get("category_names", [])
        
        is_billing = (
            "1046" in item.get("category_ids", []) or
            item.get("billingDiscountButtonText") or
            (item.get("discount") and "מעמד החיוב" in item.get("discount")) or
            (item.get("discount") and "במעמד חיוב" in item.get("discount")) or
            (name and "במעמד החיוב" in name)
        )

        if is_billing:
            disc_text = item.get("discount") or "הנחה במעמד החיוב"
            disc_match = re.search(r'(\d+)\s*%', disc_text)
            percentage = disc_match.group(1) + "%" if disc_match else disc_text
            
            badges = [{"type": "blue", "text": "הנחה במעמד החיוב"}]
            if "%" in percentage:
                badges.append({"type": "yellow", "text": percentage + " הנחה"})
            
            tab_d_billing.append({
                "id": f"billing-{item['id']}",
                "original_id": str(item["id"]),
                "name": name,
                "category": cats[0] if cats else "הנחות במעמד החיוב",
                "categories": cats,
                "discount": disc_text,
                "discount_rate": percentage,
                "type": "billing_stage",
                "restrictions": ["ההנחה ניתנת אוטומטית בדף פירוט חיובי האשראי של כרטיס יוניק."],
                "badges": badges,
                "terms": desc or f"הנחה של {percentage} ניתנת באופן אוטומטי במעמד החיוב בחשבון האשראי למשלמים בכרטיס UNIQ.",
                "logo_url": item.get("logoFile", {}).get("url") if item.get("logoFile") else (item.get("primaryImage", {}).get("url") if item.get("primaryImage") else None),
                "tags": item.get("tags") or [],
                "direct_url": f"https://www.uniq-club.co.il/benefit/{item['id']}"
            })
        elif typename == "Product":
            price = item.get("price")
            orig_price = item.get("originalPrice")
            is_voucher_or_coupon = any(w in name for w in ["שובר", "קופון", "הנחה ברשת", "גיפט קארד", "כרטיס", "קוד קופון"]) or any(w in desc for w in ["קוד קופון", "הזנת קוד", "בסניפים"])

            discount_str = ""
            if orig_price and price and orig_price > price:
                diff = orig_price - price
                pct = round((diff / orig_price) * 100)
                discount_str = f"{pct}% הנחה (חיסכון {diff:.0f} ₪)"
            elif price is not None and price == 0:
                discount_str = "חינם לחברי מועדון"
            elif price is not None:
                discount_str = f"{price} ₪ בלבד"

            if is_voucher_or_coupon or any(c in ["אופנה", "לייף סטייל", "שוברים חדשים ומשתלמים", "הטבות מבית MAX"] for c in cats):
                badges = []
                if discount_str:
                    badges.append({"type": "yellow", "text": discount_str})
                if "ללא כפל" in desc:
                    badges.append({"type": "red", "text": "ללא כפל מבצעים"})
                if "באתר" in desc and "בסניפים" not in desc:
                    badges.append({"type": "blue", "text": "רכישה אונליין בלבד"})
                elif "בסניפים" in desc and "באתר" not in desc:
                    badges.append({"type": "blue", "text": "בסניפים בלבד"})

                tab_c_brands.append({
                    "id": f"brand-{item['id']}",
                    "original_id": str(item["id"]),
                    "name": name,
                    "category": cats[0] if cats else "הנחות רשתות ומותגים",
                    "categories": cats,
                    "price": price,
                    "original_price": orig_price,
                    "discount": discount_str or "הטבת מועדון בלעדית",
                    "restrictions": ["בכפוף לתקנון המועדון", "יש להציג קוד/כרטיס במעמד הקנייה"],
                    "badges": badges,
                    "terms": desc or "הטבה ייחודית לחברי מועדון UNIQ.",
                    "image_url": item.get("primaryImage", {}).get("url"),
                    "tags": item.get("tags") or [],
                    "direct_url": f"https://www.uniq-club.co.il/product/{item['id']}"
                })
            else:
                badges = []
                if discount_str:
                    badges.append({"type": "yellow", "text": discount_str})
                if price is not None:
                    badges.append({"type": "blue", "text": f"מחיר מועדון: {price} ₪"})
                if orig_price and orig_price > 0:
                    badges.append({"type": "slate", "text": f"מחיר רגיל: {orig_price} ₪"})

                tab_b_deals.append({
                    "id": f"deal-{item['id']}",
                    "original_id": str(item["id"]),
                    "name": name,
                    "category": cats[0] if cats else "הטבות לפי מוצר",
                    "categories": cats,
                    "price": price,
                    "original_price": orig_price,
                    "discount": discount_str or (f"{price} ₪" if price else "הטבה מיוחדת"),
                    "restrictions": ["מלאי מוגבל", "בכפוף לתנאי אספקה ומשלוח"],
                    "badges": badges,
                    "terms": desc or "מוצר במחיר מועדון UNIQ מיוחד.",
                    "image_url": item.get("primaryImage", {}).get("url"),
                    "tags": item.get("tags") or [],
                    "direct_url": f"https://www.uniq-club.co.il/product/{item['id']}"
                })
        else:
            disc_text = item.get("discount") or "הטבת מועדון"
            tab_c_brands.append({
                "id": f"brand-ben-{item['id']}",
                "original_id": str(item["id"]),
                "name": name,
                "category": cats[0] if cats else "הנחות רשתות ומותגים",
                "categories": cats,
                "discount": disc_text,
                "restrictions": ["בכפוף לתקנון המועדון"],
                "badges": [{"type": "yellow", "text": disc_text}],
                "terms": desc or "הטבה בלעדית למחזיקי כרטיס יוניק.",
                "logo_url": item.get("logoFile", {}).get("url") if item.get("logoFile") else None,
                "tags": item.get("tags") or [],
                "direct_url": f"https://www.uniq-club.co.il/benefit/{item['id']}"
            })

    print(f"[UNIQ Site Scraper] Breakdown: Tab B: {len(tab_b_deals)}, Tab C: {len(tab_c_brands)}, Tab D: {len(tab_d_billing)}")
    return tab_b_deals, tab_c_brands, tab_d_billing

def enrich_with_cross_references(tab_b, tab_c, tab_d):
    """Link against rechargeable card if present"""
    if not os.path.exists(RECHARGEABLE_PATH):
        return
    try:
        with open(RECHARGEABLE_PATH, "r", encoding="utf-8") as f:
            rec_data = json.load(f)
        
        tab_a_brands = {}
        for item in rec_data.get("brands", []):
            subnames = item.get("brands", []) + [item["name"]]
            for sub in subnames:
                norm = re.sub(r'[\(\)\"\']', '', sub).strip().lower()
                if len(norm) >= 3:
                    tab_a_brands[norm] = {"id": item["id"], "name": item["name"]}

        for items_list, tab_letter in [(tab_b, "B"), (tab_c, "C"), (tab_d, "D")]:
            for item in items_list:
                name_lower = item["name"].lower()
                refs = []
                for brand_key, ref_info in tab_a_brands.items():
                    if brand_key in name_lower or any(word in name_lower for word in brand_key.split() if len(word) > 3):
                        refs.append({
                            "tab": "A",
                            "target_id": ref_info["id"],
                            "name": ref_info["name"],
                            "label": "תקף גם בכרטיס נטען 15%"
                        })
                        break
                item["cross_references"] = refs
    except Exception as e:
        print(f"[UNIQ Site Scraper] Warning during cross-referencing: {e}")

def main():
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    categories = scrape_categories()
    raw_items = scrape_items_for_categories(categories)
    tab_b, tab_c, tab_d = classify_items(raw_items)
    enrich_with_cross_references(tab_b, tab_c, tab_d)

    now_iso = datetime.utcnow().isoformat() + "Z"
    dataset = {
        "metadata": {
            "title": "הטבות ומבצעים מועדון UNIQ (חיבור חי)",
            "scraper": "scrape_uniq_site.py",
            "last_updated": now_iso,
            "scraped_at": now_iso,
            "source": "https://www.uniq-club.co.il",
            "api_endpoint": GRAPHQL_URL,
            "counts": {
                "tab_b_deals": len(tab_b),
                "tab_c_brands": len(tab_c),
                "tab_d_billing": len(tab_d),
                "total": len(tab_b) + len(tab_c) + len(tab_d)
            }
        },
        "item_deals": tab_b,
        "brand_discounts": tab_c,
        "billing_stage_discounts": tab_d
    }

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(dataset, f, ensure_ascii=False, indent=2)

    print(f"[UNIQ Site Scraper] Successfully saved {OUTPUT_PATH} ({dataset['metadata']['counts']['total']} items, updated {now_iso})")

if __name__ == "__main__":
    main()
