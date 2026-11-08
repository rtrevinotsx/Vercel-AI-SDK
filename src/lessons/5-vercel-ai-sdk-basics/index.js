import { generateResponse, generateEmbeddings } from './utils.js';

const PROMPT = 'describe a sunset using a famous pop song.';

const main = async () => {
  /**
   * Generates a brief poem using the AI model and logs it to the console.
   */
  console.log("Generating response...");
  const response = await generateResponse(PROMPT);
  console.log(`Generated response:\n${response}\n\n`);

  /**
   * Generates embeddings for a given text using the AI model and logs them to the console.
   * uncomment the lines below to generate embeddings.
   */
  console.log("Generating embeddings...");
  const embeddings = await generateEmbeddings(PROMPT);
  console.log(`Generated embeddings:\n${embeddings}`);
}

export default main;