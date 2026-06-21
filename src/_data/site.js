// Global site metadata — single source of truth for brand, URLs, nav.
// Hostname also appears in sw.js, _redirects, robots.txt — grep when it changes.
export default {
  name: "Tomato Agency",
  url: "https://tomato.in.th",
  tagline: "ค่าย Live VJ ของไทย สมัครฟรี ทำที่บ้านได้",
  description:
    "Tomato Agency — ค่าย Live VJ ของไทย รับสมัครวีเจไลฟ์สด สมัครฟรี ไม่จำกัดเพศ อายุ 18 ขึ้นไป ทำที่บ้านได้ จัดเวลาเอง ทีมงานดูแลใกล้ชิด ไม่ Toxic",
  lang: "th",
  locale: "th_TH",
  founded: "2024",

  line: { handle: "@tomatoagency", url: "https://lin.ee/WSxsQuG" },
  ig: { handle: "@tomatoagency.th", url: "https://www.instagram.com/tomatoagency.th/" },
  email: "hello@tomato.in.th",

  ogImageDefault: "/assets/img/og-image.png",
  logo: "/assets/img/logo.png",

  // Primary nav — shown in header on every page (keeps site hierarchy clear for sitelinks)
  nav: [
    { label: "รับสมัครวีเจ", url: "/vj/" },
    { label: "สังกัด", url: "/sangkat/" },
    { label: "งานตอบแชท", url: "/ngan-tob-chat/" },
    { label: "ไลฟ์สด", url: "/live-bigo/" },
    { label: "งานออนไลน์", url: "/ngan-online/" },
    { label: "IDOL+", url: "/idol-plus/" },
    { label: "บทความ", url: "/blog/" },
  ],

  // Footer link groups
  footerNav: [
    {
      heading: "งานกับเรา",
      links: [
        { label: "รับสมัครวีเจ", url: "/vj/" },
        { label: "สังกัดวีเจ", url: "/sangkat/" },
        { label: "งานตอบแชท", url: "/ngan-tob-chat/" },
        { label: "ไลฟ์สด Bigo", url: "/live-bigo/" },
        { label: "งานออนไลน์", url: "/ngan-online/" },
        { label: "IDOL+", url: "/idol-plus/" },
      ],
    },
    {
      heading: "เกี่ยวกับ",
      links: [
        { label: "หน้าแรก", url: "/" },
        { label: "บทความ", url: "/blog/" },
        { label: "ข้อสงสัย FAQ", url: "/faq/" },
        { label: "ติดต่อเรา", url: "/contact/" },
      ],
    },
  ],
};
