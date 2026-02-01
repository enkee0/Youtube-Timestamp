import { google } from "googleapis";

function clientWithToken(accessToken: string) {
  const client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );
  client.setCredentials({ access_token: accessToken });
  return client;
}

async function getVideoCaptions(
  videoId: string,
  accessToken: string
): Promise<string> {
  const auth = clientWithToken(accessToken);
  const youtube = google.youtube({
    version: "v3",
    auth,
  });
  const listRes = await youtube.captions.list({
    part: ["snippet"],
    videoId,
  });
  const captionId = listRes.data?.items?.[0]?.id;
  console.log(captionId);
  if (!captionId) return "";
  const downloadRes = await youtube.captions.download({
    id: captionId,
    tfmt: "srt",
  }, {responseType: "text"});

  const data = downloadRes.data as string;
  return data;
}

export { getVideoCaptions };
