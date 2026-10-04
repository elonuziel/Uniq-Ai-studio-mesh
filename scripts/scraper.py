#!/usr/bin/env python3
"""
Orchestrator script that executes both dedicated scrapers:
1. scrape_max_pdf.py (Max 15% Rechargeable Card PDF)
2. scrape_uniq_site.py (UNIQ Club Website GraphQL API)
And cross-references entities across both datasets.
"""

import subprocess
import sys
import json
import os
import re

def run_script(script_name):
    print(f"[Orchestrator] Running {script_name}...")
    res = subprocess.run([sys.executable, f"scripts/{script_name}"], check=True)
    if res.returncode != 0:
        raise RuntimeError(f"Script {script_name} failed with code {res.returncode}")

def cross_reference():
    print("[Orchestrator] Cross-referencing datasets...")
    rec_path = "public/data/rechargeable_benefits.json"
    scraped_path = "public/data/scraped_benefits.json"
    
    if not (os.path.exists(rec_path) and os.path.exists(scraped_path)):
        print("[Orchestrator] Warning: Cannot cross-reference, files missing")
        return

    with open(rec_path, "r", encoding="utf-8") as f:
        rec_data = json.load(f)
    with open(scraped_path, "r", encoding="utf-8") as f:
        scraped_data = json.load(f)

    # Cross reference Tab A with Tab D and Tab C
    tab_a_brands = {}
    for item in rec_data["brands"]:
        subnames = item.get("brands", []) + [item["name"]]
        for sub in subnames:
            norm = re.sub(r'[\(\)\"\']', '', sub).strip().lower()
            if len(norm) >= 3:
                tab_a_brands[norm] = {"id": item["id"], "name": item["name"]}

    for item in rec_data["brands"]:
        refs = []
        brand_names = [item["name"].lower()] + [b.lower() for b in item.get("brands", [])]
        
        # Check Tab D
        for b_item in scraped_data["billing_stage_discounts"]:
            b_name = b_item["name"].lower()
            if any(bn in b_name or b_name in bn for bn in brand_names if len(bn) > 3):
                refs.append({
                    "tab": "D",
                    "target_id": b_item["id"],
                    "name": b_item["name"],
                    "label": f"הנחה במעמד החיוב ({b_item.get('discount_rate', '')})"
                })
                break
        
        # Check Tab C
        for c_item in scraped_data["brand_discounts"]:
            c_name = c_item["name"].lower()
            if any(bn in c_name or c_name in bn for bn in brand_names if len(bn) > 3):
                refs.append({
                    "tab": "C",
                    "target_id": c_item["id"],
                    "name": c_item["name"],
                    "label": "מבצע והטבת רשת"
                })
                break
        item["cross_references"] = refs

    # Re-save with cross-references
    with open(rec_path, "w", encoding="utf-8") as f:
        json.dump(rec_data, f, ensure_ascii=False, indent=2)

    print("[Orchestrator] Cross-referencing complete.")

def main():
    run_script("scrape_max_pdf.py")
    run_script("scrape_uniq_site.py")
    cross_reference()
    print("[Orchestrator] All scrapers executed successfully.")

if __name__ == "__main__":
    main()
