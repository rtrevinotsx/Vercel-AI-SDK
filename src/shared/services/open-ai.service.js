import OpenAI from "openai";

const openAIService = new OpenAI({
  baseURL: "http://localhost:11434/v1/",
  apiKey: "ollama", // required but ignored
});

export default openAIService;
