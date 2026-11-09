import { generateText, Output } from 'ai';
import { z } from 'zod';

export const basicStructuredOutput = async ({ model, prompt }) => {
  const output = Output.object({
    schema: z.object({
      recipe: z.object({
        name: z.string(),
        ingredients: z.array(
          z.object({
            name: z.string(),
            amount: z.string(),
          }),
        ),
        steps: z.array(z.string()),
      }),
    }),
  });
  const result = await generateText({ model, output, prompt });

  return result;
}

export const classificationStructuredOutput = async ({ model, prompt }) => {
  const output = Output.object({
    schema: z.object({
      reasoning: z
        .string()
        .describe('Brief reasoning for the classification choice'),
      type: z
        .enum(["positive", "negative"]) // An enum type is a special data type that enables for a variable to be a set of predefined constants
        .describe('Sentiment of the customer review'),
    }),
  });

  const result = await generateText({ model, output, prompt });

  return result;
}
