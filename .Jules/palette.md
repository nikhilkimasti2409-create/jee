## 2026-09-05 - Interactive Toggles Should Be Native Buttons
**Learning:** Found custom interactive toggles (for settings like email alerts) implemented as `<div>` elements with `onClick` handlers. This completely breaks keyboard navigation (they aren't in the tab order) and provides no context to screen readers about their state or purpose.
**Action:** Converted these custom toggles to `<button type="button" role="switch" aria-checked={value}>`. This ensures native keyboard focus, allows activation with Enter/Space keys, and clearly communicates the current toggle state to screen readers.
