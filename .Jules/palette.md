## 2025-02-14 - Icon-only Button Accessibility and Focus States
**Learning:** Icon-only buttons often lack proper accessibility (no ARIA label) and lack distinct keyboard focus indicators, making them hard to use for screen reader and keyboard-only users.
**Action:** Always add `aria-label`, `title` for mouse tooltips, `aria-hidden="true"` to the inner SVG/icon, and visible focus rings (e.g., `focus-visible:ring-2`) with sufficient padding (`p-1`) for interaction.
