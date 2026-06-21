// Shared front matter for every post in src/blog/*.md
const readingTime = (s) => {
  const t = String(s || "").replace(/<[^>]+>/g, " ").replace(/^---[\s\S]*?---/, "");
  const thai = (t.match(/[฀-๿]/g) || []).length;
  const latin = t.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(thai / 360 + latin / 200));
};
const wordCount = (s) => {
  const t = String(s || "").replace(/<[^>]+>/g, " ").replace(/^---[\s\S]*?---/, "");
  const thai = (t.match(/[฀-๿]/g) || []).length;
  const latin = t.split(/\s+/).filter(Boolean).length;
  return Math.round(thai / 3) + latin;
};

export default {
  layout: "layouts/post.njk",
  tags: ["post"],
  ogType: "article",
  permalink: "/blog/{{ page.fileSlug }}/",
  eleventyComputed: {
    readingTime: (data) => readingTime(data.page.rawInput),
    wordCount: (data) => wordCount(data.page.rawInput),
    author: (data) => data.author || "ทีมงาน Tomato Agency",
    publishedTime: (data) => data.date,
    modifiedTime: (data) => data.updated || data.date,
    ogImage: (data) => data.cover || data.ogImage,
    articleSection: (data) => data.category,
    breadcrumbs: (data) => [
      { name: "บทความ", url: "/blog/" },
      { name: data.title },
    ],
  },
};
