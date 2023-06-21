import * as dotenv from "dotenv";
import fs from "fs";
import { summerize } from "./src/chatgpt.js";
import { executeSequentially } from "./src/execute-sequentially.js";
import { splitTextByCharCount } from "./src/split-text.js";

dotenv.config();

(async () => {
  const filePath = process.env.FILE_PATH;
  if (filePath == null) {
    throw new Error("environmental variable FILE_PATH is not set.");
  }
  const text = fs.readFileSync(filePath, "utf-8");

  const chunks = splitTextByCharCount(text, 10000);
  const summeries = await executeSequentially(chunks, summerize, 10000);
  for (const summery of summeries) {
    console.log(summery);
    console.log("\n");
  }
})();
