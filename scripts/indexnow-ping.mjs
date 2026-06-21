#!/usr/bin/env node
// IndexNow ping — instantly tells participating search engines (Bing, Yandex,
// DuckDuckGo, Naver, Seznam, Yep — NOT Google) that URLs are new/updated.
// Google has no ping API anymore; use Search Console + sitemap lastmod for it.
//
// Usage:
//   node scripts/indexnow-ping.mjs <url-or-path> [more...]   # ping specific URLs
//   node scripts/indexnow-ping.mjs                           # defaults: home + /blog/
//   node scripts/indexnow-ping.mjs --dry-run <url...>        # print payload, don't send
//
// Paths (starting with /) are resolved against https://tomato.in.th.
// The key is auto-discovered from the {key}.txt file at the repo root (the same
// file that is published to the site root for ownership verification).

import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const HOST = "tomato.in.th";
const ORIGIN = `https://${HOST}`;
const ENDPOINT = "https://api.indexnow.org/indexnow"; // shared — fans out to all engines

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function findKey() {
  const m = readdirSync(repoRoot).find((f) => /^[0-9a-f]{8,128}\.txt$/i.test(f));
  if (!m) {
    console.error("✗ No IndexNow key file ({key}.txt) found at repo root.");
    process.exit(1);
  }
  return m.replace(/\.txt$/i, "");
}

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const inputs = args.filter((a) => a !== "--dry-run");

const paths = inputs.length ? inputs : ["/", "/blog/"];
const urlList = [...new Set(paths.map((p) => (/^https?:\/\//.test(p) ? p : new URL(p, ORIGIN).href)))];

const key = findKey();
const body = { host: HOST, key, keyLocation: `${ORIGIN}/${key}.txt`, urlList };

console.log(`IndexNow → ${ENDPOINT}`);
console.log(`  host: ${HOST}  key: ${key.slice(0, 6)}…  urls: ${urlList.length}`);
urlList.forEach((u) => console.log(`   • ${u}`));

if (dryRun) {
  console.log("\n[dry-run] payload:\n" + JSON.stringify(body, null, 2));
  process.exit(0);
}

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});
const text = await res.text().catch(() => "");
// 200 OK / 202 Accepted = success. 403 = key file not reachable yet. 422 = host/key mismatch.
if (res.status === 200 || res.status === 202) {
  console.log(`\n✓ Submitted (HTTP ${res.status}). Engines will recrawl shortly.`);
} else {
  console.error(`\n✗ HTTP ${res.status} ${res.statusText} ${text}`.trim());
  process.exit(1);
}
