import fs from "node:fs";
import path from "node:path";

/**
 * Server-only helper: returns the public path if the file exists in /public,
 * otherwise null. Lets pages use real photography as soon as it is added,
 * and show a designed fallback (never a broken image) until then.
 */
export function resolveAsset(publicPath: string): string | null {
  const file = path.join(/* turbopackIgnore: true */ process.cwd(), "public", publicPath);
  return fs.existsSync(file) ? publicPath : null;
}
