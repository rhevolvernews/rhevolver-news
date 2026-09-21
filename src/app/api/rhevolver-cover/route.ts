import { Buffer } from "node:buffer";
import part1 from "@/lib/rhevolverCoverChunks/part1";
import part2 from "@/lib/rhevolverCoverChunks/part2";
import part3 from "@/lib/rhevolverCoverChunks/part3";
import part4 from "@/lib/rhevolverCoverChunks/part4";
import part5 from "@/lib/rhevolverCoverChunks/part5";
import part6 from "@/lib/rhevolverCoverChunks/part6";

export const runtime = "nodejs";

const cover = part1 + part2 + part3 + part4 + part5 + part6;
const bytes = Buffer.from(cover, "base64");

export async function GET() {
  return new Response(bytes, {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Length": String(bytes.length),
    },
  });
}
