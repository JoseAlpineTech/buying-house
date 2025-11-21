import pandas as pd
import json
import os

# --- Configuration ---

METRIC_CONFIG = {
    "realHousePriceIndex": {
        "file": "_artifacts/RHP_RPI_HPI.csv",
        "measure": "RHP",
    },
    "rentPriceIndex": {
        "file": "_artifacts/RHP_RPI_HPI.csv",
        "measure": "RPI",
    },
    "nominalIncome": {
        "file": "_artifacts/INC_DISP.csv",
        "measure": "INC_DISP",
    },
    "cpi": {
        "file": "_artifacts/CPI_HSH.csv",
        "measure": "CPI",
    },
    "numberOfHouseholds": {
        "file": "_artifacts/CPI_HSH.csv",
        "measure": "HSH",
    },
    "mortgageRate": {
        "file": "_artifacts/IRLT.csv",
        "measure": "IRLT",
    },
}

COUNTRIES = [
  "AUS", "AUT", "BEL", "CAN", "CHL", "CRI", "CZE", "DNK", "EST", "FIN", "FRA", "DEU",
  "GRC", "HUN", "ISL", "IRL", "ISR", "ITA", "JPN", "KOR", "LVA", "LTU", "LUX", "MEX",
  "NLD", "NZL", "NOR", "POL", "PRT", "SVK", "SVN", "ESP", "SWE", "CHE", "TUR", "GBR", "USA",
]

CORE_METRICS = ["realHousePriceIndex", "realIncome", "mortgageRate"]
ALL_METRICS = CORE_METRICS + ["rentPriceIndex", "numberOfHouseholds"]

# --- Data Processing Functions ---

def parse_time_period(series):
    return pd.to_numeric(series.astype(str).str[:4], errors='coerce')

def process_series(data_points):
    """
    Standardizes, interpolates, and rounds a list of data points.
    """
    if not data_points: return []
    df = pd.DataFrame(data_points).drop_duplicates(subset=['year']).set_index('year')
    min_year, max_year = df.index.min(), df.index.max()
    # Reindex to fill missing years
    series = df['value'].reindex(range(int(min_year), int(max_year) + 1))
    # Linear Interpolation
    series = series.interpolate(method='linear').dropna()
    final_df = series.reset_index()
    final_df.columns = ['year', 'value']
    final_df['value'] = final_df['value'].round(4)
    final_df['year'] = final_df['year'].astype(int)
    return final_df.to_dict('records')

def process_files():
    all_data = {country: {} for country in COUNTRIES}
    loaded_dfs = {}
    
    for metric, config in METRIC_CONFIG.items():
        file_path, measure = config["file"], config["measure"]
        print(f"\nProcessing metric '{metric}' with measure '{measure}'...")
        try:
            if file_path not in loaded_dfs:
                if not os.path.exists(file_path):
                    print(f"  - WARNING: File not found: {file_path}. Skipping.")
                    continue
                loaded_dfs[file_path] = pd.read_csv(file_path, low_memory=False)
            
            df = loaded_dfs[file_path]
            df_metric = pd.DataFrame()

            if metric == "nominalIncome":
                df_metric = df[(df['MEASURE'] == measure) & (df['STATISTICAL_OPERATION'] == 'MEDIAN') & (df['REF_AREA'].isin(COUNTRIES))].copy()
            else:
                df_metric = df[(df['MEASURE'] == measure) & (df['REF_AREA'].isin(COUNTRIES))].copy()

            print(f"  - Found {len(df_metric)} relevant rows.")

            df_metric['year'] = parse_time_period(df_metric['TIME_PERIOD'])
            df_metric = df_metric.dropna(subset=['year', 'OBS_VALUE'])
            df_metric['year'] = df_metric['year'].astype(int)

            for country, group in df_metric.groupby('REF_AREA'):
                series = group[['year', 'OBS_VALUE']].rename(columns={'OBS_VALUE': 'value'}).to_dict('records')
                
                if metric == "nominalIncome":
                    if country not in all_data: all_data[country] = {}
                    if metric not in all_data[country]: all_data[country][metric] = []
                    all_data[country][metric].extend(series)
                else:
                    all_data[country][metric] = series
        except Exception as e:
            print(f"  - CRITICAL ERROR during processing for '{metric}': {e}")
    return all_data

# --- Special Handling Functions ---

