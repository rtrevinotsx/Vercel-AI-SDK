import { openAIService, EMBEDDING_MODEL_NAME } from "../../shared/index.js";

const content = "Hello, world!."

const main = async () => {
  const { data } = await openAIService.embeddings.create({
    model: EMBEDDING_MODEL_NAME,
    input: content,
  });

  console.log("Generated embedding:", data[0].embedding);
};

export default main;
