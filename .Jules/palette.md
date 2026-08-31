## 2024-11-20 - Interactive Divs instead of semantic Buttons
**Learning:** Found custom interactive toggles implemented as `<div>` elements with `onClick` handlers. This prevents native keyboard focus and completely breaks screen reader functionality since they aren't announced as interactive controls.
**Action:** Always replace interactive `<div>` toggles with `<button type="button" role="switch" aria-checked={value}>`. Added `focus-visible:ring-2 focus:outline-none w-full text-left` to maintain visual design while ensuring proper keyboard focus states.
