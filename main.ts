import ora from "ora";
import sqlite3 from "sqlite3";
import { editDataById, getIncompleteData } from "./src/db.js";
import { summerize, summerizePrompt } from "./src/unofficial-chatgpt.js";

(async () => {
  const filePath = process.env.DB_PATH;
  if (filePath == null) {
    throw new Error("environmental variable OPENAI_ACCESS_TOKEN is not set.");
  }
  console.log(`DB_PATH: ${filePath}`);
  const db = new sqlite3.Database(filePath);

  /**
   * This is an infinite loop that fetches and processes incomplete data from the database.
   * It only breaks when there's no more incomplete data.
   */
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const data = await getIncompleteData(db, 50);
    if (data.length === 0) {
      break;
    }

    /**
     * This loop iterates through the incomplete data items and processes them.
     * For each item, it generates a summary prompt, summarizes the markdown content,
     * updates the database, and then waits for 1 second.
     */
    const progressSpinner = ora("Processing data...").start();
    for (let i = 0; i < data.length; i++) {
      const { id, url, markdown } = data[i];

      progressSpinner.text = `Processing data ${i + 1} of ${data.length}`;

      const prompt = summerizePrompt(markdown);
      const completion = await summerize(markdown);
      await editDataById(db, {
        id,
        url,
        markdown,
        prompt,
        completion,
        done: true,
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    progressSpinner.succeed("Data processing complete!");

    /**
     * This is a loop that displays a countdown timer for 30 minutes.
     * It updates the waiting spinner text every second with the remaining time.
     */
    const waitingSpinner = ora(
      "Waiting for 30 minutes before the next batch..."
    ).start();
    for (let i = 30 * 60; i > 0; i--) {
      const minutes = Math.floor(i / 60);
      const seconds = i % 60;
      waitingSpinner.text = `${minutes} minutes and ${seconds} seconds remaining...`;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    waitingSpinner.succeed("Starting next batch...");
  }

  db.close();
})();
