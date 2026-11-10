import { ollama } from 'ollama-ai-provider-v2';
import { generateText, tool, stepCountIs } from 'ai';
import { z } from 'zod';
import { ANSWERING_MODEL } from '../../shared/index.js';

/**
 * Tools are actions that an LLM can invoke.
 * The results of these actions can be reported back to the LLM to be considered
 * in the next response.
 */

const model = ollama(ANSWERING_MODEL);

const main = async () => {

  // await basicWeatherToolCall()

  // await multipleToolCalls()

  await generateResponseFromToolCalls()
}

/**
 * Demonstrates a basic tool call with the weather tool.
 * Calls the weather tool with a specific location and logs the results.
 * @returns {Promise<void>} Logs the results of the weather tool call.
 */
const basicWeatherToolCall = async () => {
  console.log('1 - 🤖 Calling basicWeatherToolCall...')
  const result = await generateText({
    model,
    tools: {
      weather: tool({
        description: 'Get the weather in a location',
        inputSchema: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        /**
         * This is an optional async function called with the inputs
         * the model generates from the tool call.
         */
        execute: async ({ location }) => ({
          location,
          temperature: 50 + Math.floor(Math.random() * 21) - 10, //random number
        }),
      }),
    },
    prompt: 'What is the weather in New York?',
  });
  console.log('1 - ✅ basicWeatherToolCall finished.')
  console.log('1 - Tool calls and results:')
  const { toolCalls, toolResults } = result;

  // input params passed into the execute function
  for (const toolCall of toolCalls) {
    console.log('1 - 🤖 Tool call:\n', toolCall)
  }

  // generated output from the function call
  for (const toolResult of toolResults) {
    console.log('1 - 🤖 Tool results:\n', toolResult)
  }

  console.log(`1 - 🤖 Full results object:\n${JSON.stringify(result, null, 2)}`)
}

/**
 * Demonstrates multiple tool calls with the weather and city attractions tools.
 * Calls both tools with specific inputs and logs the results.
 * @returns {Promise<void>} Logs the results of the tool calls.
 */
const multipleToolCalls = async () => {
  console.log('2 - 🤖 Calling multipleToolCalls...');
  const result = await generateText({
    model,
    tools: {
      weather: tool({
        description: 'Get the weather in a location',
        inputSchema: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        /**
         * This is an optional async function called with the inputs the model generates from the tool call.
         */
        execute: async ({ location }) => ({
          location,
          temperature: 50 + Math.floor(Math.random() * 21) - 10, //random number
        }),
      }),
      cityAttractions: tool({
        description: 'Get the tourist attractions',
        inputSchema: z.object({ city: z.string() }).describe('attractions in the city'),
        execute: async ({ city }) => ({
          city,
          attractions: ['Statue of Liberty', 'Central Park', 'Met Museum'],
        }),
      }),
    },
    prompt: 'What is the weather in New York and what are the best attractions to visit?',
  });

  const { toolCalls, toolResults } = result;

  //input params passed into the execute function
  for (const toolCall of toolCalls) {
    console.log('2 - 🤖 Tool call:\n', toolCall);
  }

  // generated output from the function call
  for (const toolResult of toolResults) {
    console.log('2 - 🤖 Tool result:\n', toolResult);
  }

  console.log(`2 - 🤖 Full results object:\n${JSON.stringify(result, null, 2)}`);

}

/**
 * By default tool calls only return results returned by the execute function.
 * In order to instruct the model to summarize the tool results,
 * use the `stopWhen` property to tell the model to auto-loop.
 * After tools run, send their results back into the model for another turn so it can use them and produce text.
 * `stepCountIs(n)` puts a hard ceiling on how many model turns you trigger.
 */
const generateResponseFromToolCalls = async () => {
  console.log('3 - 🤖 Calling generateResponseFromToolCalls...');
  const NUMBER_OF_STEPS = 3

  /**
   * Step 1: Define the tools
   * The weather tool retrieves the weather for a given location.
   * The cityAttractions tool retrieves tourist attractions for a given city.
   */

  const weather = tool({
    description: 'Get the weather in a location',
    inputSchema: z.object({ location: z.string() }),
    execute: async ({ location }) => ({ location, temperature: 72 }),
  });

  const cityAttractions = tool({
    description: 'Get attractions for a city',
    inputSchema: z.object({ city: z.string() }),
    execute: async ({ city }) => ({ city, attractions: ['Central Park', 'Met Museum'] }),
  });

  console.log('3 - 🤖 Tools defined: weather, cityAttractions');

  /**
   * Step 2: Generate text using the tools
   * The model will call the tools as needed and summarize the results.
   * The model will use the tools to gather information and then generate a summary response.
   */

  /**
   * Step 3: `stepCountIs` ensures the model only takes a limited number of steps to process tool calls and generate a response.
   * This prevents the model from taking too many steps and ensures a controlled flow of tool calls and summarization. 
   * It ensures that the model does not enter an infinite loop while trying to summarize tool results.
   * In this example, we limit the model to a maximum of `NUMBER_OF_STEPS` steps to ensure controlled execution.
   */
  const result = await generateText({
    model,
    tools: { weather, cityAttractions },
    stopWhen: stepCountIs(NUMBER_OF_STEPS), //  1) tool weather; 2) tool cityAttractions; 3) model summarizes
  });
  console.log('3 - 🤖 Result received from generateText');

  const { steps, text, toolResults } = result;

  // extract all tool calls from the steps:
  const allToolCalls = steps.flatMap(step => step.toolCalls);

  console.log(`3 - 🤖 allToolCalls:\n${JSON.stringify(allToolCalls, null, 2)}`);

  // generated output from the function call
  for (const toolResult of toolResults) {
    console.log(`3 - 🤖 Tool result #${toolResults.indexOf(toolResult)} ${toolResult.toolName}:
    ${JSON.stringify(toolResult, null, 2)}`);
  }

  console.log(`3 - 🤖 Generated results:\n${text}`);
}

export default main;
