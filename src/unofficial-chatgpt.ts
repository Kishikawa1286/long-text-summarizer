import { ChatGPTUnofficialProxyAPI } from "chatgpt";
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
  const accessToken = process.env.OPENAI_ACCESS_TOKEN;
  if (accessToken == null) {
    throw new Error("environmental variable OPENAI_ACCESS_TOKEN is not set.");
  }

  const api = new ChatGPTUnofficialProxyAPI({
    accessToken,
    apiReverseProxyUrl: "https://ai.fakeopen.com/api/conversation",
    debug: false,
  });

  const res = await api.sendMessage(summerizePrompt(text));
  return res.text;
};
