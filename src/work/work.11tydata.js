export default {
  layout: "layouts/case.njk",
  bodyClass: "is-work",
  eleventyComputed: {
    title: (data) => data.pageTitle,
    // Case studies aren't published at all while site.show.work is off.
    permalink: (data) =>
      data.site.show.work ? `/work/${data.page.fileSlug}/index.html` : false,
  },
};
