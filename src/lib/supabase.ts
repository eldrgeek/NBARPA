import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_key';

// Create a placeholder client that won't crash the app
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
});

export type Database = {
  public: {
    Tables: {
      player_profiles: {
        Row: {
          id: string;
          name: string;
          research_data: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          research_data: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          research_data?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          player_id: string;
          messages: any[];
          assessment_data: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          player_id: string;
          messages?: any[];
          assessment_data?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          player_id?: string;
          messages?: any[];
          assessment_data?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      admin_settings: {
        Row: {
          id: string;
          ai_personality: string;
          conversation_tone: string;
          research_sources: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          ai_personality?: string;
          conversation_tone?: string;
          research_sources?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          ai_personality?: string;
          conversation_tone?: string;
          research_sources?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};