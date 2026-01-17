import fs from "fs";

export function saveCookies(page, path) {
  return new Promise(async (resolve) => {
    const cookies = await page.cookies();
    fs.writeFileSync(path, JSON.stringify(cookies, null, 2));
    resolve(true);
  });
}

export function loadCookies(page, path) {
  return new Promise(async (resolve) => {
    if (!fs.existsSync(path)) return resolve(false);

    const cookies = JSON.parse(fs.readFileSync(path));
    await page.setCookie(...cookies);
    resolve(true);
  });
}
