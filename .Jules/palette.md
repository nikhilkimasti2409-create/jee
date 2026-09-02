## 2026-09-02 - Accessible Toggles
**Learning:** Found custom interactive elements implemented as `div` tags with `onClick` handlers, breaking keyboard navigation and screen readers.
**Action:** Replaced with native `button` elements using `role="switch"` and explicit `aria-checked` attributes, adding explicit focus styling for keyboard users.
