import { createHash } from "node:crypto";
import { monitorKey, redis } from "./storage";
export async function deduplicate(urls: string[], at: string): Promise<number[]> {
  if (!urls.length) return [];
  const keys = urls.map(url => monitorKey(`seen:${createHash("sha256").update(url).digest("hex")}`));
  const result = await redis(["EVAL", "local out={} for i,key in ipairs(KEYS) do if redis.call('SET',key,ARGV[1],'NX','EX',ARGV[2]) then table.insert(out,i-1) end end return out", String(keys.length), ...keys, at, "2592000"]);
  if (!Array.isArray(result) || !result.every(x => Number.isInteger(x) && x >= 0 && x < urls.length)) throw new Error("Invalid dedup response");
  return result as number[];
}
