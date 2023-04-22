import * as puppeteer from "puppeteer";
import * as sqlite3 from "sqlite3";
import {
  addTrainingData,
  deleteTrainingDataByUrl,
  getDataByUrl,
} from "./db.js";

const isValidUrl = (urlString: string): boolean => {
  try {
    new URL(urlString);
    return true;
  } catch (_) {
    return false;
  }
};

const removeHashFromUrl = (url: string): string => {
  const hashIndex = url.indexOf("#");
  return hashIndex === -1 ? url : url.slice(0, hashIndex);
};

const extractUrls = async (
  db: sqlite3.Database,
  page: puppeteer.Page,
  url: string,
  depth: number
): Promise<void> => {
  if (depth > 3) return;

  console.log(`Depth ${depth}, Open ${url}`);

  try {
    await page.goto(url, { waitUntil: "load", timeout: 0 });

    const urls = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll("a[href]"),
        (a) => (a as HTMLAnchorElement).href
      )
    );

    for (const newUrl of urls.filter(isValidUrl)) {
      const newUrlAnchorRemoved = removeHashFromUrl(newUrl);
      const existingData = await getDataByUrl(db, newUrlAnchorRemoved);
      if (!existingData) {
        await addTrainingData(db, {
          url: newUrlAnchorRemoved,
          markdown: "",
          done: false,
          prompt: "",
          completion: "",
        });
        await extractUrls(db, page, newUrlAnchorRemoved, depth + 1);
      }
    }
  } catch (e) {
    console.error(e);
    deleteTrainingDataByUrl(db, url);
  }
};

export const collectUrls = async (db: sqlite3.Database, startUrl: string) => {
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/chromium",
    args: ["--no-sandbox", "--disable-gpu"],
  });
  const page = await browser.newPage();
  await extractUrls(db, page, startUrl, 1);
  await browser.close();
};
