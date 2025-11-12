### **Core Dataset Requirements**

The guiding principle is finding **matched pairs** of data for prices and income: one series in **Nominal** terms (current prices of the day) and one in **Real** terms (adjusted for inflation, also called "constant prices").

| Metric Group | Data Point Required | Purpose in the Application | What to Look For (Keywords & OECD Codes) |
| :--- | :--- | :--- | :--- |
| **1. House Prices** | **Nominal House Price Index** | Represents the actual, unadjusted price trend of housing. This is the "sticker price" over time. | **Keywords:** `Nominal house price index`, `House price index current prices` <br> **OECD Code likely:** `HPI` |
| | **Real House Price Index** | Shows how house prices have changed relative to inflation. This is the core of the "real" affordability analysis. | **Keywords:** `Real house price index`, `House price index constant prices`, `deflated house price` <br> **OECD Code likely:** `RHP` |
| **2. Income** | **Nominal Household Income** | Represents the average household's actual income in the currency of the day. Needed for nominal calculations. | **Keywords:** `Nominal disposable household income`, `Household income current prices` <br> **OECD Code likely:** `B6N` (but must be the "Current prices" version) |
| | **Real Household Income** | Represents the inflation-adjusted purchasing power of a household. This is the core of the "real" income analysis. | **Keywords:** `Real disposable household income`, `Household income constant prices`, `chain linked volumes` <br> **OECD Code likely:** `B6N_R` or `RDGDI` |
| **3. Rent Prices** | **Nominal Rent Price Index** | Represents the actual, unadjusted price trend of renting. Needed for the nominal Price-to-Rent ratio. | **Keywords:** `Rent price index`, `Rent prices`, `Rental index current prices` <br> **OECD Code likely:** `RPI` |
| | **Real Rent Price Index** | Shows how rent prices have changed relative to inflation. **This is the critical missing piece.** It's required for a valid, inflation-adjusted Price-to-Rent analysis. | **Keywords:** `Real rent price index`, `Rent price index constant prices`, `deflated rent index` <br> **(This may be hard to find and might require a separate search)** |
| **4. Financing** | **Long-Term Interest Rate** | Represents the cost of borrowing. It is used to calculate mortgage payments. This is almost always a nominal rate. | **Keywords:** `Long-term interest rate`, `Mortgage rate`, `Government bond yield 10-year` <br> **OECD Code likely:** `IRLT` or `IRLTLT01` |

---

### **Ideal but Optional Data (The "Holy Grail")**

If you can find these, it would be even better as it would reduce the number of assumptions we have to make:

*   **Median House Price (in local currency):** An actual time series of house prices, not an index. This would be superior to our `BASE_HOUSE_PRICES_2015` constant, making the analysis more precise.
*   **Median Household Income (in local currency):** An actual time series of income, which would align perfectly with the median house price data.

---

### **Suggested Data Sources**

1.  **OECD Data (Primary Source):** This is still the best place to start because of its standardization across countries.
    *   **Dataset to Search:** "Analytical House Prices" is the most likely source for the Price and Rent indices.
    *   **Dataset to Search:** "National Accounts" or "Household Sector and Non-Profit Institutions" for the income data.

2.  **National Statistical Agencies (Excellent Alternative):** These agencies often have more detailed or direct data for their own country.
    *   **United States:** [**FRED (Federal Reserve Economic Data)**](https://fred.stlouisfed.org/). This is an outstanding source. Search for `Median Sales Price of Houses Sold` and `Real Median Household Income`.
    *   **Canada:** [**Statistics Canada (StatCan)**](https://www.statcan.gc.ca/en/start).
    *   **European Union:** [**Eurostat**](https://ec.europa.eu/eurostat/data/database).
    *   **United Kingdom:** [**Office for National Statistics (ONS)**](https://www.ons.gov.uk/).

3.  **International Organizations (Good for Broader Coverage):**
    *   **World Bank Open Data**
    *   **International Monetary Fund (IMF) Data**
