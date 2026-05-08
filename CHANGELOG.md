# v0.2.4 (Fri May 08 2026)

#### 🐛 Bug Fix

- docs: rewrite README and release 0.1.1 [#1](https://github.com/brechtDR/storybook-addon-flow-direction/pull/1) ([@brechtDR](https://github.com/brechtDR))

#### ⚠️ Pushed to `main`

- ci: remove release PAT fallback path ([@brechtDR](https://github.com/brechtDR))
- ci: allow release workflow to use PAT fallback ([@brechtDR](https://github.com/brechtDR))
- fix: grant release workflow push permissions ([@brechtDR](https://github.com/brechtDR))
- fix: make release workflow token check valid ([@brechtDR](https://github.com/brechtDR))
- feat: improve flow-direction scan scope for story CSS ([@brechtDR](https://github.com/brechtDR))
- feat: initial release of storybook-addon-flow-direction ([@brechtDR](https://github.com/brechtDR))

#### Authors: 1

- Brecht De Ruyte ([@brechtDR](https://github.com/brechtDR))

---

# Changelog

All notable changes to `storybook-addon-flow-direction` are documented in this file.

This project follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-05-08

### Changed

- Add `flowDirection.scanScope` project configuration in `.storybook/preview.ts` to include root-level `stories/`, built `/assets/` stylesheet sources, and PhysicalToast identifiers.
- Expand README configuration docs with a concrete `scanScope` example for root-level `stories/` setups and guidance to keep include matchers narrowly scoped.
- Normalize `repository.url` in `package.json` to the canonical npm format.
- Restrict GitHub release workflow publishing to `main` and skip release publishing when `NPM_TOKEN` is missing.

## [0.1.1] - 2026-05-08

### Changed

- Rewrite `README.md` to remove maintainer-only sections and fix the broken `FLOW_DIRECTIONS` / `FLOW_WRITING_MODES` import example.
