## 2026-09-04 - Accessible Custom Interactive Toggles
**Learning:** Custom toggles implemented as `<div>` elements with `onClick` handlers lack native keyboard focus and are not natively recognized as interactable elements by screen readers.
**Action:** Always implement custom toggles as `<button type="button" role="switch" aria-checked={value}>` instead of `<div>`. Ensure that appropriate focus styles (like `focus-visible:ring`) are added so users navigating via keyboard can see what is currently focused.
