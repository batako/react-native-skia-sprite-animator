<!--
- Release note template instructions:
-   - Replace the placeholder bullets with actual issues/commits for the tag you are publishing.
-   - Prefer linking to issues (e.g. [#123](https://github.com/...)) when they exist; otherwise link to commits.
-   - Keep the section headers intact so automation can fill them consistently.
-   - Remove any empty section before publishing if there are no entries.
-->

<!-- Section: Highlights -->

## 🌟 Highlights

- v0.4.0 introduces the production-ready `AnimatedSprite2D` runtime, hooks, and ticker-driven preview so sprites now run independently of React renders across both apps and the editor (see [`15bfa76`](https://github.com/batako/react-native-skia-sprite-animator/commit/15bfa76) … [`750d897`](https://github.com/batako/react-native-skia-sprite-animator/commit/750d897)).
- AnimationStudio’s timeline/storage stack has been rebuilt for this release with metadata-aware tooling, JSON-only persistence, per-frame images, autoplay metadata, and playback direction controls (e.g. [`237cbf3`](https://github.com/batako/react-native-skia-sprite-animator/commit/237cbf3), [`421f535`](https://github.com/batako/react-native-skia-sprite-animator/commit/421f535), [`8980fd6`](https://github.com/batako/react-native-skia-sprite-animator/commit/8980fd6), [`e01831c`](https://github.com/batako/react-native-skia-sprite-animator/commit/e01831c)).
- The Expo standalone editor that ships with v0.4.0 is now App Store–ready with legal/info center UX, tablet-friendly assets, localized copy, and hardened dependency tooling (see [`7275983`](https://github.com/batako/react-native-skia-sprite-animator/commit/7275983), [`5145b09`](https://github.com/batako/react-native-skia-sprite-animator/commit/5145b09), [`6a02c8e`](https://github.com/batako/react-native-skia-sprite-animator/commit/6a02c8e), [`a32992b`](https://github.com/batako/react-native-skia-sprite-animator/commit/a32992b)).

<!-- Section: Features -->

## ✨ Features

- [`fa0d371`](https://github.com/batako/react-native-skia-sprite-animator/commit/fa0d371), [`915f484`](https://github.com/batako/react-native-skia-sprite-animator/commit/915f484), [`29e2e73`](https://github.com/batako/react-native-skia-sprite-animator/commit/29e2e73), [`750d897`](https://github.com/batako/react-native-skia-sprite-animator/commit/750d897) Introduced the `AnimatedSprite2D` component suite (hooks, container, preview player, ticker integration) so apps can render sprite timelines without hand-written timers.
- [`8980fd6`](https://github.com/batako/react-native-skia-sprite-animator/commit/8980fd6) Added support for per-frame sprite images, enabling multi-texture animations and richer storage metadata.
- [`e01831c`](https://github.com/batako/react-native-skia-sprite-animator/commit/e01831c), [`6da2d38`](https://github.com/batako/react-native-skia-sprite-animator/commit/6da2d38), [`e72812b`](https://github.com/batako/react-native-skia-sprite-animator/commit/e72812b) Added playback direction toggles (forward/reverse) across the editor integration and SpriteAnimator runtime.
- [`7275983`](https://github.com/batako/react-native-skia-sprite-animator/commit/7275983), [`5145b09`](https://github.com/batako/react-native-skia-sprite-animator/commit/5145b09), [`fd910ee`](https://github.com/batako/react-native-skia-sprite-animator/commit/fd910ee), [`6a02c8e`](https://github.com/batako/react-native-skia-sprite-animator/commit/6a02c8e) Expanded the Expo standalone editor UX with info center modals, legal copy, sliding transitions, and tablet-ready splash assets.
- [`bceba0e`](https://github.com/batako/react-native-skia-sprite-animator/commit/bceba0e), [`a32992b`](https://github.com/batako/react-native-skia-sprite-animator/commit/a32992b) Prepared Expo dependencies/lockfiles/eas.json for App Store submission and refreshed assets.
- [`0a3ea89`](https://github.com/batako/react-native-skia-sprite-animator/commit/0a3ea89), [`6c54b70`](https://github.com/batako/react-native-skia-sprite-animator/commit/6c54b70), [`e6fc8a2`](https://github.com/batako/react-native-skia-sprite-animator/commit/e6fc8a2), [`aeb6554`](https://github.com/batako/react-native-skia-sprite-animator/commit/aeb6554) Localized the editor UI, preview titles, and sprite JSON export notifications (EN/JA) via `expo-localization`.

<!-- Section: Bug Fixes -->

## 🐞 Bug Fixes

- [`6ff22e0`](https://github.com/batako/react-native-skia-sprite-animator/commit/6ff22e0) Fixed ticker/timeline synchronization so scrubbing stays aligned with playback.
- [`2a426da`](https://github.com/batako/react-native-skia-sprite-animator/commit/2a426da), [`39420ab`](https://github.com/batako/react-native-skia-sprite-animator/commit/39420ab) Preserved timeline selections and multiplier edits when swapping animations or frames.
- [`8f164ff`](https://github.com/batako/react-native-skia-sprite-animator/commit/8f164ff), [`680a939`](https://github.com/batako/react-native-skia-sprite-animator/commit/680a939) Ensured preview visibility remains stable when animations have no frames or when frames are reordered mid-playback.
- [`cfd1ca3`](https://github.com/batako/react-native-skia-sprite-animator/commit/cfd1ca3) Stabilized the preview layout for empty animations.

<!-- Section: Refactors -->

## 🔧 Refactors

- [`237cbf3`](https://github.com/batako/react-native-skia-sprite-animator/commit/237cbf3), [`421f535`](https://github.com/batako/react-native-skia-sprite-animator/commit/421f535), [`65556d2`](https://github.com/batako/react-native-skia-sprite-animator/commit/65556d2) Reworked metadata/storage hooks to focus on JSON persistence, unified toolbar actions, and removed template switching.
- [`f278a54`](https://github.com/batako/react-native-skia-sprite-animator/commit/f278a54), [`2fa6090`](https://github.com/batako/react-native-skia-sprite-animator/commit/2fa6090), [`a12420d`](https://github.com/batako/react-native-skia-sprite-animator/commit/a12420d) Extracted timeline panels and hooks, tightening the editing flow.
- [`331ed39`](https://github.com/batako/react-native-skia-sprite-animator/commit/331ed39), [`b7f7655`](https://github.com/batako/react-native-skia-sprite-animator/commit/b7f7655) Removed the legacy PreviewPlayer implementation and aligned the example app imports with lint rules.

<!-- Section: Full Changelog -->

## 📜 Full Changelog

- https://github.com/batako/react-native-skia-sprite-animator/compare/v0.3.0...v0.4.0
