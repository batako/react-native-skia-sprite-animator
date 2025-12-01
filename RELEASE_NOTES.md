<!--
- Release note template instructions:
-   - Replace the placeholder bullets with actual issues/commits for the tag you are publishing.
-   - Prefer linking to issues (e.g. [#123](https://github.com/...)) when they exist; otherwise link to commits.
-   - Keep the section headers intact so automation can fill them consistently.
-->

<!-- Section: Highlights -->

## 🌟 Highlights

- AnimatedSprite2D scale now auto-sizes the canvas and sprite using the active animation, so previews resize without extra style props.

<!-- Section: Features -->

## ✨ Features

- `scale` no longer requires manual width/height styling—AnimatedSprite2D applies scaled sizing automatically.

<!-- Section: Bug Fixes -->

## 🐞 Bug Fixes

- Canvas bounds are computed from the selected animation sequence when available, preventing oversized previews driven by unrelated frames.

<!-- Section: Refactors -->

## 🔧 Refactors

- _None._

<!-- Section: Full Changelog -->

## 📜 Full Changelog

- https://github.com/batako/react-native-skia-sprite-animator/compare/v0.6.3...v0.6.4
