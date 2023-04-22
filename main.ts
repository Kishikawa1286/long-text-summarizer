import * as fs from "fs";
import html2md from "html-to-md";
import util from "util";

import puppeteer from "puppeteer";
import { executeSequentially } from "./src/execute-sequentially.js";
import { fetchHtmlFromUrls } from "./src/fetch-htmls.js";
import {
  removeTextBeforeFirstHeading,
  splitTextByCharCount,
} from "./src/split-text.js";
import { summerizePrompt } from "./src/unofficial-chatgpt.js";

const readUrlsFromFile = async (filePath: string): Promise<string[]> => {
  const content = await fs.promises.readFile(filePath, { encoding: "utf-8" });
  const urls = content.split("\n").map((url) => url.trim());
  return urls;
};

interface FineTuningData {
  prompt: string;
  completion: string;
}

const appendFineTuningData = async (
  inputs: FineTuningData[],
  filePath: string
): Promise<void> => {
  // Initialize the JSON array in the output file
  await util.promisify(fs.writeFile)(filePath, "[\n", "utf-8");

  for (const input of inputs) {
    const json = JSON.stringify(input, null, 2);
    await util.promisify(fs.appendFile)(filePath, json + ",\n", "utf-8");
  }

  // Close the JSON array in the output file
  const currentContent = await util.promisify(fs.readFile)(filePath, "utf-8");
  const updatedContent = currentContent.slice(0, -2) + "\n]";
  await util.promisify(fs.writeFile)(filePath, updatedContent, "utf-8");
};

(async () => {
  const inputFilePath = "input.txt";

  try {
    const urls = await readUrlsFromFile(inputFilePath);

    const browser = await puppeteer.launch({
      executablePath: "/usr/bin/chromium",
      args: ["--no-sandbox", "--disable-gpu"],
    });
    const htmlContents = await fetchHtmlFromUrls(urls, browser);
    await browser.close();

    const mds = htmlContents.map((html) =>
      html2md(html, {
        skipTags: ["a", "img", "button"],
        renderCustomTags: "SKIP",
      })
    );
    const chunks = mds
      .map((md) => removeTextBeforeFirstHeading(md))
      .map((md) => splitTextByCharCount(md))
      .flat();
    const data = await executeSequentially(
      chunks,
      async (text) => {
        try {
          // const completion = await summerize(text);
          const prompt = summerizePrompt(text);
          const jsonObj: FineTuningData = { completion: prompt, prompt };
          return jsonObj;
        } catch (e) {
          console.error(e);
          return { completion: "", prompt: "" };
        }
      },
      500
    );
    if (data === undefined) {
      console.error("Variable json is undefined.");
    } else {
      appendFineTuningData(data, "output/fine_tuning_data.json");
    }
  } catch (error) {
    console.error(`Error: ${error}`);
  }
})();
