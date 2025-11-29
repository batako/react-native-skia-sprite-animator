<!--
- Release note template instructions:
-   - Replace the placeholder bullets with actual issues/commits for the tag you are publishing.
-   - Prefer linking to issues (e.g. [#123](https://github.com/...)) when they exist; otherwise link to commits.
-   - Keep the section headers intact so automation can fill them consistently.
-->

<!-- Section: Highlights -->

## 🌟 Highlights

- Removed the shared sprite-sheet `image` prop from `AnimationStudio`; frames are now expected to carry their own `imageUri` (breaking change, build-time detectable) ([`90b05d7`](https://github.com/batako/react-native-skia-sprite-animator/commit/90b05d7)).
- Timeline paste now keeps cursor/selection and auto-scrolls the new frame into view ([`f06a23c`](https://github.com/batako/react-native-skia-sprite-animator/commit/f06a23c), [`5b35bc1`](https://github.com/batako/react-native-skia-sprite-animator/commit/5b35bc1), [`36c0d41`](https://github.com/batako/react-native-skia-sprite-animator/commit/36c0d41)).
- spriteStorage listing is sorted newest-first so recent work is surfaced immediately ([`32513cb`](https://github.com/batako/react-native-skia-sprite-animator/commit/32513cb)).

<!-- Section: Features -->

## ✨ Features

- Simpler `AnimationStudio` usage with per-frame `imageUri` (shared sheet prop removed) ([`90b05d7`](https://github.com/batako/react-native-skia-sprite-animator/commit/90b05d7)).
- Auto-scroll timeline to the pasted frame to keep it visible ([`36c0d41`](https://github.com/batako/react-native-skia-sprite-animator/commit/36c0d41)).
- Sort spriteStorage list by most-recent first ([`32513cb`](https://github.com/batako/react-native-skia-sprite-animator/commit/32513cb)).

<!-- Section: Bug Fixes -->

## 🐞 Bug Fixes

- Preserve selection when pasting and keep cursor aligned when sequences grow ([`f06a23c`](https://github.com/batako/react-native-skia-sprite-animator/commit/f06a23c), [`5b35bc1`](https://github.com/batako/react-native-skia-sprite-animator/commit/5b35bc1)).
- Resolved dependency audit warnings (`npm audit fix`) ([`00429f3`](https://github.com/batako/react-native-skia-sprite-animator/commit/00429f3), [`b535e46`](https://github.com/batako/react-native-skia-sprite-animator/commit/b535e46)).

<!-- Section: Refactors -->

## 🔧 Refactors

- Cleaned up timeline autoscroll implementation and lint dependencies ([`22e3b10`](https://github.com/batako/react-native-skia-sprite-animator/commit/22e3b10)).

<!-- Section: Full Changelog -->

## 📜 Full Changelog

- https://github.com/batako/react-native-skia-sprite-animator/compare/v0.5.0...v0.6.0
