## 2024-05-20 - Hidden Text in Responsive Layouts
**Learning:** Using Tailwind`s `hidden lg:block` to collapse sidebar labels on smaller screens completely removes the text from the accessibility tree, making the navigation links unreadable to screen readers on mobile devices.
**Action:** Always add `aria-label` and `title` attributes to navigation links when the visual text might be hidden via CSS display properties.
