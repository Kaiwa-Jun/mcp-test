import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

const supabaseUrl = "https://yimobqurhjxhaswasgtt.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpbW9icXVyaGp4aGFzd2FzZ3R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0Njc1MDMsImV4cCI6MjA2MDA0MzUwM30.IcAe8DPNPdB5LTCcrXQ5on6W2nJpByC7t5Q__SbEmJ8";

// クライアントサイドとサーバーサイド両方で動作するSupabaseクライアントを作成
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Auth関連のヘルパー関数
export const signUp = async (email: string, password: string) => {
  return await supabase.auth.signUp({ email, password });
};

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const resetPassword = async (email: string) => {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
};

export const updatePassword = async (newPassword: string) => {
  return await supabase.auth.updateUser({ password: newPassword });
};

export const getSession = async () => {
  return await supabase.auth.getSession();
};

export const getUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};
