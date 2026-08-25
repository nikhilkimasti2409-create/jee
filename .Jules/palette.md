## 2024-05-18 - Improve Notifications Settings Clarity
**Learning:** Toggle switches for "Real-time Security Alerts" and "Daily Summary Reports" in Settings lack aria-labels, and it is slightly unintuitive to see what's checked/unchecked visually for screen readers or without mouse interaction. Also, many icon-only buttons like the ones in the Sidebar lack tooltips or ARIA labels.
**Action:** Adding standard `aria-label`s and `role="switch"` and `aria-checked` properties to custom toggle components makes them significantly more usable for screen readers and keyboard navigation.
