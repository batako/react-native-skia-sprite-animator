<!--
- Release note template instructions:
-   - Replace the placeholder bullets with actual issues/commits for the tag you are publishing.
-   - Prefer linking to issues (e.g. [#123](https://github.com/...)) when they exist; otherwise link to commits.
-   - Keep the section headers intact so automation can fill them consistently.
-   - Remove any empty section before publishing if there are no entries.
-->

<!-- Section: Highlights -->

## 🌟 Highlights

- `AnimatedSprite2D` graduates to the primary runtime in v0.4.0 with its own hooks, ticker loop, and preview tooling so sprites advance independently of React renders ([`15bfa76`](https://github.com/batako/react-native-skia-sprite-animator/commit/15bfa76) … [`750d897`](https://github.com/batako/react-native-skia-sprite-animator/commit/750d897)).
- AnimationStudio’s storage/timeline experience is rebuilt around JSON persistence, per-frame imagery, autoplay metadata, and playback-direction controls to match the new runtime ([`237cbf3`](https://github.com/batako/react-native-skia-sprite-animator/commit/237cbf3), [`421f535`](https://github.com/batako/react-native-skia-sprite-animator/commit/421f535), [`8980fd6`](https://github.com/batako/react-native-skia-sprite-animator/commit/8980fd6), [`e01831c`](https://github.com/batako/react-native-skia-sprite-animator/commit/e01831c)).
- The bundled Expo editor is production-ready with localized info/legal modals, refreshed icons/splashes, and store-friendly dependency hardening ([`7275983`](https://github.com/batako/react-native-skia-sprite-animator/commit/7275983), [`5145b09`](https://github.com/batako/react-native-skia-sprite-animator/commit/5145b09), [`6a02c8e`](https://github.com/batako/react-native-skia-sprite-animator/commit/6a02c8e), [`a32992b`](https://github.com/batako/react-native-skia-sprite-animator/commit/a32992b)).

<!-- Section: Features -->

## ✨ Features

- [`fa0d371`](https://github.com/batako/react-native-skia-sprite-animator/commit/fa0d371) … [`750d897`](https://github.com/batako/react-native-skia-sprite-animator/commit/750d897) Ship the `AnimatedSprite2D` suite (component, hooks, ticker, preview) so apps can drive sprite timelines without bespoke timers.
- [`8980fd6`](https://github.com/batako/react-native-skia-sprite-animator/commit/8980fd6), [`237cbf3`](https://github.com/batako/react-native-skia-sprite-animator/commit/237cbf3) Enable per-frame images and metadata-aware JSON storage, unlocking richer sprite sheets and autoplay settings.
- [`e01831c`](https://github.com/batako/react-native-skia-sprite-animator/commit/e01831c), [`6da2d38`](https://github.com/batako/react-native-skia-sprite-animator/commit/6da2d38), [`b00e57c`](https://github.com/batako/react-native-skia-sprite-animator/commit/b00e57c) Add playback-direction toggles and guard editing actions while animations are running.
- [`7275983`](https://github.com/batako/react-native-skia-sprite-animator/commit/7275983), [`5145b09`](https://github.com/batako/react-native-skia-sprite-animator/commit/5145b09), [`6a02c8e`](https://github.com/batako/react-native-skia-sprite-animator/commit/6a02c8e), [`a32992b`](https://github.com/batako/react-native-skia-sprite-animator/commit/a32992b) Expand the Expo editor with localized info/legal content, sliding transitions, tablet assets, and hardened release configs.

<!-- Section: Bug Fixes -->

## 🐞 Bug Fixes

- [`384ec9a`](https://github.com/batako/react-native-skia-sprite-animator/commit/384ec9a), [`2a426da`](https://github.com/batako/react-native-skia-sprite-animator/commit/2a426da) Keep the selected frame/animation focused while reordering or switching, preventing jumps back to the first frame.
- [`4202fc8`](https://github.com/batako/react-native-skia-sprite-animator/commit/4202fc8), [`c86189c`](https://github.com/batako/react-native-skia-sprite-animator/commit/c86189c) Reset playback and selection state whenever sprite storage content is loaded or deleted so timelines start cleanly.
- [`611a0a0`](https://github.com/batako/react-native-skia-sprite-animator/commit/611a0a0), [`6860f6b`](https://github.com/batako/react-native-skia-sprite-animator/commit/6860f6b), [`f638ee8`](https://github.com/batako/react-native-skia-sprite-animator/commit/f638ee8) Blur numeric inputs and close rename forms when users rely on steppers or reload the storage panel to avoid stuck focus.
- [`3a9f3bf`](https://github.com/batako/react-native-skia-sprite-animator/commit/3a9f3bf) Harden sprite uploads with proper file-size guards so oversized assets no longer crash saves.

<!-- Section: Refactors -->

## 🔧 Refactors

- [`237cbf3`](https://github.com/batako/react-native-skia-sprite-animator/commit/237cbf3), [`421f535`](https://github.com/batako/react-native-skia-sprite-animator/commit/421f535), [`65556d2`](https://github.com/batako/react-native-skia-sprite-animator/commit/65556d2) Overhauled metadata/storage hooks around JSON-only persistence and unified toolbar controls.
- [`331ed39`](https://github.com/batako/react-native-skia-sprite-animator/commit/331ed39), [`b7f7655`](https://github.com/batako/react-native-skia-sprite-animator/commit/b7f7655) Removed the legacy `PreviewPlayer` and aligned the sample app with the new AnimatedSprite2D preview.
- [`2080b16`](https://github.com/batako/react-native-skia-sprite-animator/commit/2080b16), [`879484c`](https://github.com/batako/react-native-skia-sprite-animator/commit/879484c), [`2f227dc`](https://github.com/batako/react-native-skia-sprite-animator/commit/2f227dc) Trimmed unused documents/status UI and added an `.npmignore` so the published package only ships necessary files.

<!-- Section: Full Changelog -->

## 📜 Full Changelog

- https://github.com/batako/react-native-skia-sprite-animator/compare/v0.3.0...v0.4.0
