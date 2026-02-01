import { Hono } from "hono";
import { google } from "googleapis";
import { config } from "dotenv"
config({ path: "../../.env" })

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const auth = new Hono();
auth.get("/login", (c) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/youtube.force-ssl"],
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
export default auth;
