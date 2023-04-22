import * as puppeteer from "puppeteer";

export const fetchHtmlFromUrls = async (
  urls: string[],
  browser: puppeteer.Browser
): Promise<string[]> => {
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

export const fetchHtmlFromUrl = async (
  url: string,
  page: puppeteer.Page
): Promise<string | null> => {
  try {
    await page.goto(url, { waitUntil: "load", timeout: 5000 });
    const html = await page.content();
    return html;
  } catch (error) {
    console.error(`Failed to fetch html for url ${url}: ${error}`);
    return null;
  }
};
