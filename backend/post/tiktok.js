import puppeteer from "puppeteer";
import { loadCookies, saveCookies } from "./cookies.js";

const COOKIE_PATH = "./tiktok-cookies.json";

export async function postToTikTok(videoPath, type) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Load cookies (if exist)
  await loadCookies(page, COOKIE_PATH);

  await page.goto("https://www.tiktok.com/upload?lang=en", { waitUntil: "networkidle2" });

  // If not logged in, login manually then save cookies
  const loginButton = await page.$("button[type='button']");
  if (loginButton) {
    console.log("Login required. Please login manually...");
    await page.waitForTimeout(15000); // 15 seconds for manual login
    await saveCookies(page, COOKIE_PATH);
  }

  // Upload video
  const fileInput = await page.waitForSelector('input[type="file"]');
  await fileInput.uploadFile(videoPath);

  await page.waitForTimeout(10000);

  await page.type('textarea[placeholder="Describe your video"]', `Auto ${type} video #ai #shorts`);

  const postButton = await page.waitForSelector('button[type="submit"]');
  await postButton.click();

  await page.waitForTimeout(5000);
  await browser.close();

  console.log("TikTok upload completed!");
}
