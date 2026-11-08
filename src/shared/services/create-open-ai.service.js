import { createOpenAI } from '@ai-sdk/openai';

const openAIClient = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default openAIClient;
