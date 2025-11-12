"use client";

interface Scenario {
  readonly name: string;
  readonly ltv: number;
  readonly term: number;
  readonly savingsRate: number;
}

interface ControlPanelProps {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  countries: string[];
  countryDisplayNames: { [key: string]: string };
  scenarios: readonly Scenario[];
  scenarioIndex: number;
  setScenarioIndex: (index: number) => void;
}

export default function ControlPanel({
  selectedCountry,
  setSelectedCountry,
  countries,
  countryDisplayNames,
  scenarios,
  scenarioIndex,
  setScenarioIndex,
}: ControlPanelProps) {
  return (
    <section className="flex flex-col lg:flex-row justify-between items-center gap-8 rounded-xl border border-[--color-border] bg-[--color-card] p-8">
      {/* Country Selector */}
      <div className="flex flex-col items-center lg:items-start w-full lg:w-1/2">
        <label
          htmlFor="country"
          className="text-2xl text-[--color-label] font-semibold mb-3"
        >
          Country
        </label>
        <select
          id="country"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="w-48 rounded-md bg-[--color-card] border border-[--color-border] text-[--color-title] text-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[--color-accent]"
        >
          {countries.map((countryCode) => (
            <option
              key={countryCode}
              value={countryCode}
              className="bg-[--color-card] text-[--color-title]"
            >
              {countryDisplayNames[countryCode] ?? countryCode}
            </option>
          ))}
        </select>
      </div>

      {/* Scenario Selector */}
      <div className="flex flex-col items-center w-full lg:w-1/2">
        <h3 className="text-2xl text-[--color-label] font-semibold mb-3">
          Buyer Scenario
        </h3>
        <div className="flex justify-center gap-4 flex-wrap">
          {scenarios.map((s, idx) => (
            <button
              key={s.name}
              onClick={() => setScenarioIndex(idx)}
              className={`px-5 py-2 rounded-md border text-lg font-semibold tracking-wide transition-all duration-200
                ${
                  scenarioIndex === idx
                    ? "bg-[--color-accent] text-[--color-bg] border-[--color-accent] shadow-[0_0_15px_var(--color-accent)]"
                    : "bg-transparent text-[--color-label] border-[--color-border] hover:bg-[--color-border]"
                }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}