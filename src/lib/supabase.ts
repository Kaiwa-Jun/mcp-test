import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

const supabaseUrl = "https://yimobqurhjxhaswasgtt.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpbW9icXVyaGp4aGFzd2FzZ3R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0Njc1MDMsImV4cCI6MjA2MDA0MzUwM30.IcAe8DPNPdB5LTCcrXQ5on6W2nJpByC7t5Q__SbEmJ8";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
