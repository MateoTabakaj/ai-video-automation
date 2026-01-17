import { google } from "googleapis";
import fs from "fs";
import open from "open";

/**
 * YouTube OAuth2 Setup
 * You need to create OAuth credentials in Google Cloud Console:
 * https://console.cloud.google.com/apis/credentials
 *
 * Save the JSON file as: youtube-credentials.json
 */
const SCOPES = ["https://www.googleapis.com/auth/youtube.upload"];
const TOKEN_PATH = "./youtube-token.json";

function getOAuthClient() {
  const content = fs.readFileSync("youtube-credentials.json");
  const { client_secret, client_id, redirect_uris } = JSON.parse(content).installed;
  return new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
}

async function getAuthenticatedClient() {
  const oAuth2Client = getOAuthClient();

  // Check for existing token
  if (fs.existsSync(TOKEN_PATH)) {
    const token = fs.readFileSync(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
  }

  // Generate new token
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  console.log("Authorize this app by visiting this url:", authUrl);
  await open(authUrl);

  // After authorizing, paste the code here:
  const readline = await import("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const code = await new Promise((resolve) => {
    rl.question("Enter the code from that page here: ", resolve);
  });

  rl.close();

  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  return oAuth2Client;
}

export async function postToYouTube(videoPath, type) {
  const auth = await getAuthenticatedClient();
  const youtube = google.youtube({ version: "v3", auth });

  const title = `Short ${type} video`;
  const description = `Auto-generated ${type} video.`;

  await youtube.videos.insert({
    part: "snippet,status",
    requestBody: {
      snippet: {
        title,
        description,
        tags: [type, "shorts", "ai"],
      },
      status: {
        privacyStatus: "public",
      },
    },
    media: {
      body: fs.createReadStream(videoPath),
    },
  });

  console.log("YouTube upload completed!");
}
