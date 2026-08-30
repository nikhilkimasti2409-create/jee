## 2024-11-20 - Accessible Toggles
**Learning:** Custom interactive `<div>` elements used as toggles lack native keyboard focus and proper screen reader support out of the box.
**Action:** Replace them with `<button type="button" role="switch" aria-checked={value}>` combined with `focus-visible` classes to ensure native keyboard focus and correct state announcement for assistive technologies.
