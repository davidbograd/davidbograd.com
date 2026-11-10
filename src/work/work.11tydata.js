export default {
  layout: "layouts/case.njk",
  bodyClass: "is-work",
  eleventyComputed: {
    title: (data) => data.pageTitle,
    // Finished case studies stay unpublished while site.show.work is off.
    // Placeholders stay up so the empty cards have a page to open, and a
    // study marked `home` is published because the homepage links to it.
    permalink: (data) =>
      data.placeholder || data.home || data.site.show.work
        ? `/work/${data.page.fileSlug}/index.html`
        : false,
  },
};
