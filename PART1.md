Here’s an incremental, Cloudflare-ready plan for **Part 1 — “Buying a house now vs 40 years ago”**, scoped for a **Next.js + Edge** deployment.

---

## 🧩 Phase 0 – Project & Infrastructure Setup

**Goal:** Stand up a minimal NextJS Edge-ready app scaffold.

* Use the **App Router** (NextJS) with **TypeScript**.
* Set `"runtime": "edge"` on all route handlers.
* Choose **Cloudflare Pages + Functions** for deployment (auto-maps API routes).
* Add **Tailwind or ShadCN/UI** for basic visualization scaffolding.
* Include **d3**, **chart.js**, or **echarts-for-react** (edge-compatible bundle).
* Configure environment via `.env.local` → build-time injection only (no server fs).

---

## 🧮 Phase 1 – Static Data Layer

**Goal:** Represent OECD/BIS-like data directly in the bundle.

* Create `/data/affordability.ts` exporting a **typed JS object**:

  ```ts
  export const affordabilityData = {
    CAN: {
      pti: [{year:1985,value:60}, …],
      ptr: […],
      mortgageRate: […],
      income: […],
      rent: […],
    },
    USA: {…},
    …
  } as const;
  ```

* Keep series arrays small (annual or 5-year).

* Optional: Add a **transform util** (e.g., real-price normalization, index rebasing).

---

## 📊 Phase 2 – Computation Layer

**Goal:** Compute the derived indicators (PTI, PTR, MPS, YDP).

* Implement pure functions in `/lib/metrics.ts`:

  * `calcPriceToIncome(series)`
  * `calcMortgagePayment(rate,price,ltv,term)`
  * `calcMPS(income, payment)`
  * `calcYDP(price, savingsRate, ltv)`
* All pure; no I/O. Runs client- or edge-side.

---

## 🎛️ Phase 3 – Country Selector & State Management

**Goal:** Let users pick a country and see the computed metrics.

* Use a lightweight store (`useState` or Zustand) for:

  * selectedCountry
  * parameters: LTV, term, savingsRate, etc.
* Country list derived from `Object.keys(affordabilityData)`.
* Recompute indicators on parameter change.

---

## 📈 Phase 4 – Visualization Components

**Goal:** Replicate the visuals from the analytical plan.

Create under `/components/charts/`:

1. **AffordabilityTrendsChart**

   * Displays PTI & PTR lines 1985–2025.
   * Highlight recent (2020s) region.

2. **MortgageBurdenChart**

   * Shows MPS over time for chosen LTV & rate.

3. **EntryBarrierChart**

   * Bars for “Years to Save 20%” at various savings rates.

4. **RentPriceDivergenceChart**

   * Dual-axis price vs rent indices.

All read from computed data props; no fs, no API.

---

## 🗺️ Phase 5 – Narrative / Insight Layer

**Goal:** Generate plain-language insights that echo your bias.

* `/lib/insight.ts` → `generateAffordabilitySummary(metrics)` returning text like
  “Affordability has worsened by 65 % since 1985; entry time doubled from 5 to 10 years.”
* Display alongside charts in a **responsive dashboard** layout.

---

## ⚙️ Phase 6 – Edge Deployment & Validation

**Goal:** Deploy static + edge functions to Cloudflare Pages.

* Verify bundle size < 10 MB (OK with hardcoded data).
* Add build commands:

  ```bash
  npm run build
  npx wrangler pages deploy .next
  ```
* Ensure all data imported statically (no dynamic fs reads).
* Optional: add `country` query param to URL for shareable links.

---

## 🔮 Phase 7 – Extensions

Once core charts work:

* Add a **Compare Countries** view (small multiples).
* Add a **timeline slider** (D3 brush).
* Integrate live OECD API as fallback (Edge fetch with Cache API).
* Persist user parameter presets in `localStorage`.

---

**Outcome:**
By the end of Phase 6 you’ll have a fully edge-compatible NextJS app visualizing affordability trends and entry barriers—ready for “Part 2: House vs Investment” simulation.
