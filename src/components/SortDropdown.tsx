"use client";

interface SortOption {
  value: string;
  label: string;
}

interface SortDropdownProps {
  value: string;
  label: string;
  options: SortOption[];
  /** Current search params to preserve when sort changes */
  currentParams: {
    category?: string;
    q?: string;
  };
}

/**
 * Build a URL preserving existing search params, updating only the sort key.
 * "newest" removes the sort param entirely (default behavior).
 */
function buildUrl(currentParams: SortDropdownProps["currentParams"], sort: string): string {
  const params = new URLSearchParams();
  if (currentParams.category) params.set("category", currentParams.category);
  if (currentParams.q) params.set("q", currentParams.q);
  if (sort && sort !== "newest") params.set("sort", sort);
  const qs = params.toString();
  return `/products${qs ? `?${qs}` : ""}`;
}

export default function SortDropdown({ value, label, options, currentParams }: SortDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="sort-select"
        className="hidden shrink-0 text-xs font-medium text-[#1A1A2E]/60 dark:text-carreta-eggshell/60 sm:block"
      >
        {label}:
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => {
          window.location.href = buildUrl(currentParams, e.target.value);
        }}
        className="rounded-full border-2 border-carreta-blue/20 bg-white px-4 py-2 text-xs font-medium text-[#1A1A2E] outline-none transition-all focus:border-carreta-blue dark:bg-[#22223A] dark:text-carreta-eggshell"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
