/**
 * Utility functions for RAG (Retrieval-Augmented Generation) workflow
 * Provides utility functions to create prompts and combine documents for RAG workflow
 * @module utils
 * @example
 * const prompt = getRagPrompt("context", "question");
 * const combinedDocs = combineDocuments([{ content: "doc1" }, { content: "doc2" }]); 
 */
export function getRagPrompt(
  contextString,
  question,
) {
  return `You are a helpful assistant. Answer the user's question based ONLY on the provided context. If the context doesn't contain the answer, state politely "I'm sorry, I don't have specific information about that in the knowledge base.". Do not make up answers.

Context:
---
${contextString}
---

Question: ${question}
Answer:`;
}

/**
 * Combines an array of documents into a single string with separators
 * @param {Array<{ content: string }>} docs - The array of documents to combine
 * @returns {string} The combined document string
 */
export function combineDocuments(docs) {
  return docs.map((doc) => doc.content).join('\n\n---\n\n');
}