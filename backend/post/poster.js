import { postToYouTube } from "./youtube.js";
import { postToTikTok } from "./tiktok.js";
import { postToInstagram } from "./instagram.js";

/**
 * Post video to selected platforms
 * @param {string} videoPath - Local path to the video file
 * @param {string} type - Content type or title
 * @param {object} options - Which platforms to post
 * Example: { youtube: true, tiktok: true, instagram: false }
 */
export async function autoPost(videoPath, type, options = {}) {
  const { youtube, tiktok, instagram } = options;

  if (!youtube && !tiktok && !instagram) {
    console.log("No platform selected. Exiting.");
    return;
  }

  console.log("Starting upload...");

  // 1) YouTube
  if (youtube) {
    try {
      console.log("Uploading to YouTube...");
      await postToYouTube(videoPath, type);
      console.log("YouTube upload success!");
    } catch (err) {
      console.error("YouTube upload failed:", err);
    }
  }

  // 2) TikTok
  if (tiktok) {
    try {
      console.log("Uploading to TikTok...");
      await postToTikTok(videoPath, type);
      console.log("TikTok upload success!");
    } catch (err) {
      console.error("TikTok upload failed:", err);
    }
  }

  // 3) Instagram
  if (instagram) {
    try {
      console.log("Uploading to Instagram...");
      await postToInstagram(videoPath, type);
      console.log("Instagram upload success!");
    } catch (err) {
      console.error("Instagram upload failed:", err);
    }
  }

  console.log("All uploads completed!");
}
