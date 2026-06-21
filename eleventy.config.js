import markdownIt from "markdown-it";

export default async function (eleventyConfig) {
  // ---- Passthrough: static assets + CF Pages config files stay at site root
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("sw.js");
  eleventyConfig.addPassthroughCopy("manifest.webmanifest");
  eleventyConfig.addPassthroughCopy("browserconfig.xml");
  eleventyConfig.addPassthroughCopy("_headers");
  eleventyConfig.addPassthroughCopy("_redirects");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy(".well-known");

  // ---- Markdown: allow inline HTML in posts, autolink, smart typography
  eleventyConfig.setLibrary(
    "md",
    markdownIt({ html: true, linkify: true, typographer: true }),
  );

  // ---- Collections
  eleventyConfig.addCollection("posts", (api) =>
    api
      .getFilteredByTag("post")
      .filter((p) => !p.data.draft)
      .sort((a, b) => b.date - a.date),
  );

  // ---- Filters
  const TH_MONTHS = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
  ];
  eleventyConfig.addFilter("thaiDate", (d) => {
    const dt = new Date(d);
    return `${dt.getUTCDate()} ${TH_MONTHS[dt.getUTCMonth()]} ${dt.getUTCFullYear() + 543}`;
  });
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString());
  eleventyConfig.addFilter("ymd", (d) => new Date(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter("absUrl", (path, base) => {
    try {
      return new URL(path, base).href;
    } catch {
      return path;
    }
  });
  eleventyConfig.addFilter("limit", (arr, n) => (arr || []).slice(0, n));
  eleventyConfig.addFilter("exclude", (arr, url) =>
    (arr || []).filter((item) => item.url !== url),
  );
  eleventyConfig.addFilter("striptags", (s) =>
    String(s || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
  );
  // Reading time tuned for Thai (no word spaces): count Thai glyphs + latin words.
  eleventyConfig.addFilter("readingTime", (s) => {
    const text = String(s || "").replace(/<[^>]+>/g, " ");
    const thai = (text.match(/[฀-๿]/g) || []).length;
    const latin = (text.split(/\s+/).filter(Boolean) || []).length;
    return Math.max(1, Math.round(thai / 360 + latin / 200));
  });
  eleventyConfig.addFilter("wordCount", (s) => {
    const text = String(s || "").replace(/<[^>]+>/g, " ");
    const thai = (text.match(/[฀-๿]/g) || []).length;
    const latin = (text.split(/\s+/).filter(Boolean) || []).length;
    return Math.round(thai / 3) + latin;
  });
  // Collect every distinct blog category, with counts, for taxonomy pages + nav.
  eleventyConfig.addCollection("categories", (api) => {
    const map = {};
    api
      .getFilteredByTag("post")
      .filter((p) => !p.data.draft)
      .forEach((p) => {
        const c = p.data.category;
        if (!c) return;
        map[c] = map[c] || { name: c, slug: p.data.categorySlug, count: 0 };
        map[c].count++;
      });
    return Object.values(map).sort((a, b) => b.count - a.count);
  });

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
}
