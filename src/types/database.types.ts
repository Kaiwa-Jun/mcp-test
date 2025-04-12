export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      todos: {
        Row: {
          id: string;
          title: string;
          completed: boolean | null;
          created_at: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          id?: string;
          title: string;
          completed?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          id?: string;
          title?: string;
          completed?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
      };
    };
  };
}
