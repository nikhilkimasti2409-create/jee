## 2023-10-27 - Icon-Only Buttons Accessibility Pattern
**Learning:** Found an icon-only button without an ARIA label and missing keyboard focus states. Icon buttons must have screen-reader accessible names and clear focus rings, especially for interactive data displays (like activity feeds).
**Action:** Always add `aria-label`, `title` (for tooltips), and explicit `focus-visible:` classes (e.g., `focus-visible:ring-2 focus-visible:outline-none`) to any `<button>` that only contains an `<Icon />`.

## 2023-10-27 - Search Input Pointer Interaction Pattern
**Learning:** Absolute positioned icons overlaid on search inputs can create "dead zones" where clicking the icon doesn't focus the input.
**Action:** Apply `pointer-events-none` to purely decorative or illustrative icons overlaid on form inputs, ensuring clicks pass through to the input beneath.
