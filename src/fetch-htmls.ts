import * as puppeteer from "puppeteer";

export const fetchHtmlFromUrls = async (urls: string[]): Promise<string[]> => {
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/chromium",
    args: ["--no-sandbox", "--disable-gpu"],
  });
  const htmlContents: string[] = [];

  for (const url of urls) {
    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "networkidle2" });
      const html = await page.content();
      htmlContents.push(html);
    } catch (error) {
      console.error(`Failed to fetch html for url ${url}: ${error}`);
    }
  }

  await browser.close();
  return htmlContents;
};
