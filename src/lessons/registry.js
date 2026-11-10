export const lessons = [
  {
    title: "Embeddings recap",
    load: () => import("./1-embeddings-recap/index.js"),
  },
  {
    title: "Vector database: embed documents",
    load: () => import("./2-vector-database-embed-documents/index.js"),
  },
  {
    title: "Vector database: retrieval",
    load: () => import("./3-vector-database-retrieval/index.js"),
  },
  {
    title: "Vector database: text splitting and retrieval",
    load: () => import("./4-vector-database-text-splitting-and-retrieval/index.js"),
  },
  {
    title: "Vercel AI SDK basics",
    load: () => import("./5-vercel-ai-sdk-basics/index.js"),
  },
  {
    title: "Vercel AI SDK Structured Output",
    load: () => import("./6-vercel-ai-sdk-structured-outputs/index.js"),
  },
  {
    title: "Vercel AI SDK Tool Calling",
    load: () => import("./7-vercel-ai-sdk-tool-calling/index.js"),
  },
];
