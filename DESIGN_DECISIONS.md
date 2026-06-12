# Design Decisions

## Stack

No framework, no build step, no external dependencies. Plain HTML, CSS, and JS, enough for the scope of the project. Any file opens directly in the browser and deploying is a `git push`.

## File structure

```
assets/        Shared CSS (base.css, project-shared.css) + per-page CSS
js/            main.js — the only shared JS file
projects/      One HTML file per project
index.html     Home + resume (SPA with hash routing)
```

Each page loads only what it uses. `spoiler.html`, for example, loads `base.css + project-shared.css + spoiler.css`. The same applies to JS: `main.js` is the only shared file. Page-specific logic lives in an inline `<script>` in the HTML itself.

## index.html as a SPA

`index.html` holds two sections (`#home` and `#resume`) that toggle via hash routing, with no page load. The motivation is responsiveness: home and resume are the first-impression pages, where someone visiting the site is likely scanning the profile quickly. Avoiding a full navigation between them makes that experience smoother.

Project pages (`projects/`) don't follow this logic. Anyone clicking into a project is already interested in reading, so a normal navigation is acceptable and keeping them as separate files simplifies maintenance.

The mechanism is straightforward: `hashchange` shows/hides the `.page-section` divs and updates the active nav state.

```js
window.addEventListener('hashchange', handleHash);
handleHash(); // runs on initial load
```

The resume is also printable directly from the page. `@media print` removes the nav and the card wrapper, leaving only the content.

## i18n

Two languages (PT/EN) with the preference persisted in `localStorage`. The engine lives in `main.js` and works in two layers: `_sharedI18n` with keys common to all pages (nav, labels), and `initI18n({ pt: {}, en: {} })` with page-specific keys, called inline in each HTML file. Both are merged on initialization. `applyLang(lang)` iterates over all `[data-i18n]` elements and replaces their content. Strings that contain HTML (such as inline `<code>`) use `innerHTML` intentionally. The default language is `'en'`. The fallback for invalid values is also `'en'`.

## CSS

`base.css` defines the design tokens (colors, shadows, radii, typography) and global styles (nav, layout, footer). Pages don't override tokens, they only extend them.

The color hierarchy uses semantic naming:

```css
--ink           /* primary text */
--ink-mid       /* secondary text */
--ink-light     /* supporting text */
--ink-faint     /* placeholder, decorative */
--accent        /* terracotta red — actions, highlights */
--olive         /* olive green — tech stack, indicators */
```

`--white` is a warm off-white (`#fffef9`), not pure white. An intentional choice to pair with the `--bg` background.

## Project pages

Each project has its own HTML in `projects/` and its own CSS in `assets/`. The shared CSS (`project-shared.css`) covers layout, typography, and common components (back link, header, body, footer). Page-specific visual variants (dot colors on `h3` elements, the pipeline, the evidence table) stay in the page's own CSS file.