def process_mexico_banxico(raw_data):
    """
    Parses the raw Banxico CSV to fix Mexico's mortgage rates.
    Column SF43426: Tasa de interés promedio de créditos en pesos a tasa fija.
    """
    file_path = "_artifacts/MEX-banxico.csv"
    print("\n--- Processing Mexico Banxico Data ---")
    
    if not os.path.exists(file_path):
        print(f"  - WARNING: {file_path} not found. Skipping Mexico patch.")
        return raw_data

    try:
        df = pd.read_csv(file_path)
        # Filter valid rows
        target_col = "SF43426"
        if target_col not in df.columns:
            print(f"  - ERROR: Column {target_col} not found in Banxico file.")
            return raw_data

        # Drop N/E and convert to numeric
        df = df[df[target_col] != "N/E"].copy()
        df['value'] = pd.to_numeric(df[target_col])
        
        # Parse Date (DD/MM/YYYY)
        df['date'] = pd.to_datetime(df['Fecha'], format="%d/%m/%Y")
        df['year'] = df['date'].dt.year

        # Aggregate by Year (Mean)
        annual_rates = df.groupby('year')['value'].mean().reset_index()
        annual_rates['value'] = annual_rates['value'].round(4)
        
        # Convert to list of dicts
        new_series = annual_rates[['year', 'value']].to_dict('records')

        # Merge/Overwrite into raw_data
        # Since Banxico data is much better than the OECD proxy for mortgage rates, 
        # we prioritize it completely if it overlaps or extends.
        # However, OECD might have earlier data. Let's check overlap.
        
        if "MEX" not in raw_data: raw_data["MEX"] = {}
        current_series = raw_data["MEX"].get("mortgageRate", [])
        
        # Dict map for merging
        merged_map = {item['year']: item['value'] for item in current_series}
        
        # Overwrite/Append with Banxico data
        count = 0
        for item in new_series:
            merged_map[item['year']] = item['value']
            count += 1
            
        # Reconstruct list
        final_series = [{'year': k, 'value': v} for k, v in sorted(merged_map.items())]
        
        raw_data["MEX"]["mortgageRate"] = final_series
        print(f"  - Successfully patched MEX mortgage rates. Total points: {len(final_series)} (Updated/Added: {count})")

    except Exception as e:
        print(f"  - ERROR processing Banxico file: {e}")

    return raw_data

def process_australia_growth(raw_data):
    """
    Applies real income growth rates from AUS_income_growth.csv to extend the series.
    """
    file_path = "_artifacts/AUS_income_growth.csv"
    print("\n--- Processing Australia Income Growth ---")

    if not os.path.exists(file_path):
        print(f"  - WARNING: {file_path} not found. Skipping AUS patch.")
        return raw_data

    if "AUS" not in raw_data or "realIncome" not in raw_data["AUS"]:
        print("  - WARNING: No base realIncome data for AUS to extend.")
        return raw_data

    try:
        growth_df = pd.read_csv(file_path)
        growth_map = dict(zip(growth_df['year'], growth_df['growth_pct']))

        current_series = sorted(raw_data["AUS"]["realIncome"], key=lambda x: x['year'])
        if not current_series:
            return raw_data

        last_point = current_series[-1]
        last_year = int(last_point['year'])
        last_val = float(last_point['value'])

        # Identify years to add
        patch_years = sorted([y for y in growth_map.keys() if y > last_year])
        
        new_points = []
        for year in patch_years:
            growth = growth_map[year]
            # Calculate new value: prev * (1 + pct/100)
            new_val = last_val * (1 + growth / 100.0)
            new_points.append({'year': year, 'value': round(new_val, 4)})
            
            # Update pointers for next iteration
            last_val = new_val
            last_year = year

        if new_points:
            raw_data["AUS"]["realIncome"].extend(new_points)
            print(f"  - Extended AUS income by {len(new_points)} years: {[p['year'] for p in new_points]}")
        else:
            print("  - No new years to add for AUS (Growth data predates or matches existing data).")

    except Exception as e:
        print(f"  - ERROR processing AUS growth file: {e}")

    return raw_data

