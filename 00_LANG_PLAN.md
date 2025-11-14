### **Project Goal**

To internationalize the application, allowing users to select their preferred language from a dropdown menu. All user-facing text, including titles, explanations, chart labels, and dynamic content, should be translated into the selected language.

---

### **Phase 1: Foundation & Architecture (The "Plumbing")**

This phase is about setting up the necessary tools and structure without yet translating content.

1.  **Choose and Install an i18n Library:**
    *   **Action:** Install `next-intl`, a library purpose-built for the Next.js App Router.
    *   **Reasoning:** It provides a complete solution, including routing, server-side rendering of translations, and hooks for accessing messages, which is a perfect fit for our stack.

2.  **Establish Translation File Structure:**
    *   **Action:** Create a new root directory named `messages`.
    *   **Action:** Inside `messages`, create an `en.json` file. This will be our "source of truth" containing all English strings.
    *   **Reasoning:** Centralizing all text in one place makes it manageable, easy to find, and simple to hand off to translators.

3.  **Configure Internationalized Routing:**
    *   **Action:** Create a `middleware.ts` file at the root of the project.
    *   **Action:** Configure the middleware to handle locale detection from the URL (e.g., `/en`, `/de`, `/ja`). It will default to English (`/en`) if a locale is not specified.
    *   **Action:** Restructure the `app` directory to `app/[locale]/`, moving `page.tsx` and `layout.tsx` inside. This is how `next-intl` associates routes with a language.
    *   **Reasoning:** This approach is SEO-friendly, allows users to share links in their preferred language, and is the standard pattern for internationalized Next.js applications.

---

### **Phase 2: Content Externalization (Finding All the Text)**

This is the most labor-intensive phase: moving all hardcoded text into our new `en.json` file.

1.  **Define a JSON Structure:**
    *   **Action:** Plan a logical, nested structure for `en.json` that mirrors the component structure of the app.
    *   **Example Snippet (`en.json`):**
        ```json
        {
          "Hero": {
            "title": "Housing Affordability",
            "subtitle": "How has the ability to buy a home changed over time? Explore..."
          },
          "ChartCard": {
            "incomeTitle": "Real Household Income",
            "incomeExplanation": "This chart shows the inflation-adjusted...",
            "ptiTitle": "Price-to-Income Ratio",
            // ... etc.
          },
          "Simulation": {
            "assetPerformanceTitle": "Asset Performance: Homeowner vs. Renter",
            "downPaymentLabel": "Your Down Payment: {value}",
            // ... etc.
          }
        }
        ```

2.  **Systematic String Extraction:**
    *   **Action:** Go through every `.tsx` file in `app`, `components`, and `lib`.
    *   **Action:** For every piece of user-facing text, cut it from the component and paste it into the appropriate location in `en.json`.
    *   **Action:** Pay special attention to dynamic text. Replace variables with placeholders that `next-intl` understands (e.g., "Snapshot for {countryName}").
    *   **Key Files to Scour:** `Hero.tsx`, `Snapshot.tsx`, `ChartCard.tsx`, `*SimulationCard.tsx`, `ComparisonTable.tsx`, `*Modal.tsx`, etc.

---

### **Phase 3: Component Refactoring (Connecting the UI to the Text)**

This phase involves modifying the components to display the translated text instead of hardcoded strings.

1.  **Implement Translation Hooks:**
    *   **Action:** In each component, import and use the `useTranslations` hook from `next-intl`.
    *   **Action:** Replace the original hardcoded strings with function calls, like `t('Hero.title')`.
    *   **Action:** For dynamic content, pass the variables into the function: `t('Simulation.downPaymentLabel', { value: formattedDownPayment })`.

2.  **Update the Language Selector:**
    *   **Action:** Modify `FloatingLanguageSelector.tsx`.
    *   **Action:** Its state will now be driven by the locale in the URL.
    *   **Action:** The `onSelect` handler will no longer just set local state; it will use a locale-aware router from `next-intl` to navigate the user to the new path (e.g., from `/en` to `/fr`).

3.  **Handle Formatted Numbers and Currencies:**
    *   **Action:** Use `next-intl`'s built-in formatters for numbers and currencies.
    *   **Reasoning:** This ensures that numbers (e.g., `1,234.56` vs. `1.234,56`) and currency symbols are displayed correctly according to the user's selected locale, which is more robust than our current manual formatting.

---

### **Phase 4: Translation and Deployment**

1.  **Translate the Content:**
    *   **Action:** Duplicate `en.json` to create files for other languages (e.g., `es.json`, `de.json`).
    *   **Action:** Translate the values within these new files. (This is where a professional translation service or community effort would come in).

2.  **Testing:**
    *   **Action:** Thoroughly test the application in each supported language.
    *   **Action:** Check for text overflow or layout breaks caused by varying string lengths.
    *   **Action:** Verify that all dynamic values and number formats are correct.

By following this plan, we can systematically and cleanly integrate a full-featured internationalization system into the application.