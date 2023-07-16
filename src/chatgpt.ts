import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

export const summerizePrompt = (text: string) =>
  `As an excellent translator who understands every language, your task is to summarize the text enclosed in \`\`\` marks.
The text will be provided in Markdown format, generated from a website, and may be partial if too long.
Create a summary in English, regardless of the original language, in no more than 500 words.
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

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  const data = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: summerizePrompt(text),
      },
    ],
  };

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      data,
      { headers }
    );
    try {
      const translatedText = response.data.choices[0].message.content;
      if (typeof translatedText !== "string")
        throw new Error(
          "response.data.choices[0].message.content is not a string."
        );
      return translatedText;
    } catch (error) {
      console.error(`Error occurred. response: ${response}`);
      return text;
    }
  } catch (error) {
    console.error("Server disconnected. Returning original text.");
    if (typeof error === "object") {
      const message = (error as any)?.response?.data?.error;
      if (message) {
        console.log(message);
      }
    }
    return text;
  }
};
