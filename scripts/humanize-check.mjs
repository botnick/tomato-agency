#!/usr/bin/env node
/**
 * humanize-check — flags AI-sounding clichés / robotic Thai in blog posts.
 * Not a blocker; it prints warnings so a human can soften the copy before publish.
 * Run: npm run humanize:check
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DIR = "src/blog";

// Translation-ese & AI tells that should almost never appear in our friendly Thai copy.
const BANNED = [
  "ยินดีต้อนรับสู่", "ในยุคดิจิทัล", "ในโลกปัจจุบัน", "อย่างไรก็ตาม",
  "นวัตกรรม", "อย่างไร้ที่ติ", "อย่างมืออาชีพ", "โซลูชัน", "ปฏิวัติวงการ",
  "ในบทความนี้เราจะ", "อย่างยิ่งยวด", "เป็นที่น่าจดจำ", "ไม่ว่าคุณจะเป็น",
  "สิ่งสำคัญที่ต้องจำไว้คือ", "โดยสรุปแล้ว", "ท้ายที่สุดแล้ว",
  "ก้าวสู่", "ตอบโจทย์ทุกความต้องการ", "ครบวงจรที่สุด", "ที่ดีที่สุดในตลาด",
];
// Income/over-claim guardrails (brand rule: no money claims, no guarantees).
const RISKY = ["การันตีรายได้", "รวยเร็ว", "รายได้หลักแสน", "บาท/วัน", "บาทต่อวัน", "การันตีว่า"];

let warnings = 0;
for (const file of readdirSync(DIR).filter((f) => f.endsWith(".md"))) {
  const text = readFileSync(join(DIR, file), "utf8");
  const hits = [];
  for (const w of BANNED) if (text.includes(w)) hits.push(`cliché: "${w}"`);
  for (const w of RISKY)
    if (new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).test(text) && !text.includes("ไม่การันตี"))
      hits.push(`over-claim: "${w}"`);
  if (hits.length) {
    warnings += hits.length;
    console.log(`\n⚠️  ${file}`);
    hits.forEach((h) => console.log(`    - ${h}`));
  }
}

if (warnings === 0) console.log("✅ humanize-check: no AI clichés or over-claims found.");
else console.log(`\n${warnings} thing(s) to review. Soften them so the copy reads human.`);
process.exit(0);
