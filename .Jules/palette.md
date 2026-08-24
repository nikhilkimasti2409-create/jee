## 2024-05-24 - Tailwind hidden utility and screen readers
**Learning:** Using Tailwind's `hidden` class (e.g., `hidden lg:block`) removes text from screen readers completely. Hiding link text visually on mobile using `hidden` causes screen reader users to encounter completely empty icon links.
**Action:** When hiding text visually on smaller screens, either use a visually hidden utility (`sr-only`) or add an explicit `aria-label` to the parent element to provide the accessible name to screen readers.
