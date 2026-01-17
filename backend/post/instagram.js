import puppeteer from "puppeteer";
import { loadCookies, saveCookies } from "./cookies.js";

const COOKIE_PATH = "./instagram-cookies.json";

export async function postToInstagram(videoPath, type) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await loadCookies(page, COOKIE_PATH);

  await page.goto("https://www.instagram.com/", { waitUntil: "networkidle2" });

  // If not logged in, login manually and save cookies
  const loginBtn = await page.$("input[name='username']");
  if (loginBtn) {
    console.log("Login required. Please login manually...");
    await page.waitForTimeout(20000);
    await saveCookies(page, COOKIE_PATH);
  }

  // Go to upload page
  await page.goto("https://www.instagram.com/reels/upload/", { waitUntil: "networkidle2" });

  const fileInput = await page.waitForSelector('input[type="file"]');
  await fileInput.uploadFile(videoPath);

  await page.waitForTimeout(10000);

  await page.type('textarea[placeholder="Write a caption..."]', `Auto ${type} reel #ai #shorts`);

  const shareBtn = await page.waitForSelector("button[type='submit']");
  await shareBtn.click();

  await page.waitForTimeout(5000);
  await browser.close();

  console.log("Instagram upload completed!");
}
