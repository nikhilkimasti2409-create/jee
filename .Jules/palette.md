## 2024-05-19 - Interactive Toggles Should Be Buttons
**Learning:** Custom interactive toggles implemented as `<div>` with `onClick` handlers lack native keyboard focus and proper screen reader support. This is a common accessibility issue.
**Action:** Always implement custom toggles as `<button type="button" role="switch" aria-checked={value}>` instead of `<div>`. This ensures they are reachable via keyboard and properly announced by screen readers.
