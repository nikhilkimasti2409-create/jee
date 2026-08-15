## 2024-05-24 - Custom Toggle Switch Accessibility
**Learning:** When using `div` elements as custom interactive controls like toggle switches, they lack default keyboard interactivity and screen reader semantics, posing significant accessibility barriers.
**Action:** Always ensure custom interactive elements include appropriate ARIA roles (e.g., `role="switch"`), states (`aria-checked`), `tabIndex={0}` for keyboard focus, keyboard event handlers (`onKeyDown`), and distinct visual focus indicators (`focus-visible`).
