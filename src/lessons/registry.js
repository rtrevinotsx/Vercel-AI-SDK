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
];
