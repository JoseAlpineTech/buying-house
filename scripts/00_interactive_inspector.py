import pandas as pd
import os
import inquirer

# --- Configuration ---
ARTIFACTS_FOLDER = "_artifacts"
DIVIDER = "=" * 80

# Key columns often found in OECD data that are useful to summarize.
# The script will look for these and report their unique values if they exist.
KEY_COLUMNS_TO_INSPECT = [
    "MEASURE",
    "Measure",
    "UNIT_MEASURE",
    "Unit of measure",
    "PRICE_BASE",
    "Price base",
    "ADJUSTMENT",
    "Adjustment",
    "FREQ",
    "Frequency of observation",
]

def inspect_csv(file_path):
    """
    Performs a comprehensive inspection of a given CSV file and prints a summary.
    """
    print("\n" + DIVIDER)
    print(f"🔬 Inspecting: {file_path}")
    print(DIVIDER)

    try:
        df = pd.read_csv(file_path, low_memory=False)
        print(f"✅ File loaded successfully.")
        print(f"📊 Total Rows: {len(df):,}")
        print(f"🔢 Total Columns: {len(df.columns)}")

        # --- Column List ---
        print("\n--- Columns Present ---")
        print(", ".join(df.columns))

        # --- Data Sample ---
        print("\n--- First 5 Rows ---")
        print(df.head().to_string())

        # --- Key Column Analysis ---
        print("\n--- Key Column Summary ---")
        inspected_cols = set()

        # Special case: Show Measure and its description together if both exist
        if 'MEASURE' in df.columns and 'Measure' in df.columns:
            print("\n>> Combinations of 'MEASURE' and 'Measure':")
            unique_combinations = df[['MEASURE', 'Measure']].drop_duplicates().dropna()
            for _, row in unique_combinations.iterrows():
                print(f"  - Code: {row['MEASURE']:<15} | Description: {row['Measure']}")
            inspected_cols.add('MEASURE')
            inspected_cols.add('Measure')

        # Inspect other key columns
        for col in KEY_COLUMNS_TO_INSPECT:
            if col in df.columns and col not in inspected_cols:
                print(f"\n>> Unique values in '{col}':")
                unique_values = df[col].unique()
                # Limit display for very long lists of unique values
                if len(unique_values) > 15:
                    print(f"  (Showing first 15 of {len(unique_values)})")
                    print(unique_values[:15])
                else:
                    print(unique_values)
                inspected_cols.add(col)

    except FileNotFoundError:
        print(f"❌ ERROR: File not found at '{file_path}'")
    except Exception as e:
        print(f"\n❌ CRITICAL ERROR: Could not process file. Reason: {e}")

    print("\n" + DIVIDER)
    print("Inspection Complete.")
    print(DIVIDER)


def main():
    """
    Main function to find CSVs and prompt the user for selection.
    """
    print("Starting Interactive CSV Inspector...")

    if not os.path.exists(ARTIFACTS_FOLDER):
        print(f"Error: The '{ARTIFACTS_FOLDER}' directory was not found.")
        return

    csv_files = [f for f in os.listdir(ARTIFACTS_FOLDER) if f.endswith('.csv')]

    if not csv_files:
        print(f"No CSV files found in the '{ARTIFACTS_FOLDER}' directory.")
        return

    questions = [
        inquirer.List('file',
                      message="Select a CSV file to inspect (use arrow keys)",
                      choices=csv_files,
                      carousel=True, # Allows looping through the list
                      ),
    ]

    try:
        answers = inquirer.prompt(questions)
        if answers and 'file' in answers:
            selected_file_path = os.path.join(ARTIFACTS_FOLDER, answers['file'])
            inspect_csv(selected_file_path)
        else:
            print("\nNo file selected. Exiting.")
    except Exception as e:
        print(f"\nAn error occurred with the interactive prompt: {e}")
        print("Please ensure the 'inquirer' library is installed correctly (`pip install inquirer`).")


if __name__ == "__main__":
    main()