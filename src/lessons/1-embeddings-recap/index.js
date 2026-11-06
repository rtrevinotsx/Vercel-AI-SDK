import OpenAI from "openai";

const content = "Hello, world!."
const EMBEDDING_MODEL = 'embeddinggemma-2';

const openai = new OpenAI({
  baseURL: "http://localhost:11434/v1/",
  apiKey: "ollama", // required but ignored
});

export const embedding = await openai.embeddings.create({
  model: EMBEDDING_MODEL,
  input: content,
});
