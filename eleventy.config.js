import path from "node:path";
import markdownIt from "markdown-it";
import Image from "@11ty/eleventy-img";

const md = markdownIt({ html: true, linkify: false, typographer: true });

const IMAGE_SOURCE = "src/_images/";

/* Render presets. `widths` are the generated sizes, `sizes` tells the browser
   how wide the image actually renders so it can pick the smallest one. */
const PRESETS = {
  // Full-bleed case study cover, up to the 1180px shell.
  cover: {
    widths: [640, 960, 1280, 1600],
    sizes: "(max-width: 1240px) 100vw, 1180px",
  },
  // Figure that breaks out of the prose column, capped at 960px.
  wide: {
    widths: [640, 960, 1280, 1920],
    sizes: "(max-width: 1000px) 100vw, 960px",
  },
  // Figure that spans the whole shell.
  full: {
    widths: [640, 960, 1280, 1600],
    sizes: "(max-width: 1240px) 100vw, 1180px",
  },
  // Figure constrained to the prose column.
  prose: {
    widths: [480, 704, 1024, 1408],
    sizes: "(max-width: 744px) 100vw, 704px",
  },
  // Work card thumbnails: the first card is full width, the rest are halves.
  thumb: {
    widths: [560, 800, 1120, 1600],
    sizes: "(max-width: 720px) 100vw, (max-width: 1240px) 50vw, 560px",
  },
  thumbWide: {
    widths: [640, 960, 1280, 1600],
    sizes: "(max-width: 1240px) 100vw, 1120px",
  },
  portrait: {
    widths: [280, 400, 560, 680],
    sizes: "(max-width: 820px) 240px, 340px",
  },
  aboutPhoto: {
    widths: [300, 460, 600],
    sizes: "(max-width: 820px) 100vw, 300px",
  },
  moreCard: {
    widths: [320, 480, 640],
    sizes: "(max-width: 700px) 100vw, 320px",
  },
  // Small logos and emoji-scale art.
  logo: { widths: [160, 320], sizes: "160px" },
  icon: { widths: [80, 160], sizes: "80px" },
};

async function renderImage(src, options = {}) {
  const {
    preset = "wide",
    alt = "",
    className,
    eager = false,
  } = options;

  const config = PRESETS[preset] || PRESETS.wide;
  const isPng = path.extname(src).toLowerCase() === ".png";

  const metadata = await Image(IMAGE_SOURCE + src, {
    widths: config.widths,
    // PNG sources keep a PNG fallback so transparency survives.
    formats: ["webp", isPng ? "png" : "jpeg"],
    outputDir: "_site/assets/img/",
    urlPath: "/assets/img/",
    sharpJpegOptions: { quality: 80, mozjpeg: true },
    sharpWebpOptions: { quality: 78 },
    sharpPngOptions: { compressionLevel: 9, palette: true },
    filenameFormat: (id, source, width, format) =>
      `${path.basename(source, path.extname(source))}-${width}.${format}`,
  });

  return Image.generateHTML(metadata, {
    alt,
    sizes: config.sizes,
    class: className,
    loading: eager ? "eager" : "lazy",
    decoding: eager ? "sync" : "async",
    ...(eager ? { fetchpriority: "high" } : {}),
  });
}

export default function (eleventyConfig) {
  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy({ "src/static": "." });

  eleventyConfig.addWatchTarget("src/assets/css/");

  // Case studies in reading order. `hidden` keeps the page built and reachable
  // by URL but drops it from every listing on the site.
  eleventyConfig.addCollection("cases", (collection) =>
    collection
      .getFilteredByGlob("src/work/*.md")
      .sort((a, b) => a.data.order - b.data.order)
  );

  eleventyConfig.addCollection("casesVisible", (collection) =>
    collection
      .getFilteredByGlob("src/work/*.md")
      .filter((item) => !item.data.hidden)
      .sort((a, b) => a.data.order - b.data.order)
  );

  eleventyConfig.addFilter("otherCases", function (cases, currentUrl) {
    return cases.filter((item) => item.url !== currentUrl && !item.data.hidden);
  });

  // Bare responsive <picture>, for use inside templates.
  eleventyConfig.addAsyncShortcode("image", async function (src, alt, preset, eager) {
    return renderImage(src, { alt, preset, eager: Boolean(eager) });
  });

  // Figure with optional caption. `size` sets both the measure and the preset.
  eleventyConfig.addAsyncShortcode(
    "fig",
    async function (src, alt = "", caption = "", size = "wide") {
      const picture = await renderImage(src, { alt, preset: size });
      const cap = caption ? `<figcaption>${caption}</figcaption>` : "";
      return `<figure class="fig fig--${size}">${picture}${cap}</figure>`;
    }
  );

  // Tinted section that picks up the case study's accent colour. The body is
  // rendered here because markdown-it passes raw HTML blocks through untouched.
  eleventyConfig.addPairedShortcode("accent", function (content) {
    return `<div class="accent-block"><div class="accent-block__inner">${md.render(
      dedent(content)
    )}</div></div>`;
  });

  // Responsive iframe embed (Figma, Vimeo, YouTube).
  eleventyConfig.addShortcode(
    "embed",
    function (src, ratio = "56.25", caption = "", size = "wide") {
      const cap = caption ? `<figcaption>${caption}</figcaption>` : "";
      return `<figure class="fig fig--${size}"><div class="embed" style="--ratio:${ratio}%"><iframe src="${src}" loading="lazy" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowfullscreen title="${escapeAttr(
        caption || "Embedded media"
      )}"></iframe></div>${cap}</figure>`;
    }
  );

  eleventyConfig.addFilter("year", () => new Date().getFullYear());

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
}

function escapeAttr(value) {
  return String(value).replace(/"/g, "&quot;");
}

// Strip the shared leading indentation so indented shortcode bodies are not
// parsed as markdown code blocks.
function dedent(value) {
  const lines = String(value).replace(/^\n/, "").replace(/\s+$/, "").split("\n");
  const indents = lines
    .filter((line) => line.trim())
    .map((line) => line.match(/^[ \t]*/)[0].length);
  const min = indents.length ? Math.min(...indents) : 0;
  return lines.map((line) => line.slice(min)).join("\n");
}
