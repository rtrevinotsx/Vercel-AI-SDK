import { openAIService, EMBEDDING_MODEL_NAME } from "../../shared/index.js";

const content = "Hello, world!."

export const embedding = await openAIService.embeddings.create({
  model: EMBEDDING_MODEL_NAME,
  input: content,
});
