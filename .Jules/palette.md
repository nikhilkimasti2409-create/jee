## 2024-08-14 - Responsive Hidden Text Accessibility
**Learning:** Hiding navigation labels visually on small screens using `hidden lg:block` also removes them from the accessibility tree, making icon-only navigation unusable for screen reader users and confusing for mouse users (no tooltip).
**Action:** Always provide `aria-label` and `title` attributes on navigation links when their primary text label can be visually hidden by responsive classes.
