import * as dotenv from "dotenv";
import html2md from "html-to-md";
import puppeteer from "puppeteer";
import sqlite3 from "sqlite3"; // https://github.com/TryGhost/node-sqlite3/issues/1532#issuecomment-989132517
import { collectUrls } from "./src/collect-urls.js";
import {
  TrainingData,
  addTrainingData,
  clearDatabase,
  deleteRowsWithShortMarkdown,
  deleteTrainingDataByUrl,
  editData,
  getFirstData,
  getNextData,
} from "./src/db.js";
import { fetchHtmlFromUrl } from "./src/fetch-htmls.js";
import {
  removeTextBeforeFirstHeading,
  splitTextByCharCount,
} from "./src/split-text.js";

dotenv.config();

const START_URLS = [
  "https://www.typescriptlang.org/docs/",
  "https://zenn.dev/",
  "https://kubernetes.io/docs/home/",
  "https://docs.docker.com/",
  "https://www.fulltextarchive.com/",
  "http://www.fullbooks.com/",
];

(async () => {
  const filePath = process.env.DB_PATH;
  if (filePath == null) {
    throw new Error("environmental variable OPENAI_ACCESS_TOKEN is not set.");
  }
  console.log(`DB_PATH: ${filePath}`);
  const db = new sqlite3.Database(filePath);

  await clearDatabase(db);

  for (const startUrl of START_URLS) {
    await collectUrls(db, startUrl);
  }

  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/chromium",
    args: ["--no-sandbox", "--disable-gpu"],
  });
  const page = await browser.newPage();

  let prevData: TrainingData | undefined = undefined;
  let currentData: TrainingData = await getFirstData(db);

  const goToNextData = async () => {
    prevData = currentData;
    const _currentData = await getNextData(db, prevData.url);
    if (!_currentData) return false;
    currentData = _currentData;
    return true;
  };

  while (currentData) {
    console.log(`Processing ${currentData.url}`);

    const html = await fetchHtmlFromUrl(currentData.url, page);
    if (html === null) {
      await deleteTrainingDataByUrl(db, currentData.url);
      const hasNextData = await goToNextData();
      if (!hasNextData) break;
      continue;
    }

    const markdown = removeTextBeforeFirstHeading(
      html2md(html, {
        skipTags: ["a", "img", "button"],
        renderCustomTags: "SKIP",
      })
    );
    if (markdown === "") {
      await deleteTrainingDataByUrl(db, currentData.url);
      const hasNextData = await goToNextData();
      if (!hasNextData) break;
      continue;
    }
    const chunks = splitTextByCharCount(markdown);
    for (let i = 0; i < chunks.length; i++) {
      if (i === 0) {
        await editData(db, {
          url: currentData.url,
          markdown: chunks[i],
          done: false,
          prompt: "",
          completion: "",
        });
      } else {
        await addTrainingData(db, {
          url: currentData.url,
          markdown: chunks[i],
          done: false,
          prompt: "",
          completion: "",
        });
      }
    }

    const hasNextData = await goToNextData();
    if (!hasNextData) break;
  }

  await browser.close();

  await deleteRowsWithShortMarkdown(db, 500);

  db.close((err) => {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log("Closed the database connection.");
  });
})();
