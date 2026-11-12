// Generated from the Supabase project with `generate_typescript_types`
// (schema as of the add_image_url_and_seed_patterns migration).
// Re-generate after schema changes instead of editing the Database type by hand.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      bookmarks: {
        Row: {
          created_at: string
          pattern_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          pattern_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          pattern_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_pattern_id_fkey"
            columns: ["pattern_id"]
            isOneToOne: false
            referencedRelation: "patterns"
            referencedColumns: ["id"]
          },
        ]
      }
      instruction_progress: {
        Row: {
          completed: boolean
          completed_at: string
          created_at: string
          instruction_id: number
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string
          created_at?: string
          instruction_id: number
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string
          created_at?: string
          instruction_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "instruction_progress_instruction_id_fkey"
            columns: ["instruction_id"]
            isOneToOne: false
            referencedRelation: "pattern_instructions"
            referencedColumns: ["id"]
          },
        ]
      }
      pattern_instructions: {
        Row: {
          created_at: string
          description: string
          id: number
          image_url: string | null
          pattern_id: number
          step_number: number
          title: string | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          image_url?: string | null
          pattern_id: number
          step_number: number
          title?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          image_url?: string | null
          pattern_id?: number
          step_number?: number
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pattern_instructions_pattern_id_fkey"
            columns: ["pattern_id"]
            isOneToOne: false
            referencedRelation: "patterns"
            referencedColumns: ["id"]
          },
        ]
      }
      patterns: {
        Row: {
          created_at: string | null
          id: number
          image_url: string | null
          pattern_description: string | null
          pattern_name: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          image_url?: string | null
          pattern_description?: string | null
          pattern_name: string
        }
        Update: {
          created_at?: string | null
          id?: number
          image_url?: string | null
          pattern_description?: string | null
          pattern_name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_login: string | null
          last_name: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_login?: string | null
          last_name?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_login?: string | null
          last_name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

/** Row type of a public table, e.g. Tables<'patterns'>. */
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type Pattern = Tables<'patterns'>
export type PatternStep = Tables<'pattern_instructions'>
