## 2024-08-12 - Responsive Sidebar Links Accessibility
**Learning:** When using utility classes like Tailwind's `hidden lg:block` to hide text on mobile screens while leaving icons visible, screen readers lose the link text context on small screens. The links effectively become icon-only buttons without accessible labels.
**Action:** Always add `aria-label` to links/buttons where visual text is conditionally hidden by responsive breakpoints, and add `title` for visual tooltips. Ensure icons have `aria-hidden="true"` to prevent redundant reading when text is visible.
