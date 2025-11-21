import json
import os
import re
import sys

def load_typescript_data(filepath):
    """
    Reads the affordability.ts file and extracts the JSON object.
    """
    if not os.path.exists(filepath):
        print(f"Error: File not found at {filepath}")
        sys.exit(1)

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Regex to find the JSON object assigned to affordabilityData
    # Matches: export const affordabilityData = { ... } as const;
    match = re.search(r"export const affordabilityData = ({[\s\S]*?}) as const;", content)
    
    if not match:
        print("Error: Could not find 'affordabilityData' JSON structure in the file.")
        sys.exit(1)

    json_str = match.group(1)
    
    # JavaScript object keys usually aren't quoted in TS, but JSON requires them.
    # The generator script produces valid JSON syntax inside the variable, 
    # so json.loads should work directly if the generator uses json.dumps.
    try:
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON data: {e}")
        sys.exit(1)

def analyze_ranges(data):
    print(f"{'COUNTRY':<8} {'METRIC':<22} {'START':<6} {'END':<6} {'COUNT':<6} {'STATUS'}")
    print("-" * 70)

    metrics_of_interest = [
        "realHousePriceIndex", 
        "realIncome", 
        "mortgageRate", 
        # "numberOfHouseholds", # Less critical for affordability ratios
        # "rentPriceIndex"      # Less critical for mortgage burden
    ]

    for country_code, metrics in sorted(data.items()):
        print(f"[{country_code}]")
        
        ranges = {}
        
        for metric in metrics_of_interest:
            series = metrics.get(metric, [])
            if not series:
                print(f"{'':<8} {metric:<22} {'N/A':<6} {'N/A':<6} {'0':<6} ❌ MISSING")
                continue

            years = [item['year'] for item in series]
            start, end = min(years), max(years)
            count = len(years)
            ranges[metric] = (start, end)

            status = ""
            print(f"{'':<8} {metric:<22} {start:<6} {end:<6} {count:<6} {status}")

        # Calculate Intersection
        if len(ranges) == len(metrics_of_interest):
            latest_starts = [r[0] for r in ranges.values()]
            earliest_ends = [r[1] for r in ranges.values()]
            
            intersection_start = max(latest_starts)
            intersection_end = min(earliest_ends)

            # Check for Valid Intersection
            if intersection_start > intersection_end:
                print(f"\n   ⚠️  CRITICAL GAP: No overlapping timeline.")
                print(f"       Earliest End: {intersection_end} (limit by {min(ranges, key=lambda k: ranges[k][1])})")
                print(f"       Latest Start: {intersection_start} (limit by {max(ranges, key=lambda k: ranges[k][0])})")
            else:
                # Check specific mismatch: Income vs Mortgage Rate
                inc_end = ranges["realIncome"][1]
                rate_end = ranges["mortgageRate"][1]
                diff = abs(inc_end - rate_end)

                if diff > 2:
                    print(f"\n   ⚠️  DATA ASYNC: Metrics out of sync by {diff} years.")
                    print(f"       Income ends: {inc_end}")
                    print(f"       Rates end:   {rate_end}")
        
        print("-" * 70)

if __name__ == "__main__":
    # Assuming script is run from root or scripts/
    path = os.path.join(os.getcwd(), "data", "affordability.ts")
    if not os.path.exists(path):
        # Try going up one level if run from scripts/
        path = os.path.join(os.getcwd(), "..", "data", "affordability.ts")
    
    print(f"Analyzing: {path}\n")
    data = load_typescript_data(path)
    analyze_ranges(data)