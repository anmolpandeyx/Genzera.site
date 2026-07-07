## 2024-07-07 - Avoid CSS @import and synchronous scripts in <head>
**Learning:** Using `@import` inside a `<style>` block blocks parallel downloads and delays rendering, which negatively impacts Time to Interactive (TTI) and First Contentful Paint (FCP). Synchronous `<script>` tags in the `<head>` also block HTML parsing.
**Action:** Always prefer `<link>` tags with `preconnect` for loading fonts, and use `defer` or `async` attributes for heavy scripts loaded in the `<head>` to prevent blocking the critical rendering path.
