## 2024-05-24 - Responsive Navigation Accessibility
**Learning:** Using Tailwind's `hidden` (display: none) to visually hide text labels in responsive navigation completely removes them from the accessibility tree, making icon-only links unreadable for mobile screen readers.
**Action:** Always provide an `aria-label` on responsive icon links where text is visually hidden on smaller breakpoints, and apply `aria-hidden="true"` to the decorative icon to prevent double-reading when the text is visible.
