# davidbograd.com

Personal portfolio of David Bograd, Product Designer. A static site built with
[Eleventy](https://www.11ty.dev/) and deployed to GitHub Pages.

## Running it locally

```bash
npm install
npm start          # dev server with live reload at http://localhost:8080
npm run build      # production build into _site/
```

## How it is put together

```
src/
├── index.njk                  Homepage: hero, work grid, about
├── 404.njk                    Not-found page
├── sitemap.njk                Generates /sitemap.xml (visible case studies only)
├── _data/site.json            Name, email, role, location, social links
├── _images/                   Original image sources (never served directly)
├── _includes/
│   ├── layouts/base.njk       <head>, nav, footer, theme bootstrap
│   ├── layouts/case.njk       Case study chrome: hero, cover, body, more cases
│   └── partials/              nav.njk, footer.njk
├── assets/
│   ├── css/style.css          The whole design system, one file
│   └── js/theme.js            Theme toggle, nav hairline, scroll reveal
├── static/                    Copied to the site root (robots.txt, favicon)
└── work/
    ├── work.json              Shared layout + /work/<slug>/ permalinks
    ├── envato-review-tool.md
    ├── soundry.md
    ├── epidemic-sound.md
    ├── told.md                Hidden — see below
    ├── canva.md               Empty state — see below
    ├── betashares.md
    └── envato.md
```

## Editing content

Each case study is one markdown file in `src/work/`. The front matter drives the
page header and how the case appears in listings:

| Field          | What it does                                                  |
| -------------- | ------------------------------------------------------------- |
| `order`        | Position in the work grid and in "More case studies"          |
| `heading`      | The `<h1>` on the case study page                             |
| `cardTitle`    | The shorter title used on cards                               |
| `tags_display` | The monospace labels above the title (project, then client)   |
| `accent`       | Hex colour for the tag dot and tinted sections                |
| `thumb`        | Card image, from `src/_images/`                               |
| `cover`        | Full-width image under the header. Omit it to skip the cover  |
| `intro`        | List of paragraphs under the title on the case study page      |
| `logo`         | Wordmark shown at the left of a homepage case study           |
| `logoHeight`   | Rendered height of that wordmark, e.g. `32px`                 |
| `years`        | Range shown in the pill at the right, e.g. `2025 - 2026`      |
| `hidden`       | Unlists the case study — see below                            |
| `home`         | Shows a finished study on the homepage while other work is off |
| `meta`         | Optional `label`/`value` pairs shown as a strip under `intro` |

### Hidden case studies

`hidden: true` keeps a case study fully built and reachable at its URL, but
removes it from everywhere a visitor could find it: the homepage work grid, the
"More case studies" links, and `sitemap.xml`. It also emits
`<meta name="robots" content="noindex, nofollow">` and is disallowed in
`robots.txt`.

`told.md` is hidden. It is complete and can be brought back by deleting that one
line from its front matter (and the `Disallow` line in `src/static/robots.txt`).

### Empty case studies

`placeholder: true` is a company case study with no write-up yet. While
`site.show.work` is off, these are the studies on the homepage: a thumbnail at
1100px, then the company name and years on one line at the left. Each one is
`hidden`, so it stays out of the finished work grid, "More case studies", and
the sitemap.

`canva.md`, `betashares.md`, and `envato.md` are the current empty states.
`soundry.md` fills the Epidemic Sound slot (`home: true`): its cover links to
`/work/soundry/`. Filling another empty state means removing
`placeholder` and `hidden`, then adding the usual `thumb`, `cover`, and body.

### Shortcodes

Available inside case study markdown:

```njk
{% fig "image.jpg", "alt text", "caption", "wide" %}
{% embed "https://player.vimeo.com/video/123", "56.25", "caption", "wide" %}
{% accent %}Markdown that sits in a tinted panel{% endaccent %}
```

`fig` and `embed` take a size: `prose` (text column), `wide` (breaks out, 960px),
`full` (spans the shell), `logo`, or `icon`.

## Images

Sources live in `src/_images/` and are never served as-is. At build time
`@11ty/eleventy-img` generates WebP plus a JPEG/PNG fallback at several widths
and writes them to `_site/assets/img/`, so each page only downloads what it
needs. Add a new image by dropping it in `src/_images/` and referencing the
filename.

Sizing presets are defined at the top of `eleventy.config.js`.

## Design

- **Type** — Inter for text, JetBrains Mono for the small uppercase labels,
  Instrument Serif italic for accents.
- **Theme** — Light and dark, driven by CSS custom properties. Follows the OS by
  default; the toggle stores an explicit choice in `localStorage`.
- **Colour** — A warm neutral base. Each case study carries its own accent,
  which tints its tag dot and panels.

Everything is in `src/assets/css/style.css`, grouped by section with the design
tokens at the top.

## Deploying

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site
and publishes `_site/` to GitHub Pages.

One-time setup in the repo: **Settings → Pages → Build and deployment → Source:
GitHub Actions**.

### Custom domain

1. Add the domain under **Settings → Pages → Custom domain**.
2. Point DNS at GitHub:
   - `A` records for the apex domain to `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, `185.199.111.153`
   - `CNAME` for `www` to `<username>.github.io`
3. Enable **Enforce HTTPS** once the certificate is issued.

GitHub writes a `CNAME` file into the repo when you save the domain. Because the
site is built by Actions, keep that file at `src/static/CNAME` so it survives
each build.

If you deploy to a project path instead (`username.github.io/repo-name`), set
`pathPrefix: "/repo-name/"` in `eleventy.config.js` and use the `url` filter on
internal links.
