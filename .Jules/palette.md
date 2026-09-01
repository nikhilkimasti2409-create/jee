## 2024-05-29 - [Accessible Notification Toggles]
**Learning:** Found custom interactive toggles built using `div` with `onClick` handlers. These lack native screen reader semantics and cannot be easily focused using keyboard navigation.
**Action:** Always replace `div`-based custom interactive toggles with `<button type="button" role="switch" aria-checked={value}>`. Ensure classes like `focus-visible:outline-none focus-visible:ring-2` are added for explicit focus management.
