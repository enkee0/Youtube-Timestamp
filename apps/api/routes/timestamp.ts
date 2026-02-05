import { Hono } from "hono";
import { analyze } from "../services/analyzer.ts";
import { getVideoCaptions } from "../services/youtube.ts";
const timestamp = new Hono();

timestamp.post("/", async (c) => {
  const body = await c.req.json<{
    videoId: string;
    accessToken?: string;
    refreshToken?: string;
  }>();
  const accessToken =
    body.accessToken ??
    c.req.header("Authorization")?.replace(/^Bearer\s+/i, "");
  const refreshToken = body.refreshToken;
  const videoId = body.videoId;
  if (!videoId || (!accessToken && !refreshToken)) {
    return c.json(
      { error: "videoId and accessToken or refreshToken required" },
      400,
    );
  }

  const { captions, accessToken: newAccessToken } = await getVideoCaptions(
    videoId,
    accessToken,
    refreshToken,
  );
  const text = await analyze(captions);
  return c.json({ chapters: text, accessToken: newAccessToken });
});

export default timestamp;
