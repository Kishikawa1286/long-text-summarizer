import { ChatGPTAPI } from "chatgpt";
import * as dotenv from "dotenv";

dotenv.config();

export const summerizePrompt = (text: string) =>
  `As an excellent translator who understands every language, your task is to summarize the text enclosed in \`\`\` marks.
The text will be provided in Markdown format, generated from a website, and may be partial if too long.
Create a summary in English, regardless of the original language, in no more than 200 words.
If the meaning of the text is unclear, provide a very short explanation.
Indicate the language name in parentheses at the beginning of the generated summary, like "(English) ...".
If program code is provided, give a concise description of the input, output, and the main purpose of the code.

\`\`\`
${text}
\`\`\``;

export const summerize = async (text: string) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey == null) {
    throw new Error("environmental variable OPENAI_API_KEY is not set.");
  }

  const api = new ChatGPTAPI({ apiKey });

  const res = await api.sendMessage(summerizePrompt(text));
  return res.text;
};
