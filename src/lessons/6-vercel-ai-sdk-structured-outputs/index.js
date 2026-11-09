import { ollama } from 'ollama-ai-provider-v2';
import { basicStructuredOutput, classificationStructuredOutput } from './utils.js';
import { ANSWERING_MODEL } from '../../shared/constants.js';
import { default as challengeMain } from './challenge.js';

const responseModel = ollama(ANSWERING_MODEL);

const basicSchema = {
  prompt: 'Generate a lasagna recipe.',
}

const classificationSchema = {
  prompt: `Classify the customer review below

  I tried the app and it worked exactly as I expected.`,
}

/**
 * The generateObject interface enables us to instruct the model to generate structured output in JSON format based on predefined schema.
 */

const main = async () => {
  await generateBasicOutput();

  await generateClassificationOutput();

  // await challengeMain();
}

/**
 * Generate a basic structured output
 * This will generate a lasagna recipe in a structured JSON format.
 * The output will include the recipe name, ingredients, and steps.
 * @returns {Promise<void>} Logs the structured output to the console.
 * @example
 * * Example output:
 * * {
 * *   recipe: {
 * *     name: "Lasagna",
 * *     ingredients: ["Lasagna noodles", "Tomato sauce", "Cheese", "Ground beef"],
 * *     steps: ["Preheat oven to 375°F", "Cook noodles", "Prepare sauce", "Layer noodles, sauce, and cheese", "Bake for 45 minutes"]
 * *   }
 * * }
 */
const generateBasicOutput = async () => {
  console.log('1 - 🤖 Generating basic structured output...');
  const result = await basicStructuredOutput({
    model: responseModel,
    prompt: basicSchema.prompt
  });
  const { recipe } = result.output;
  console.log('1 - 🤖 Recipe:\n', recipe);
}

/**
* Generate structured output based on classification requirements
* The output will include the reasoning for the classification and the classification type.
* @returns {Promise<void>} Logs the classification reasoning and type to the console.
* @example
* * Example output:
* * Reasoning: The review is positive because the user had a good experience with the app.
* * Classification Type: positive
* * Output:
* * {
* *   reasoning: "The review is positive because the user had a good experience with the app.",
* *   type: "positive"
* * }
*/
const generateClassificationOutput = async () => {
  console.log('2 - 🤖 Generating classification structured output...');
  const classificationResult = await classificationStructuredOutput({
    model: responseModel,
    prompt: classificationSchema.prompt
  });
  const { reasoning, type } = classificationResult.output;

  console.log('2 - 🤖 Reasoning... ', reasoning);
  console.log('2 - 🤖 Classification Type:\n', type);
}

export default main;
