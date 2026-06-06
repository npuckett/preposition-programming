const fs = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
  eleventyConfig.addGlobalData("site", {
    title: "Preposition Programming",
    description:
      "Interactive p5.js tutorials teaching spatial, directional, and temporal prepositions through code.",
    editorUser: "npuckett",
    p5Version: "2.0.0",
    p5PhoneVersion: "1.11.0",
  });

  eleventyConfig.addFilter("categoryLabel", (prep) => {
    const labels = {
      spatial: "Spatial relationship",
      movement: "Movement & direction",
      time: "Time-based relationship",
    };
    return labels[prep?.category] || "Preposition";
  });

  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/sketches": "sketches" });
  eleventyConfig.addPassthroughCopy({ "src/styles": "styles" });
  eleventyConfig.addPassthroughCopy({ "public": "public" });
  eleventyConfig.addPassthroughCopy({ "public/CNAME": "CNAME" });
  eleventyConfig.addPassthroughCopy({ "style-lab": "style-lab" });
  eleventyConfig.addPassthroughCopy({ "docs": "docs" });
  eleventyConfig.addPassthroughCopy({
    "node_modules/p5-phone/dist/p5-phone.min.js": "js/vendor/p5-phone.min.js",
  });

  eleventyConfig.on("eleventy.after", async () => {
    const { exportWebEditorSketches } = await import("./scripts/export-webeditor.mjs");
    exportWebEditorSketches();
  });

  return {
    pathPrefix: "/",
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      layouts: "_layouts",
      data: "data",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
};
