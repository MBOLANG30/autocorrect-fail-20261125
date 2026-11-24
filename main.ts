import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: one line, a funny autocorrect fail. The intended word was
// "morning"; the phone sent "mourning" to the boss, and HR reacted.
const LINE =
  "I texted my boss 'good morning' — autocorrect sent 'good mourning' and HR sent flowers to my desk.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

if (LINE.length < 1 || LINE.length > 199) {
  throw new Error(`line must be 1-199 characters, got ${LINE.length}`);
}
if (LINE !== LINE.trim()) {
  throw new Error("line must not have leading or trailing whitespace");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("line must be a single line");
}
for (const ch of LINE) {
  const code = ch.charCodeAt(0);
  if (code < 0x20 || code === 0x7f) {
    throw new Error("line must not contain control characters");
  }
}

const outPath = join(outDir, "entry.txt");
// Write exactly the line, no trailing newline: the gate counts characters.
writeFileSync(outPath, LINE, "utf8");
const back = readFileSync(outPath, "utf8");
if (back !== LINE) {
  throw new Error("round-trip check failed: entry.txt does not match the line");
}
