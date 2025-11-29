<!--
- Release note template instructions:
-   - Replace the placeholder bullets with actual issues/commits for the tag you are publishing.
-   - Prefer linking to issues (e.g. [#123](https://github.com/...)) when they exist; otherwise link to commits.
-   - Keep the section headers intact so automation can fill them consistently.
-->

<!-- Section: Highlights -->

## 🌟 Highlights

- `AnimationStudio` can now auto-create `editor`/`integration` when omitted, making single-screen embeds simpler (breaking change removed earlier `image` prop dependency) ([`baca973`](https://github.com/batako/react-native-skia-sprite-animator/commit/baca973)).

<!-- Section: Features -->

## ✨ Features

- Simpler `AnimationStudio` usage with per-frame `imageUri` and optional editor/integration injection ([`baca973`](https://github.com/batako/react-native-skia-sprite-animator/commit/baca973)).
- Auto-scroll timeline to the pasted frame to keep it visible ([`36c0d41`](https://github.com/batako/react-native-skia-sprite-animator/commit/36c0d41)).
- Sort spriteStorage list by most-recent first ([`32513cb`](https://github.com/batako/react-native-skia-sprite-animator/commit/32513cb)).

<!-- Section: Bug Fixes -->

## 🐞 Bug Fixes

- Preserve selection when pasting and keep cursor aligned when sequences grow ([`5b35bc1`](https://github.com/batako/react-native-skia-sprite-animator/commit/5b35bc1), [`36c0d41`](https://github.com/batako/react-native-skia-sprite-animator/commit/36c0d41)).
- Resolved dependency audit warnings (`npm audit fix`) ([`00429f3`](https://github.com/batako/react-native-skia-sprite-animator/commit/00429f3), [`b535e46`](https://github.com/batako/react-native-skia-sprite-animator/commit/b535e46)).

<!-- Section: Refactors -->

## 🔧 Refactors

- Cleaned up timeline autoscroll implementation and lint dependencies ([`22e3b10`](https://github.com/batako/react-native-skia-sprite-animator/commit/22e3b10)).

<!-- Section: Full Changelog -->

## 📜 Full Changelog

- https://github.com/batako/react-native-skia-sprite-animator/compare/v0.6.0...v0.6.1
