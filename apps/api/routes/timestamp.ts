import { Hono } from "hono";
import { analyze } from "../services/analyzer.ts";
import { getVideoCaptions } from "../services/youtube.ts";
const timestamp = new Hono();

timestamp.post("/", async (c) => {
  const body = await c.req.json<{ videoId: string; accessToken?: string }>();
  const accessToken = body.accessToken ?? c.req.header("Authorization")?.replace(/^Bearer\s+/i, "");
  const videoId = body.videoId;
  if (!videoId || !accessToken) {
    return c.json({ error: "videoId and accessToken (or Authorization header) required" }, 400);
  }

  const captions = await getVideoCaptions(videoId, accessToken);
  console.log(captions)
  const text = await analyze(captions);
  return c.json({ chapters: text });
});

export default timestamp;
