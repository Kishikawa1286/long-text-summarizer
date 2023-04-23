import * as sqlite3 from "sqlite3";

export interface TrainingData {
  id: number;
  url: string;
  markdown: string;
  done: boolean;
  prompt: string;
  completion: string;
}

export const run = async (
  db: sqlite3.Database,
  query: string,
  params?: unknown[]
): Promise<void> => {
  try {
    await new Promise<void>((resolve, reject) => {
      db.run(query, params, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  } catch (err) {
    console.error("Error executing the SQL query:", err);
    throw err;
  }
};

const validateTrainingData = (data: TrainingData): boolean => {
  if (
    typeof data.id !== "number" ||
    typeof data.url !== "string" ||
    typeof data.markdown !== "string" ||
    typeof data.done !== "boolean" ||
    typeof data.prompt !== "string" ||
    typeof data.completion !== "string"
  ) {
    return false;
  }
  return true;
};

export const getDataById = async (
  db: sqlite3.Database,
  id: number
): Promise<TrainingData | null> => {
  return new Promise<TrainingData | null>((resolve, reject) => {
    db.get(
      "SELECT * FROM training_data WHERE id = ?",
      [id],
      (err, row: TrainingData | null) => {
        if (err) {
          reject(err);
        } else {
          resolve(row ? row : null);
        }
      }
    );
  });
};

export const getDataByUrl = async (
  db: sqlite3.Database,
  url: string
): Promise<TrainingData | null> => {
  return new Promise<TrainingData | null>((resolve, reject) => {
    db.get(
      "SELECT * FROM training_data WHERE url = ?",
      [url],
      (err, row: TrainingData | null) => {
        if (err) {
          reject(err);
        } else {
          resolve(row ? row : null);
        }
      }
    );
  });
};

export const getFirstData = async (
  db: sqlite3.Database
): Promise<TrainingData> => {
  const sql = "SELECT * FROM training_data ORDER BY url ASC LIMIT 1";

  const firstData = await new Promise<TrainingData | null>(
    (resolve, reject) => {
      return db.get(sql, [], (err, row: TrainingData | null) => {
        if (err) {
          reject(err);
        } else {
          resolve(row ? row : null);
        }
      });
    }
  );

  if (!firstData) throw new Error("No data found");

  return firstData;
};

export const getNextData = async (
  db: sqlite3.Database,
  prevUrl?: string
): Promise<TrainingData | null> => {
  const sql =
    "SELECT * FROM training_data WHERE url > ? ORDER BY url ASC LIMIT 1";
  const params = prevUrl ? [prevUrl] : [];

  const nextData = await new Promise<TrainingData | null>((resolve, reject) => {
    return db.get(sql, params, (err, row: TrainingData | null) => {
      if (err) {
        reject(err);
      } else {
        resolve(row ? row : null);
      }
    });
  });

  return nextData ?? null;
};

export const addTrainingData = async (
  db: sqlite3.Database,
  data: {
    url: string;
    markdown: string;
    done: boolean;
    prompt: string;
    completion: string;
  }
): Promise<void> => {
  await run(
    db,
    `
      INSERT INTO training_data (url, markdown, done, prompt, completion)
      VALUES (?, ?, ?, ?, ?)
    `,
    [data.url, data.markdown, data.done ? 1 : 0, data.prompt, data.completion]
  );
};

export const editDataById = async (
  db: sqlite3.Database,
  data: TrainingData
): Promise<void> => {
  if (!validateTrainingData(data)) {
    throw new Error("Invalid TrainingData object");
  }

  const { id } = data;

  const existingData = await getDataById(db, id);

  if (existingData) {
    await run(
      db,
      `
      UPDATE training_data
      SET markdown = ?, done = ?, prompt = ?, completion = ?
      WHERE id = ?
    `,
      [data.markdown, data.done ? 1 : 0, data.prompt, data.completion, id]
    );
  } else {
    throw new Error("The specified id does not exist in the database");
  }
};

export const deleteTrainingDataByUrl = (
  db: sqlite3.Database,
  url: string
): Promise<void> => run(db, "DELETE FROM training_data WHERE url = ?", [url]);

export const clearDatabase = async (db: sqlite3.Database): Promise<void> => {
  await run(db, "DROP TABLE IF EXISTS training_data");
  await run(
    db,
    `
    CREATE TABLE training_data (
      id INTEGER PRIMARY KEY,
      url TEXT,
      markdown TEXT,
      done INTEGER,
      prompt TEXT,
      completion TEXT
    )
  `
  );
};

export const deleteRowsWithShortMarkdown = async (
  db: sqlite3.Database,
  minLength: number
): Promise<void> => {
  await run(db, "DELETE FROM training_data WHERE LENGTH(markdown) < ?", [
    minLength,
  ]);
};

export const getIncompleteData = (
  db: sqlite3.Database,
  limit = 150
): Promise<TrainingData[]> =>
  new Promise<TrainingData[]>((resolve, reject) => {
    db.all(
      `SELECT * FROM training_data WHERE done = 0 LIMIT ${limit}`,
      (err, rows: TrainingData[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
