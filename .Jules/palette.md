## 2025-02-13 - [Mobile Accessibility Hidden Utilities]
**Learning:** Tailwind's `hidden` utility (`display: none`) hides elements from screen readers. When hiding text labels in responsive layouts (e.g., `hidden lg:block`), the parent element loses its accessible name for screen readers.
**Action:** Always ensure the parent interactive element (like a `<Link>` or `<button>`) has an `aria-label` or `title`, and inner decorative icons have `aria-hidden="true"`, when text is hidden conditionally based on breakpoints.
