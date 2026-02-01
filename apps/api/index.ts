import { Hono } from "hono";
import { google } from "googleapis";
import OpenAI from "openai";

const token = process.env["GITHUB_TOKEN"];
const prompt = `You are a YouTube chaptering assistant.

Input: Raw YouTube captions (auto-generated or manual), including timestamps and text.

Task:

Analyze the captions to identify clear topic shifts and meaningful sections.

Generate concise, descriptive YouTube chapter titles (3–7 words each).

Output clean YouTube-style timestamps in ascending order (MM:SS or HH:MM:SS).

Merge or ignore filler, repeated phrases, and irrelevant captions.

Rules:

The first timestamp must always start at 00:00.

Use natural breakpoints based on topic changes, not every caption line.

Do not invent content not supported by the captions.

Output Format (only this):

00:00 - Introduction  
01:42 - Main topic overview  
05:18 - Step-by-step explanation  
09:50 - Common mistakes  
13:10 - Final tips & conclusion`;

const app = new Hono();

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID as string,
  process.env.CLIENT_SECRET as string,
  "http://localhost:3000/callback"
);

app.get("/login", (c) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/youtube.force-ssl"],
  });
  return c.redirect(url);
});
let globalTokens: any = null;
app.get("/callback", async (c) => {
  const code = c.req.query("code") as string;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  globalTokens = tokens;
  return c.text("Authenticated");
});

app.get("/captions", async (c) => {
  const videoId = c.req.query("videoId") as string;
  if (!globalTokens) {
    return c.text("Not authenticated", 401);
  }
  oauth2Client.setCredentials(globalTokens);
  const youtube = google.youtube({
    version: "v3",
    auth: oauth2Client,
  });

  const list = await youtube.captions.list({
    part: ["id"],
    videoId,
  });

  const captionId = list.data.items?.[0]?.id as string;

  const caption = await youtube.captions.download(
    { id: captionId, tfmt: "srt" },
    { responseType: "text" }
  );

  return c.text(caption.data as string);
});

app.get("/timestamp", async (c) => {
  const videoId = c.req.query("videoId") as string;
  if (!globalTokens) {
    return c.text("Not authenticated", 401);
  }
  oauth2Client.setCredentials(globalTokens);
  const youtube = google.youtube({
    version: "v3",
    auth: oauth2Client,
  });

  const list = await youtube.captions.list({
    part: ["id"],
    videoId,
  });
  const video = await youtube.videos.list({
    part: ["snippet"],
    id: [videoId],
  });

  const item = video.data.items?.[0];

  if (!item || !item.snippet) {
    throw new Error("Video not found");
  }

  const oldDescription: string = item.snippet.description || "";

  const captionId = list.data.items?.[0]?.id as string;

  const caption = await youtube.captions.download(
    { id: captionId, tfmt: "srt" },
    { responseType: "text" }
  );
  const captionText = caption.data as string;
  const client = new OpenAI({
    baseURL: "https://models.github.ai/inference",
    apiKey: token,
  });

  const response = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content: prompt,
      },
      { role: "user", content: captionText },
    ],
    model: "gpt-4o-mini",
  });

  const timestamp = response.choices[0]?.message.content;

  const newDescription: string = `${oldDescription}\n${timestamp}`;

  await youtube.videos.update({
    part: ["snippet"],
    requestBody: {
      id: videoId,
      snippet: {
        ...item.snippet,
        description: newDescription,
      },
    },
  });

  return c.text(
    `Added this timestamp: ${timestamp} to the description of the provided video id`
  );
});
app.get("/token", (c) => {
  return c.json(oauth2Client.credentials);
});

export default {
  port: 4000,
  fetch: app.fetch,
};
