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
      checklist_progress: {
        Row: {
          checked: boolean
          created_at: string
          item_id: number
          user_id: string
        }
        Insert: {
          checked?: boolean
          created_at?: string
          item_id: number
          user_id: string
        }
        Update: {
          checked?: boolean
          created_at?: string
          item_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_progress_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pattern_checklist_items"
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
      pattern_checklist_items: {
        Row: {
          id: number
          kind: string
          name: string
          note: string | null
          optional: boolean
          pattern_id: number
          position: number
          resource_id: number | null
        }
        Insert: {
          id?: number
          kind: string
          name: string
          note?: string | null
          optional?: boolean
          pattern_id: number
          position?: number
          resource_id?: number | null
        }
        Update: {
          id?: number
          kind?: string
          name?: string
          note?: string | null
          optional?: boolean
          pattern_id?: number
          position?: number
          resource_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pattern_checklist_items_pattern_id_fkey"
            columns: ["pattern_id"]
            isOneToOne: false
            referencedRelation: "patterns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pattern_checklist_items_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      pattern_instructions: {
        Row: {
          created_at: string
          description: string
          id: number
          image_credit: string | null
          image_url: string | null
          pattern_id: number
          section_id: number | null
          step_number: number
          title: string | null
          why: string | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          image_credit?: string | null
          image_url?: string | null
          pattern_id: number
          section_id?: number | null
          step_number: number
          title?: string | null
          why?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          image_credit?: string | null
          image_url?: string | null
          pattern_id?: number
          section_id?: number | null
          step_number?: number
          title?: string | null
          why?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pattern_instructions_pattern_id_fkey"
            columns: ["pattern_id"]
            isOneToOne: false
            referencedRelation: "patterns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pattern_instructions_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "pattern_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      pattern_sections: {
        Row: {
          id: number
          pattern_id: number
          position: number
          summary: string | null
          title: string
        }
        Insert: {
          id?: number
          pattern_id: number
          position: number
          summary?: string | null
          title: string
        }
        Update: {
          id?: number
          pattern_id?: number
          position?: number
          summary?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "pattern_sections_pattern_id_fkey"
            columns: ["pattern_id"]
            isOneToOne: false
            referencedRelation: "patterns"
            referencedColumns: ["id"]
          },
        ]
      }
      pattern_skills: {
        Row: {
          id: number
          label: string
          pattern_id: number
          position: number
          resource_id: number | null
        }
        Insert: {
          id?: number
          label: string
          pattern_id: number
          position?: number
          resource_id?: number | null
        }
        Update: {
          id?: number
          label?: string
          pattern_id?: number
          position?: number
          resource_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pattern_skills_pattern_id_fkey"
            columns: ["pattern_id"]
            isOneToOne: false
            referencedRelation: "patterns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pattern_skills_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      patterns: {
        Row: {
          coming_soon: boolean
          created_at: string | null
          id: number
          image_url: string | null
          pattern_description: string | null
          pattern_name: string
          skill_level: string
        }
        Insert: {
          coming_soon?: boolean
          created_at?: string | null
          id?: number
          image_url?: string | null
          pattern_description?: string | null
          pattern_name: string
          skill_level?: string
        }
        Update: {
          coming_soon?: boolean
          created_at?: string | null
          id?: number
          image_url?: string | null
          pattern_description?: string | null
          pattern_name?: string
          skill_level?: string
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
      resources: {
        Row: {
          body_md: string
          created_at: string
          id: number
          slug: string
          summary: string | null
          title: string
        }
        Insert: {
          body_md?: string
          created_at?: string
          id?: number
          slug: string
          summary?: string | null
          title: string
        }
        Update: {
          body_md?: string
          created_at?: string
          id?: number
          slug?: string
          summary?: string | null
          title?: string
        }
        Relationships: []
      }
      step_resources: {
        Row: {
          instruction_id: number
          label: string | null
          position: number
          resource_id: number
        }
        Insert: {
          instruction_id: number
          label?: string | null
          position?: number
          resource_id: number
        }
        Update: {
          instruction_id?: number
          label?: string | null
          position?: number
          resource_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "step_resources_instruction_id_fkey"
            columns: ["instruction_id"]
            isOneToOne: false
            referencedRelation: "pattern_instructions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "step_resources_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
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
export type PatternSection = Tables<'pattern_sections'>
export type Resource = Tables<'resources'>
export type StepResource = Tables<'step_resources'>
export type ChecklistItem = Omit<Tables<'pattern_checklist_items'>, 'kind'> & {
  kind: 'tool' | 'material'
}
export type PatternSkill = Tables<'pattern_skills'>
export type ChecklistProgress = Tables<'checklist_progress'>
