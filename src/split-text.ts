/**
 * Returns an array of text chunks, where each chunk has a length no
 * greater than the specified `charsPerChunk`. The text is split on
 * newline characters. If there are no newline characters, text that
 * exceeds `charsPerChunk` is included in a single chunk.
 *
 * @param text The text to be split.
 * @param charsPerChunk The number of characters per chunk (default is 1000).
 * @returns An array of text chunks.
 * @throws If `text` is `null` or `undefined`.
 * @throws If `charsPerChunk` is less than or equal to 0.
 */
export const splitTextByCharCount = (
  text: string,
  charsPerChunk = 2500
): string[] => {
  if (text == null) {
    throw new Error("text must not be null or undefined");
  }
  if (charsPerChunk <= 0) {
    throw new Error("charsPerChunk must be greater than 0");
  }

  const chunks: string[] = [];

  let i = 0;
  while (i < text.length) {
    let end = i + charsPerChunk;
    if (end < text.length) {
      // Find the next newline character
      while (text[end] !== "\n" && end > i) {
        end--;
      }
      if (end === i) {
        // If there is no newline character, only split if the length exceeds `charsPerChunk`.
        end = i + charsPerChunk;
      } else {
        // If there is a newline character, split on that line.
        end++;
      }
    } else {
      // The last line of the text should not be split, even if it exceeds `charsPerChunk`.
      end = text.length;
    }

    // Cut the text and add it to the array.
    const chunk = text.slice(i, end);
    chunks.push(chunk);
    i = end;
  }

  return chunks;
};

export const removeTextBeforeFirstHeading = (markdownText: string): string => {
  const match = markdownText.match(/^#{1,6} .*/m);
  if (!match) {
    return markdownText;
  }
  const firstHeadingPosition = match.index;
  return markdownText.slice(firstHeadingPosition);
};
