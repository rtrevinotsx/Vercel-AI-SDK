/**
 * Utility functions for RAG (Retrieval-Augmented Generation) workflow
 * Provides utility functions to create prompts and combine documents for RAG workflow
 * @module utils
 * @example
 * const prompt = getRagPrompt("context", "question");
 * const combinedDocs = combineDocuments([{ content: "doc1" }, { content: "doc2" }]);
 */
export const getRagPrompt = (
  contextString,
  question,
) => `You are a helpful assistant. Answer the user's question based ONLY on the provided context. If the context doesn't contain the answer, state politely "I'm sorry, I don't have specific information about that in the knowledge base.". Do not make up answers.

Context:
---
${contextString}
---

Question: ${question}
Answer:`;

/**
 * Combines an array of documents into a single string with separators
 * @param {Array<{ content: string }>} docs - The array of documents to combine
 * @returns {string} The combined document string
 */
export const combineDocuments = (docs) =>
  docs.map((doc) => doc.content).join('\n\n---\n\n');

/**
 * Splits a text into chunks of specified size with overlap
 * @param {string} text - The text to split
 * @param {number} chunkSize - The size of each chunk
 * @param {number} chunkOverlap - The number of overlapping characters between chunks
 * @returns {Array<string>} The array of text chunks
 */
export const simpleTextSplitter = (text, chunkSize, chunkOverlap) => {
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    const end = Math.min(i + chunkSize, text.length);
    chunks.push(text.slice(i, end));
    i += chunkSize - chunkOverlap;
    if (i <= 0) i = end;
  }
  // Filter out any potentially empty chunks if they occur
  return chunks.filter((chunk) => chunk.trim().length > 0);
};