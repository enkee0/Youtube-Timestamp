import { google } from "googleapis";

function clientWithToken(accessToken?: string, refreshToken?: string) {
  const client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI,
  );
  const credentials: { access_token?: string; refresh_token?: string } = {};
  if (accessToken) credentials.access_token = accessToken;
  if (refreshToken) credentials.refresh_token = refreshToken;
  client.setCredentials(credentials);
  return client;
}

async function getVideoCaptions(
  videoId: string,
  accessToken?: string,
  refreshToken?: string,
): Promise<{ captions: string; accessToken?: string }> {
  const auth = clientWithToken(accessToken, refreshToken);
  if (refreshToken) {
    await auth.getAccessToken();
  }
  const youtube = google.youtube({
    version: "v3",
    auth,
  });
  const listRes = await youtube.captions.list({
    part: ["snippet"],
    videoId,
  });
  const captionId = listRes.data?.items?.[0]?.id;
  if (!captionId) return { captions: "" };
  const downloadRes = await youtube.captions.download(
    {
      id: captionId,
      tfmt: "srt",
    },
    { responseType: "text" },
  );

  const data = downloadRes.data as string;
  return {
    captions: data,
    accessToken: auth.credentials.access_token ?? undefined,
  };
}

export { getVideoCaptions };
