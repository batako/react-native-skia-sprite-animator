<!--
- Release note template instructions:
-   - Replace the placeholder bullets with actual issues/commits for the tag you are publishing.
-   - Prefer linking to issues (e.g. [#123](https://github.com/...)) when they exist; otherwise link to commits.
-   - Keep the section headers intact so automation can fill them consistently.
-->

<!-- Section: Highlights -->

## 🌟 Highlights

- Added a `scale` prop to AnimatedSprite2D so previews (canvas and sprite) can be resized without editing sprite sheets.

<!-- Section: Features -->

## ✨ Features

- AnimatedSprite2D now accepts `scale` to uniformly grow or shrink sprites while keeping canvas sizing in sync.

<!-- Section: Bug Fixes -->

## 🐞 Bug Fixes

- Sprite scaling now respects the provided `scale` for both canvas bounds and the drawn image (no more fixed-size sprites when zooming).

<!-- Section: Refactors -->

## 🔧 Refactors

- _None._

<!-- Section: Full Changelog -->

## 📜 Full Changelog

- https://github.com/batako/react-native-skia-sprite-animator/compare/v0.6.2...v0.6.3