def synchronize_data(raw_data):
    """
    Enforces that all Core Metrics share the same time range.
    Drops countries with gaps or missing core metrics.
    """
    cleaned_data = {}
    print("\n--- Synchronizing Data Series ---")

    for country in sorted(raw_data.keys()):
        data = raw_data[country]
        
        # 1. Check presence of Core Metrics
        missing_core = [m for m in CORE_METRICS if m not in data or not data[m]]
        if missing_core:
            print(f"[{country}] SKIPPED. Missing core metrics: {missing_core}")
            continue

        # 2. Process/Interpolate individual series first to get continuous ranges
        processed_metrics = {}
        for metric in ALL_METRICS:
            if metric in data:
                processed_metrics[metric] = process_series(data[metric])
            else:
                processed_metrics[metric] = []

        # 3. Find Intersection of Years for CORE METRICS
        core_years = []
        for m in CORE_METRICS:
            years = set(d['year'] for d in processed_metrics[m])
            core_years.append(years)
        
        common_years = set.intersection(*core_years)

        if not common_years:
            print(f"[{country}] SKIPPED. No overlapping years found between Income, Price, and Rates.")
            continue

        min_year = min(common_years)
        max_year = max(common_years)

        # 4. Filter ALL metrics to this Core Range
        final_country_data = {}
        is_valid = True

        for metric in ALL_METRICS:
            series = processed_metrics.get(metric, [])
            # Filter to range
            filtered = [d for d in series if min_year <= d['year'] <= max_year]
            
            if metric in CORE_METRICS and not filtered:
                is_valid = False
                break
            
            filtered.sort(key=lambda x: x['year'])
            final_country_data[metric] = filtered

        if is_valid:
            cleaned_data[country] = final_country_data
            print(f"[{country}] SUCCESS. Range: {min_year}-{max_year} ({len(common_years)} yrs).")
        else:
            print(f"[{country}] SKIPPED. Error during final filtering.")

    return cleaned_data

def generate_typescript_file(data):
    data_as_string = json.dumps(data, indent=2)
    return f"""// This file is generated by scripts/01_fetch_affordability_data.py. Do not edit manually.

export type TimeSeriesDataPoint = {{
  readonly year: number;
  readonly value: number;
}};

export type CountryData = {{
  readonly realHousePriceIndex: readonly TimeSeriesDataPoint[];
  readonly rentPriceIndex: readonly TimeSeriesDataPoint[];
  readonly realIncome: readonly TimeSeriesDataPoint[];
  readonly mortgageRate: readonly TimeSeriesDataPoint[];
  readonly numberOfHouseholds: readonly TimeSeriesDataPoint[];
}};

export type AffordabilityData = {{
  readonly [countryCode: string]: CountryData;
}};

export const affordabilityData = {data_as_string} as const;
"""

if __name__ == "__main__":
    print("Starting data processing from local CSV files...")
    raw_data = process_files()

    print("\nConverting nominal household income to real income using CPI...")
    BASE_YEAR = 2015
    for country, data in raw_data.items():
        if "nominalIncome" in data and "cpi" in data:
            try:
                income_df = pd.DataFrame(data["nominalIncome"]).drop_duplicates(subset='year').sort_values('year')
                cpi_df = pd.DataFrame(data["cpi"]).drop_duplicates(subset='year').sort_values('year')
                
                # Base CPI logic
                cpi_base_value_series = cpi_df[cpi_df['year'] == BASE_YEAR]['value']
                cpi_base_value = 100.0 
                if not cpi_base_value_series.empty:
                    cpi_base_value = cpi_base_value_series.iloc[0]

                merged_df = pd.merge(income_df, cpi_df, on="year", suffixes=('_income', '_cpi'))
                merged_df['value'] = merged_df['value_income'] / (merged_df['value_cpi'] / cpi_base_value)
                
                real_income_series = merged_df[['year', 'value']].to_dict('records')
                data['realIncome'] = real_income_series
                
                del data['nominalIncome']
                del data['cpi']
            except Exception as e:
                print(f"  - WARNING: Could not convert income for {country}. Reason: {e}")

    # --- Apply Patches BEFORE synchronization ---
    raw_data = process_mexico_banxico(raw_data)
    raw_data = process_australia_growth(raw_data)

    # --- Synchronize ---
    final_data = synchronize_data(raw_data)
    
    if not final_data:
        print("\n❌ No valid data could be processed. Aborting.")
        exit(1)

    output_path = os.path.join(os.getcwd(), "data", "affordability.ts")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(generate_typescript_file(final_data))

    countries_found = ", ".join(sorted(final_data.keys()))
    print(f"\n✅ Data successfully written to {output_path}")
    print(f"Included countries ({len(final_data.keys())}): {countries_found}")