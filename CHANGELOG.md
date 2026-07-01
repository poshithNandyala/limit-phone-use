# Changelog

## v1.2.0

### Added
- Expanded the quote library to 200+ quotes across 11 categories (added "Other"), all-original,
  research-informed writing rather than filler repetition
- **Background-capable reminders**: reminders are now scheduled directly with the OS notification
  system ahead of time (a rolling batch, capped under the platform's pending-notification limit),
  so they keep arriving even when the app is closed or killed - not just while it's open
- **Gemini AI reminders (bring your own key)**: paste a free Gemini API key in Settings for
  AI-generated reminders, called directly from the device straight to Google - no backend needed.
  Falls back to the local quote library automatically if it's not configured or a request fails
- **Add your own quotes**: write a custom reminder and file it under any category (including the
  new "Other") from the Quote Library tab; it's merged into search, favorites, and reminders
- **Streaks tab**: track any habit you want - free-text name, your own icon, a current/longest
  streak counter, a 28-day calendar view, and milestone celebrations at day 1, 3, 7, 14, 30, 60,
  100, and beyond
- New GitHub issue forms for bug reports and feature requests, plus in-app links to them

### Fixed
- Quote Library category filters are no longer hidden behind a horizontal scroll with no visible
  affordance - all categories now wrap and stay visible at once
- Relabeled the "Screen Time" stat to "Time in App" since it measures time this app is open, not
  actual device-wide screen time (a real fix for that is tracked separately - see open issues)

## v1.1.1

### Fixed
- The release workflow was building the Android *debug* variant, which doesn't bundle JavaScript
  into the APK and instead expects a live Metro dev server - so the installed app never got past
  the splash screen. Switched to the *release* variant, which bundles the JS properly
- Replaced the icon/splash/favicon assets, which were unmodified placeholders from the "Emergent"
  scaffolding tool, with a custom icon

## v1.1.0

### Added
- 100+ curated quotes across 10 categories (Health, Relationships, Productivity, Mindfulness,
  Sleep, Nature, Family, Focus, Creativity, Growth), bundled locally so the app works fully offline
- New tabbed navigation: Home, Quote Library, Stats, Settings
- Quote Library tab: search, filter by category, favorite, and share any quote
- Favorites system with a "favorites only" filter
- Configurable reminder interval (5–60 minutes)
- Category preferences for reminders
- Daily usage streak tracking
- 7-day activity chart and all-time totals on the Stats tab
- Dark mode
- Share button for the current/last reminder quote
- `.github/workflows/release.yml`: automated Android APK build + GitHub Release publishing on tag push

### Changed
- The AI reminder option now only appears when a backend URL is configured, and gracefully
  times out and falls back to the local quote library if the backend is unreachable
- Backend `/api/reason` now supports an optional `category` filter; added `/api/reasons/categories`
- Bumped Android/iOS package identifiers off the default `com.anonymous.frontend` placeholder

## v1.0.0

- Initial release: reminders every 10 minutes, 30 pre-defined reasons, AI-generated reasons via
  backend, basic screen time stats.
