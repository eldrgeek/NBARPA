import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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