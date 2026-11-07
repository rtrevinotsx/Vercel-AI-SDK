import { retrieveSimilarDocs } from "./retrieve-similar-docs.js"
import { getRagPrompt, combineDocuments } from "./utils.js"
import { ANSWERING_MODEL, openAIService } from "../../shared/index.js";

const QUERY = "What happened in 2007?"

const main = async (query = QUERY) => {
  /**
   * Retrieve documents relevant to the query and generate a response using the model
   */
  console.log('\n\n***** Retrieving Documents... *****');
  const retrievedDocs = await retrieveSimilarDocs(query)

  /**
   * Create a prompt including context docs to send to the model
   */
  console.log('\n\n***** Combining Documents... *****');
  const contextString = combineDocuments(retrievedDocs);

  /**
   *  Create a prompt including context docs to send to the model
   */
  const prompt = getRagPrompt(contextString, query)
  console.log(`\n\nPrompt: ${prompt}`)

  /**
   * Send prompt to model to generate response
   */
  const response = await openAIService.responses.create({
    model: ANSWERING_MODEL,
    input: prompt
  });
  console.log('\n\n***** Sending prompt to model... *****');
  console.log(`\n\n***** Model response: \n${response.output_text} *****`);

}

export default main;
