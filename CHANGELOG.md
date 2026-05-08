# Changelog

All notable changes to `storybook-addon-flow-direction` are documented in this file.

This project follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Preserve semantic hyphenated class tokens (for example `static-card`) in scanner element hints so **Focus offender** targets the correct DOM node instead of trimming class names aggressively.
- Escape selector hint identifiers and attribute values before querying so special characters do not produce invalid selectors.

### Added

- Add scanner regression tests for class-token normalization (`physical-toast` remains intact; CSS-module underscore hashes are still normalized).
- Add `Working/Static Card` and `Broken/Static Card` stories to demonstrate class-based focus targeting with non-hashed semantic selectors.

## [0.2.0] - 2026-05-08

### Changed

- Add `flowDirection.scanScope` project configuration in `.storybook/preview.ts` to include root-level `stories/`, built `/assets/` stylesheet sources, and PhysicalToast identifiers.
- Expand README configuration docs with a concrete `scanScope` example for root-level `stories/` setups and guidance to keep include matchers narrowly scoped.
- Normalize `repository.url` in `package.json` to the canonical npm format.
- Restrict GitHub release workflow publishing to `main` and skip release publishing when `NPM_TOKEN` is missing.

## [0.1.1] - 2026-05-08

### Changed

- Rewrite `README.md` to remove maintainer-only sections and fix the broken `FLOW_DIRECTIONS` / `FLOW_WRITING_MODES` import example.
