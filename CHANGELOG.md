# Changelog

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
