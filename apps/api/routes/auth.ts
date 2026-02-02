import { Hono } from "hono";
import { google } from "googleapis";
import { config } from "dotenv";
config({ path: "../../.env" });

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const userCache = new Map<
  string,
  { picture?: string; email?: string; name?: string }
>();
const CACHE_TTL_MS = 5 * 60 * 1000;

const auth = new Hono();
auth.get("/login", (c) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/youtube.force-ssl",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
    prompt: "consent",
  });
  return c.redirect(url);
});

auth.get("/callback", async (c) => {
  const code = c.req.query("code");
  if (!code) return c.json({ error: "code required" }, 400);

  const response = await oauth2Client.getToken({ code });
  const { tokens } = response;

  oauth2Client.setCredentials(tokens);

  return c.json(tokens);
});

auth.get("/me", async (c) => {
  const authHeader = c.req.header("Authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "").trim();
  if (!token) return c.json({ error: "Authorization required" }, 401);
  const cacheKey = token.slice(0, 32);
  const cached = userCache.get(cacheKey);
  if (cached) return c.json(cached);
  try {
    oauth2Client.setCredentials({ access_token: token });
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();
    const user = {
      picture: data.picture ?? undefined,
      email: data.email ?? undefined,
      name: data.name ?? undefined,
    };
    userCache.set(cacheKey, user);
    setTimeout(() => userCache.delete(cacheKey), CACHE_TTL_MS);
    return c.json(user);
  } catch {
    return c.json({ error: "Invalid or expired token" }, 401);
  }
});

export default auth;
