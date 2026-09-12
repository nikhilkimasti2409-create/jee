## 2024-09-12 - Custom Toggle Switches Accessibility
**Learning:** Custom interactive toggles built with `<div>` elements and `onClick` handlers lack native keyboard focus and proper screen reader support.
**Action:** Always implement custom toggles as `<button type="button" role="switch" aria-checked={value}>` instead of `<div>`. Ensure they have appropriate focus styles (`focus-visible:ring-2`) and use `aria-hidden="true"` on inner decorative icons/elements to prevent redundant screen reader callouts.
