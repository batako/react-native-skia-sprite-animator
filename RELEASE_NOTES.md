<!--
- Release note template instructions:
-   - Replace the placeholder bullets with actual issues/commits for the tag you are publishing.
-   - Prefer linking to issues (e.g. [#123](https://github.com/...)) when they exist; otherwise link to commits.
-   - Keep the section headers intact so automation can fill them consistently.
-->

<!-- Section: Highlights -->

## 🌟 Highlights

- Keyboard avoidance for `AnimationStudio` is now opt-in, keeping host layouts unchanged unless explicitly enabled (sample app opts in) ([`9823eb8`](https://github.com/batako/react-native-skia-sprite-animator/commit/9823eb8)).
- Storage, metadata, and file browser modals now share unified overlays/styling across light/dark themes and remain stable when keyboards appear ([`94560c5`](https://github.com/batako/react-native-skia-sprite-animator/commit/94560c5), [`28dfde6`](https://github.com/batako/react-native-skia-sprite-animator/commit/28dfde6)).
- Standalone editor header alignment and spacing refined for tablet layouts ([`d4fc909`](https://github.com/batako/react-native-skia-sprite-animator/commit/d4fc909), [`288b53a`](https://github.com/batako/react-native-skia-sprite-animator/commit/288b53a)).

<!-- Section: Features -->

## ✨ Features

- Added `enableKeyboardAvoidance` (default `false`) to `AnimationStudio`, allowing optional auto-scroll/avoidance for FPS, multiplier, and rename inputs ([`9823eb8`](https://github.com/batako/react-native-skia-sprite-animator/commit/9823eb8)).
- Improved landscape full-keyboard handling in the standalone editor to keep inputs visible ([`0e3f4f4`](https://github.com/batako/react-native-skia-sprite-animator/commit/0e3f4f4), [`97a8fc1`](https://github.com/batako/react-native-skia-sprite-animator/commit/97a8fc1)).

<!-- Section: Bug Fixes -->

## 🐞 Bug Fixes

- Prevented storage/file-browser/modals from shrinking or exiting fullscreen when keyboards appear; maintained overlay boundaries across themes ([`94560c5`](https://github.com/batako/react-native-skia-sprite-animator/commit/94560c5)).
- Removed nested VirtualizedList warnings in the file browser by flattening the list and avoiding ScrollView nesting ([`28dfde6`](https://github.com/batako/react-native-skia-sprite-animator/commit/28dfde6), [`21f6832`](https://github.com/batako/react-native-skia-sprite-animator/commit/21f6832)).
- Aligned metadata modal labels/buttons and text colors with other modal sections in both themes ([`d601726`](https://github.com/batako/react-native-skia-sprite-animator/commit/d601726), [`e4794af`](https://github.com/batako/react-native-skia-sprite-animator/commit/e4794af), [`ab625db`](https://github.com/batako/react-native-skia-sprite-animator/commit/ab625db)).

<!-- Section: Refactors -->

## 🔧 Refactors

- Consolidated overlay styling and dropped React Native `Modal` dependencies from internal panels to mirror Animation Studio surfaces ([`28dfde6`](https://github.com/batako/react-native-skia-sprite-animator/commit/28dfde6), [`94560c5`](https://github.com/batako/react-native-skia-sprite-animator/commit/94560c5)).
- Documented the keyboard-avoidance opt-in in README/README.ja and kept sample usage explicit ([`9823eb8`](https://github.com/batako/react-native-skia-sprite-animator/commit/9823eb8)).

<!-- Section: Full Changelog -->

## 📜 Full Changelog

- https://github.com/batako/react-native-skia-sprite-animator/compare/v0.4.0...v0.5.0
