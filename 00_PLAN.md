Of course. It's the perfect way to wrap up. A clear summary ensures we have a shared vision and a solid starting point for our next session.

Here is the regenerated plan and summary for the application, reflecting the new direction based on our successful data collection and analysis.

---

### **Project Direction Summary: A Focused, "Real Terms" Analysis**

Our extensive data investigation has given us a clear and powerful new direction. We are moving away from building a complex data exploration tool and are now focused on creating a **compelling, story-driven experience.**

The app's new mission is to tell the definitive, **inflation-adjusted story of housing affordability** over the last 40 years. By stripping away the noise of inflation, every number and chart will show the user a true, apples-to-apples comparison of purchasing power over time.

### **The Data Foundation**

Our application will be built on the following three high-quality, verified OECD datasets. This represents our final "single source of truth."

| Metric Group | Dataset Name | Series to be Used |
| :--- | :--- | :--- |
| **Housing Prices** | `Analytical house prices indicators` | `RHP` (Real house price indices) |
| **Household Income** | `NAAG Chapter 5: Households` | `B6N_R_PPP...` (Real net disposable income) |
| **Financing** | `Financial market` | `IRLT` (Long-term interest rates) |

### **The Application Refactor Plan**

This new data foundation leads to a series of powerful improvements across the entire application:

1.  **Core Logic:** The calculation engine will be fundamentally upgraded. Instead of multiplying abstract indices, we will now calculate a real-world house price using our sourced **`Base House Price` for 2015** as an anchor. The app's central metric will be our own, accurately calculated **Real Price-to-Real Income Ratio**, which is a significant improvement in quality.

2.  **UI & User Experience:** The interface will be simplified and made more intuitive.
    *   The confusing "Nominal vs. Real" toggle will be **removed**.
    *   The user's journey will be focused on selecting a **Country** and a **Buyer Scenario**, making the experience more accessible.

3.  **The Snapshot View:** This section will transform from a display of abstract data into a clear, narrative-driven dashboard. It will feature instantly understandable metrics like:
    *   **Est. Real House Price:** A tangible, inflation-adjusted currency value.
    *   **Real Price-to-Income:** A simple ratio (e.g., "8.2") that clearly means "8.2 years of real income to buy a home."
    *   **Mortgage Burden:** A clear percentage of real income.

4.  **The Charts:** The data visualizations will now tell a clearer, more powerful story.
    *   The **`AffordabilityTrendsChart`** will become the centerpiece, plotting our calculated **Real Price-to-Income Ratio** over 40 years.
    *   The planned **`RentPriceDivergenceChart`** will be **removed**, a deliberate choice to ensure every visualization is analytically sound and not misleading.
    *   The **`MortgageBurdenChart`** will now show the burden relative to real income, providing a true historical measure of financial pressure.

### **Addressing the Key Assumption**

We will proceed using the `BASE_HOUSE_PRICES_2015` constants, which are now grounded with credible sources. We acknowledge that these are estimates, but their purpose is to give a relatable **scale** to the data. The historical **shape** and **trend** of affordability are dictated purely by the high-quality, official OECD index data, ensuring the story remains accurate.

### **Immediate Next Step**

With this clear, documented plan, the next and final step of the data phase is to write the definitive ingestion script (`01_fetch_affordability_data.py`) that processes our three chosen CSVs according to the blueprint above.