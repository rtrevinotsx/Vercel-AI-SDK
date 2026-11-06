import { createClient } from '@supabase/supabase-js'
import ws from 'ws';

// /** Ensure the OpenAI API key is available and correctly configured */
// if (!process.env.OLLAMA_API_KEY) {
//   throw new Error("OLLAMA API key is missing or invalid.");
// }

// export const openai = new OpenAI({
//   apiKey: process.env.OLLAMA_API_KEY,
// })

/** Supabase config */
const supabasePrivateKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabasePrivateKey) throw new Error(`SUPABASE_SERVICE_ROLE_KEY is missing or invalid`);

const url = process.env.SUPABASE_URL;

if (!url) throw new Error(`SUPABASE_URL is missing or invalid`);

export const supabase = createClient(url, supabasePrivateKey, {
  realtime: { transport: ws },
});
