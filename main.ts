import * as dotenv from "dotenv";
import fs from "fs";
import ora from "ora";
import { summerize } from "./src/chatgpt.js";
import { executeSequentially } from "./src/execute-sequentially.js";
import { splitTextByCharCount } from "./src/split-text.js";

dotenv.config();

(async () => {
  const inputFilePath = process.env.INPUT_FILE_PATH;
  if (inputFilePath == null) {
    throw new Error("environmental variable INPUT_FILE_PATH is not set.");
  }
  const outputFilePath = process.env.OUTPUT_FILE_PATH;
  if (outputFilePath == null) {
    throw new Error("environmental variable OUTPUT_FILE_PATH is not set.");
  }
  const text = fs.readFileSync(inputFilePath, "utf-8");

  const chunks = splitTextByCharCount(text, 3000);

  const spinner = ora().start();
  const summeries = await executeSequentially(
    chunks,
    async (chunk, i) => {
      spinner.text = `Processing ${i + 1} of ${chunks.length}...`;
      return summerize(chunk);
    },
    500
  );
  spinner.succeed("Processing complete!");

  fs.writeFileSync(outputFilePath, summeries.join("\n\n"), "utf-8");
})();
