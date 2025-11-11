Excellent — here’s a matching **incremental plan for Part 2: “How buying a house compares to a regular investment”**, scoped for the same **Next.js + Cloudflare Edge** environment and designed to build seamlessly on Part 1.

---

## 🧩 Phase 0 – Baseline Integration

**Goal:** Extend the existing Part 1 app structure.

* Reuse layout, country selector, and shared data store.
* Add a **new route group** `/investment` or a tabbed dashboard layout (e.g., `/compare`).
* Define a new data namespace `/data/returns.ts` for historical/assumed returns.

  ```ts
  export const returnAssumptions = {
    globalEquity: { mean: 0.06, stdev: 0.15 },
    bonds: { mean: 0.02, stdev: 0.05 },
    inflation: { mean: 0.025 },
  };
  ```

---

## 🧮 Phase 1 – Static Scenario Inputs

**Goal:** Encode key series/assumptions directly in the bundle (Edge-safe).

* Pull from same BIS/OECD structures already present:

  * `housePriceIndex`, `rentIndex`, `mortgageRate`.
* Add typical **country-level equity/bond annual real returns** (5-10 y averages).
* Add constant params in `/config/simulation.ts`:

  * `ltv`, `downPaymentPct`, `term`, `maintenancePct`, `taxRate`, `rentInflation`, `investmentHorizon`.
* Everything lives as TS constants; no fs or API required.

---

## ⚙️ Phase 2 – Computation Engine

**Goal:** Implement the two competing models as pure math functions in `/lib/simulator.ts`.

### Functions

* `simulateOwnership(priceSeries, rateSeries, rentSeries, cfg)`
  → returns time-series of net wealth (equity + price appreciation – costs).
* `simulateInvestment(rentSeries, portfolioReturns, cfg)`
  → returns wealth accumulation from investing down payment + ongoing savings.
* `compareScenarios(ownership, investment)`
  → produces:

  * NPV difference
  * IRR of owning vs renting + investing
  * Breakeven year
  * Sensitivity table
* Optional stochastic mode: Monte Carlo N = 1000 with random draws from normal (μ, σ) using `Math.random()` (Edge-safe).

All deterministic by default for reproducibility.

---

## 🧮 Phase 3 – Parameter Controls / State Store

**Goal:** Let user interactively adjust assumptions.

* Extend store with:

  * `downPaymentPct`, `investmentReturn`, `rentGrowth`, `maintenancePct`, `inflation`.
* Sliders or input boxes for each.
* Hook to recompute simulation on change (debounced).

---

## 📈 Phase 4 – Visualization Components

**Goal:** Mirror the analytical visuals from the outline.

Create under `/components/charts/`:

1. **WealthTrajectoryChart**

   * Line/area chart comparing cumulative net wealth (own vs invest) over 30 years.

2. **NPVComparisonChart**

   * Bar chart for 10y / 15y / 30y NPV difference.

3. **SensitivityTornadoChart**

   * Horizontal bars showing which assumptions move the outcome most (sensitivity analysis).

4. **OutcomeDistributionChart** *(optional)*

   * Histogram of Monte Carlo results: probability owning “wins”.

All client-side, reading from simulation output.

---

## 🗣️ Phase 5 – Insight Narrative

**Goal:** Convert numeric outcomes into natural-language insights.

* `/lib/insightInvestment.ts`

  * `generateInvestmentSummary(result)` → strings like
    “Over 30 years, investing instead of buying yields +12 % more wealth in median case.”
* Display beside charts or as a dynamic “Conclusion” panel.

---

## 🌐 Phase 6 – Integration & Navigation

**Goal:** Merge both parts into a cohesive dashboard.

* Tabs: **Affordability | Investment Comparison**.
* Reuse country selector + parameter panel globally.
* Cache computed results client-side (`useMemo` + localStorage).
* Maintain shareable URLs (`/compare?country=CAN&horizon=30`).

---

## 🚀 Phase 7 – Deployment & Performance

**Goal:** Confirm full edge compatibility and optimization.

* Verify no Node-only APIs used (no fs, no Buffer).
* Leverage **Edge Cache API** to memoize computed series for common parameters.
* Keep all computations client-side or in Cloudflare Function if heavier Monte Carlo needed.
* Deploy via:

  ```bash
  npm run build
  npx wrangler pages deploy .next
  ```
* Validate bundle size and cold-start performance.

---

## 🔮 Phase 8 – Enhancements (optional)

* Add CSV/PNG export of simulation results.
* Add “compare multiple countries” in one chart.
* Integrate live MSCI API or Yahoo Finance returns if allowed.
* Store user presets in KV or Durable Object if persistent customization desired.

---

**Outcome:**
After Phase 6 you’ll have a full **edge-deployed NextJS simulator** where users pick a country and assumptions, and instantly see whether buying or investing wins—backed by the same data model and methodology defined in your analytical blueprint.
