import * as dotenv from "dotenv";
import fs from "fs";
import { executeSequentially } from "./src/execute-sequentially.js";
import { splitTextByCharCount } from "./src/split-text.js";
import { summerize } from "./src/unofficial-chatgpt.js";

dotenv.config();

(async () => {
  const filePath = process.env.FILE_PATH;
  if (filePath == null) {
    throw new Error("environmental variable FILE_PATH is not set.");
  }
  const text = fs.readFileSync(filePath, "utf-8");

  const chunks = splitTextByCharCount(text);
  const summeries = await executeSequentially(chunks, summerize, 2000);
  for (const summery of summeries) {
    console.log(summery);
    console.log("\n");
  }
})();
