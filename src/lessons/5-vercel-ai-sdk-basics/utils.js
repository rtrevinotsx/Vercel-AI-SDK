import { createOllama } from 'ollama-ai-provider-v2';
import { ollama } from 'ollama-ai-provider-v2';
import { generateText, embed } from 'ai';
import { ANSWERING_MODEL, EMBEDDING_MODEL_NAME, openAIClient } from '../../shared/index.js'

const ollamaProvider = createOllama({
  baseURL: 'http://localhost:11434/api',
});

const responseModel = ollama(ANSWERING_MODEL);
const embeddingModel = ollama.embeddingModel(EMBEDDING_MODEL_NAME);

/**
 * Generates a brief poem using the AI model.
 * @param {string} prompt The prompt to generate a response for.
 * @returns {Promise<string>} Resolves with the generated response text.
 * Logs the generated response to the console.
 * Alternatively, you can use OpenAI models for generating responses with `openAIClient`.
 * Example usage:
 * await generateResponse('describe a sunset using a famous pop song.');
 */
export const generateResponse = async (prompt) => {
  const { text } = await generateText({
    model: responseModel,
    prompt: prompt,
  });

  return text;
}

/**
 * Generates embeddings for a given text using the AI model.
 * @returns {Promise<number[]>} Resolves with the generated embedding array.
 * Logs the generated embeddings to the console.
 * Example usage:
 * await generateEmbeddings('This text will be converted to embeddings');
 * @param {string} textToEmbed The text to generate embeddings for.
 */
export const generateEmbeddings = async (textToEmbed) => {
  // 'embedding' is a single embedding object (number[])
  const { embedding } = await embed({
    model: embeddingModel,
    value: textToEmbed,
  });

  return embedding;
}
