import { openAIService } from "../../shared/index.js";
import { supabase } from "../../../config.js"
import {
  CLEAR_SUPABASE_TABLE_CONTENTS,
  EMBEDDING_MODEL_NAME,
  SUPABASE_TABLE_NAME,
} from "../../shared/constants.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { simpleTextSplitter } from "./utils.js";
import { CHUNK_SIZE, CHUNK_OVERLAP } from "./constants.js";

// --- Configuration ---
const SOURCE_DOCUMENTS_DIR = '../../shared/docs';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Ingestion Logic ---
export const ingestDocuments = async () => {
  const docsDirPath = path.join(__dirname, SOURCE_DOCUMENTS_DIR);
  console.log(`Ingesting documents from directory: ${docsDirPath}`);

  // *** NEW: Stores all documents to insert across all files ***
  const allDocumentsToInsert = [];

  try {
    // 1. Check if directory exists
    if (
      !fs.existsSync(docsDirPath) ||
      !fs.lstatSync(docsDirPath).isDirectory()
    ) {
      throw new Error(
        `Source documents directory not found at ${docsDirPath}. Please create it and add files.`
      );
    }

    /**
     * Read all files from the directory ***
     */
    const files = fs.readdirSync(docsDirPath);

    if (files.length === 0) {
      throw new Error(
        `No files found in ${docsDirPath}. Nothing to ingest.`
      );
    }
    console.log(`Found ${files.length} files to process.`);

    if (CLEAR_SUPABASE_TABLE_CONTENTS) {

      console.log(
        `Clearing existing documents from table '${SUPABASE_TABLE_NAME}'...`
      );
      const { error: deleteError } = await supabase
        .from(SUPABASE_TABLE_NAME)
        .delete()
        .neq('id', -1); // Deletes all rows
      if (deleteError) {
        console.warn(
          `Warning: Could not clear existing documents: ${deleteError.message}`
        );
      } else {
        console.log('Existing documents cleared.');
      }
    }

    /**
     *  Process each file
     */
    let totalChunks = 0;

    for (const filename of files) {
      const filePath = path.join(docsDirPath, filename);
      console.log(`Processing file: ${filename}...`);

      // Read File Content
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      console.log(` - Read ${fileContent.length} characters.`);

      // split the large text into chunks
      const chunks = simpleTextSplitter(fileContent, CHUNK_SIZE, CHUNK_OVERLAP);

      if (chunks.length === 0) {
        console.log(` - No chunks generated for this file.`);
        continue; // Skip to next file
      }

      /**
       * Embed each chunk
       */
      console.log(`Embedding ${chunks.length} chunks of text`)
      let fileChunkCount = 0;
      for (const chunk of chunks) {
        fileChunkCount++;
        try {
          const embeddings = await openAIService.embeddings.create({
            model: EMBEDDING_MODEL_NAME,
            input: chunk,
          });
          // *** Add metadata with source filename ***
          allDocumentsToInsert.push({
            content: chunk,
            embedding: embeddings.data[0].embedding,
            metadata: { source: filename }, // Store filename here
          });
          console.log(`- Embedded chunk ${fileChunkCount} content from ${filename}`);
        } catch (embedError) {
          throw new Error(
            `   - Failed to embed content from ${filename}: ${embedError.message}. Skipping chunk.`
          );
        }
      }

    }
    console.log(`Total chunks generated across all files: ${totalChunks}`);

    if (allDocumentsToInsert.length === 0) {
      throw new Error(
        'No documents were successfully embedded across all files. Aborting upload.'
      );
    }

    console.log(
      `Total documents successfully prepared for insertion: ${allDocumentsToInsert.length}\n\n`
    );

    // 5. Store all collected documents in Supabase
    console.log(
      `Uploading ${allDocumentsToInsert.length} documents to Supabase table '${SUPABASE_TABLE_NAME}'...`
    );
    const { error: insertError } = await supabase
      .from(SUPABASE_TABLE_NAME)
      .insert(allDocumentsToInsert); // Insert all collected documents

    if (insertError) {
      console.error('Error inserting documents into Supabase:', insertError);
      throw new Error(`Supabase insert failed: ${insertError.message}`);
    } else {
      console.log(
        `Successfully inserted ${allDocumentsToInsert.length} documents into Supabase.`
      );
    }

    console.log('--- Ingestion Complete! ---');
  } catch (error) {
    console.error('--- Ingestion Failed! ---');
    console.error('Error during ingestion process:', error);
    process.exit(1); // Exit with error code
  }
}

