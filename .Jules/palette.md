## 2026-08-27 - Responsive Navigation Accessibility
**Learning:** In responsive layouts where text labels are hidden on smaller screens (e.g., using Tailwind's `hidden lg:block`), interactive elements like navigation links lose their accessible names for screen readers if they only contain an icon visually.
**Action:** Always provide an explicit `aria-label` (and consider a `title` for tooltips) on interactive elements that rely on icons when text might be visually hidden at certain breakpoints.
