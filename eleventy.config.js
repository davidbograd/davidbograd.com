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
  // Logo that stands in for the pointer: 36px at 1x, 2x and 3x.
  cursor: {
    widths: [36, 72, 108],
    sizes: "36px",
    highQuality: true,
  },
  // Portrait that stands in for the pointer over my name. The square source is
  // cropped to fill a 164px-tall card, so these cover it at 1x–3x.
  portrait: {
    widths: [164, 328, 492],
    sizes: "164px",
    highQuality: true,
  },
  // Homepage work images, up to 1240px wide with a small inset below that.
  work: {
    widths: [800, 1240, 1920, 2480],
    sizes: "(max-width: 1280px) 100vw, 1240px",
    quality: 88,
  },
  // Circular portrait and logos set inline in the hero sentence. Renders
  // ~36px on mobile and ~80px on desktop, so these widths cover up to 3x.
  // They are tiny files anyway, so they skip the usual compression.
  chip: {
    widths: [80, 160, 240],
    sizes: "(max-width: 620px) 40px, 80px",
    highQuality: true,
  },
  aboutPhoto: {
    widths: [300, 460, 600],
    sizes: "(max-width: 820px) 100vw, 300px",
  },
  moreCard: {
    widths: [320, 480, 640],
    sizes: "(max-width: 700px) 100vw, 320px",
  },
  // Website preview that follows the pointer over a company name.
  preview: {
    widths: [360, 720],
    sizes: "360px",
    quality: 82,
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
    ...(config.highQuality
      ? {
          sharpJpegOptions: { quality: 95, mozjpeg: true, chromaSubsampling: "4:4:4" },
          sharpWebpOptions: isPng ? { lossless: true } : { quality: 95, smartSubsample: true },
          sharpPngOptions: { compressionLevel: 9 },
        }
      : {
          sharpJpegOptions: { quality: config.quality || 80, mozjpeg: true },
          sharpWebpOptions: { quality: config.quality || 78 },
          sharpPngOptions: { compressionLevel: 9, palette: true },
        }),
    // Keeps high-quality renders from colliding with cached default ones.
    filenameFormat: (id, source, width, format) =>
      `${path.basename(source, path.extname(source))}-${width}${
        config.highQuality ? "-hq" : config.quality ? `-q${config.quality}` : ""
      }.${format}`,
  });

  return Image.generateHTML(metadata, {
    alt,
    sizes: config.sizes,
    // Only pass `class` when set, otherwise it renders as class="undefined".
    ...(className ? { class: className } : {}),
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
      .filter((item) => !item.data.hidden && !item.data.placeholder)
      .sort((a, b) => a.data.order - b.data.order)
  );

  // Empty company cards shown while the finished case studies are switched off.
  eleventyConfig.addCollection("casesPlaceholder", (collection) =>
    collection
      .getFilteredByGlob("src/work/*.md")
      .filter((item) => item.data.placeholder)
      .sort((a, b) => a.data.order - b.data.order)
  );

  eleventyConfig.addFilter("otherCases", function (cases, currentUrl) {
    return cases.filter((item) => item.url !== currentUrl && !item.data.hidden);
  });

  // Bare responsive <picture>, for use inside templates.
  eleventyConfig.addAsyncShortcode("image", async function (src, alt, preset, eager) {
    return renderImage(src, { alt, preset, eager: Boolean(eager) });
  });

  // Social card source. Sources live outside the passthrough directory, so the
  // file has to go through the pipeline to get a URL that actually resolves.
  eleventyConfig.addAsyncFilter("ogImage", async function (src) {
    if (!src) return "";

    const metadata = await Image(IMAGE_SOURCE + src, {
      widths: [1200],
      formats: ["jpeg"],
      outputDir: "_site/assets/img/",
      urlPath: "/assets/img/",
      sharpJpegOptions: { quality: 82, mozjpeg: true },
      filenameFormat: (id, source) =>
        `${path.basename(source, path.extname(source))}-og.jpeg`,
    });

    return metadata.jpeg[0].url;
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
