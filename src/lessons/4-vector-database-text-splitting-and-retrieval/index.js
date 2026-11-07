import { retrieveSimilarDocs } from "./retrieve-similar-docs.js"
import { ingestDocuments } from "./upsert-docs.js";
import { getRagPrompt, combineDocuments } from "./utils.js"
import { ANSWERING_MODEL, openAIService } from "../../shared/index.js";

const QUERY = "What is Ozymandias?"

const main = async (query = QUERY) => {

  /**
   * split text into chunks, embed and store into vector db
   * Un-comment the following block to ingest documents into the vector database
   * if you want to ingest documents before querying
   */
  // try {
  //   await ingestDocuments();
  //   console.log('Documents ingested successfully.');
  //   return;
  // } catch (error) {
  //   console.error('Error ingesting documents:', error);
  //   return;
  // }

  /**
   *  Retrieve docs that contain content relevant to the query
   */
  const docs = await retrieveSimilarDocs(query)
  const contextString = combineDocuments(docs);

  /**
   * create a prompt including context docs to send to the model
   */
  const prompt = getRagPrompt(contextString, query);
  console.log(`\n\nPrompt: ${prompt}`);

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
