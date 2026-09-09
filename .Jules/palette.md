## 2024-05-24 - Semantic Toggle Buttons for Accessibility
**Learning:** Custom interactive toggles were implemented using `<div>` with `onClick` handlers, which prevents native keyboard focus and proper screen reader interaction (e.g. knowing it's a switch and its current state).
**Action:** Converted these custom toggles into `<button type="button" role="switch" aria-checked={value}>`. This pattern ensures native keyboard focus and accessibility while maintaining the design system's aesthetic constraints.
