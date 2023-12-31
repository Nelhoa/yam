export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      accounts: {
        Row: {
          balance_amount: number
          balance_date: string
          bank_id: number
          created_at: string | null
          currency: string
          custom_name: string | null
          id: number
          info: Json
          logo: string
          name: string
          organisation_id: number
          provider: Database["public"]["Enums"]["bank_provider"]
          provider_id: string
          status: string | null
        }
        Insert: {
          balance_amount: number
          balance_date: string
          bank_id: number
          created_at?: string | null
          currency: string
          custom_name?: string | null
          id?: number
          info: Json
          logo: string
          name: string
          organisation_id: number
          provider: Database["public"]["Enums"]["bank_provider"]
          provider_id: string
          status?: string | null
        }
        Update: {
          balance_amount?: number
          balance_date?: string
          bank_id?: number
          created_at?: string | null
          currency?: string
          custom_name?: string | null
          id?: number
          info?: Json
          logo?: string
          name?: string
          organisation_id?: number
          provider?: Database["public"]["Enums"]["bank_provider"]
          provider_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_bank_id_fkey"
            columns: ["bank_id"]
            isOneToOne: false
            referencedRelation: "banks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          }
        ]
      }
      admins: {
        Row: {
          user_id: string
        }
        Insert: {
          user_id: string
        }
        Update: {
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      api_access_keys: {
        Row: {
          created_at: string | null
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "access_key_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      auto_estimates: {
        Row: {
          category: string | null
          core_category: Database["public"]["Enums"]["core_category"] | null
          custom_category_id: number | null
          date: string
          formula_shared_uuid: string
          formula_uuid: string
          organisation_id: number
          scenario_conflict: number | null
          scenario_id: number | null
          uuid: string
          value: number
        }
        Insert: {
          category?: string | null
          core_category?: Database["public"]["Enums"]["core_category"] | null
          custom_category_id?: number | null
          date: string
          formula_shared_uuid: string
          formula_uuid: string
          organisation_id: number
          scenario_conflict?: number | null
          scenario_id?: number | null
          uuid?: string
          value: number
        }
        Update: {
          category?: string | null
          core_category?: Database["public"]["Enums"]["core_category"] | null
          custom_category_id?: number | null
          date?: string
          formula_shared_uuid?: string
          formula_uuid?: string
          organisation_id?: number
          scenario_conflict?: number | null
          scenario_id?: number | null
          uuid?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "auto_estimates_custom_category_id_fkey"
            columns: ["custom_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auto_estimates_formula_uuid_fkey"
            columns: ["formula_uuid"]
            isOneToOne: false
            referencedRelation: "formulas"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "auto_estimates_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auto_estimates_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "scenarios"
            referencedColumns: ["id"]
          }
        ]
      }
      banks: {
        Row: {
          bank_reset_id: number | null
          created_at: string | null
          id: number
          info: Json
          is_demo: boolean
          logo: string
          modified_at: string | null
          name: string
          organisation_id: number
          provider: Database["public"]["Enums"]["bank_provider"]
          reference: string
          status: Database["public"]["Enums"]["bank_status"]
        }
        Insert: {
          bank_reset_id?: number | null
          created_at?: string | null
          id?: number
          info: Json
          is_demo?: boolean
          logo: string
          modified_at?: string | null
          name: string
          organisation_id: number
          provider: Database["public"]["Enums"]["bank_provider"]
          reference: string
          status?: Database["public"]["Enums"]["bank_status"]
        }
        Update: {
          bank_reset_id?: number | null
          created_at?: string | null
          id?: number
          info?: Json
          is_demo?: boolean
          logo?: string
          modified_at?: string | null
          name?: string
          organisation_id?: number
          provider?: Database["public"]["Enums"]["bank_provider"]
          reference?: string
          status?: Database["public"]["Enums"]["bank_status"]
        }
        Relationships: [
          {
            foreignKeyName: "banks_bank_reset_id_fkey"
            columns: ["bank_reset_id"]
            isOneToOne: false
            referencedRelation: "banks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "banks_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          }
        ]
      }
      blog: {
        Row: {
          category: Database["public"]["Enums"]["blog_category"]
          content: string
          created_at: string
          id: number
          slug: string
          title: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["blog_category"]
          content: string
          created_at?: string
          id?: number
          slug: string
          title: string
        }
        Update: {
          category?: Database["public"]["Enums"]["blog_category"]
          content?: string
          created_at?: string
          id?: number
          slug?: string
          title?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          id: number
          is_demo: boolean
          name: string
          organisation_id: number
          parent_id: number | null
          type: Database["public"]["Enums"]["category_type"]
          vat_factor: number | null
          vat_rate: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_demo?: boolean
          name: string
          organisation_id: number
          parent_id?: number | null
          type?: Database["public"]["Enums"]["category_type"]
          vat_factor?: number | null
          vat_rate: number
        }
        Update: {
          created_at?: string | null
          id?: number
          is_demo?: boolean
          name?: string
          organisation_id?: number
          parent_id?: number | null
          type?: Database["public"]["Enums"]["category_type"]
          vat_factor?: number | null
          vat_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "categories_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      categorise_logs: {
        Row: {
          account_id: number
          created_at: string
          details: Json
          id: number
          message: string
        }
        Insert: {
          account_id: number
          created_at?: string
          details: Json
          id?: number
          message: string
        }
        Update: {
          account_id?: number
          created_at?: string
          details?: Json
          id?: number
          message?: string
        }
        Relationships: [
          {
            foreignKeyName: "categorise_logs_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          }
        ]
      }
      commits: {
        Row: {
          account_id: number
          amount: number
          category: string | null
          core_category: Database["public"]["Enums"]["core_category"] | null
          created_at: string
          custom_category_id: number | null
          id: number
          initial_pay_date: string
          invoice_date: string
          is_demo: boolean
          new_pay_date: string
          title: string
          uuid: string
        }
        Insert: {
          account_id: number
          amount: number
          category?: string | null
          core_category?: Database["public"]["Enums"]["core_category"] | null
          created_at?: string
          custom_category_id?: number | null
          id?: number
          initial_pay_date: string
          invoice_date: string
          is_demo?: boolean
          new_pay_date: string
          title: string
          uuid?: string
        }
        Update: {
          account_id?: number
          amount?: number
          category?: string | null
          core_category?: Database["public"]["Enums"]["core_category"] | null
          created_at?: string
          custom_category_id?: number | null
          id?: number
          initial_pay_date?: string
          invoice_date?: string
          is_demo?: boolean
          new_pay_date?: string
          title?: string
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "commits_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commits_custom_category_id_fkey"
            columns: ["custom_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      custom_logs: {
        Row: {
          created_at: string | null
          details: Json
          from: string
          id: number
          message: string
        }
        Insert: {
          created_at?: string | null
          details: Json
          from: string
          id?: number
          message: string
        }
        Update: {
          created_at?: string | null
          details?: Json
          from?: string
          id?: number
          message?: string
        }
        Relationships: []
      }
      estimates: {
        Row: {
          category: string | null
          core_category: Database["public"]["Enums"]["core_category"] | null
          created_at: string | null
          custom_category_id: number | null
          date: string
          id: number
          is_deleted: boolean
          is_demo: boolean
          organisation_id: number
          scenario_conflict: number | null
          scenario_id: number | null
          title: string | null
          uuid: string
          value: number
        }
        Insert: {
          category?: string | null
          core_category?: Database["public"]["Enums"]["core_category"] | null
          created_at?: string | null
          custom_category_id?: number | null
          date: string
          id?: number
          is_deleted?: boolean
          is_demo?: boolean
          organisation_id: number
          scenario_conflict?: number | null
          scenario_id?: number | null
          title?: string | null
          uuid?: string
          value: number
        }
        Update: {
          category?: string | null
          core_category?: Database["public"]["Enums"]["core_category"] | null
          created_at?: string | null
          custom_category_id?: number | null
          date?: string
          id?: number
          is_deleted?: boolean
          is_demo?: boolean
          organisation_id?: number
          scenario_conflict?: number | null
          scenario_id?: number | null
          title?: string | null
          uuid?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "estimates_custom_category_id_fkey"
            columns: ["custom_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estimates_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estimates_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "scenarios"
            referencedColumns: ["id"]
          }
        ]
      }
      formulas: {
        Row: {
          category: string | null
          core_category: Database["public"]["Enums"]["core_category"] | null
          created_at: string | null
          custom_category_id: number | null
          expression: string
          is_deleted: boolean
          organisation_id: number
          scenario_conflict: number | null
          scenario_id: number | null
          shared_uuid: string
          title: string
          uuid: string
        }
        Insert: {
          category?: string | null
          core_category?: Database["public"]["Enums"]["core_category"] | null
          created_at?: string | null
          custom_category_id?: number | null
          expression: string
          is_deleted?: boolean
          organisation_id: number
          scenario_conflict?: number | null
          scenario_id?: number | null
          shared_uuid?: string
          title: string
          uuid?: string
        }
        Update: {
          category?: string | null
          core_category?: Database["public"]["Enums"]["core_category"] | null
          created_at?: string | null
          custom_category_id?: number | null
          expression?: string
          is_deleted?: boolean
          organisation_id?: number
          scenario_conflict?: number | null
          scenario_id?: number | null
          shared_uuid?: string
          title?: string
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "formulas_custom_category_id_fkey"
            columns: ["custom_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "formulas_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "formulas_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "scenarios"
            referencedColumns: ["id"]
          }
        ]
      }
      nordigen_account_logs: {
        Row: {
          account_id: number
          created_at: string
          details: Json
          from: string | null
          id: number
          message: string
        }
        Insert: {
          account_id: number
          created_at?: string
          details: Json
          from?: string | null
          id?: number
          message: string
        }
        Update: {
          account_id?: number
          created_at?: string
          details?: Json
          from?: string | null
          id?: number
          message?: string
        }
        Relationships: [
          {
            foreignKeyName: "nordigen_account_logs_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          }
        ]
      }
      nordigen_bank_logs: {
        Row: {
          bank_id: number
          created_at: string
          details: Json
          from: string | null
          id: number
          message: string
        }
        Insert: {
          bank_id: number
          created_at?: string
          details: Json
          from?: string | null
          id?: number
          message: string
        }
        Update: {
          bank_id?: number
          created_at?: string
          details?: Json
          from?: string | null
          id?: number
          message?: string
        }
        Relationships: [
          {
            foreignKeyName: "nordigen_bank_logs_bank_id_fkey"
            columns: ["bank_id"]
            isOneToOne: false
            referencedRelation: "banks"
            referencedColumns: ["id"]
          }
        ]
      }
      organisations: {
        Row: {
          activity: string | null
          can_admin_access: boolean
          created_at: string | null
          demo_enabled: boolean
          frequency: Database["public"]["Enums"]["frequency_enum"]
          id: number
          name: string
          revenue: string | null
          siren: string | null
          structure_type: string | null
          vat_type: string | null
          workers: string | null
        }
        Insert: {
          activity?: string | null
          can_admin_access?: boolean
          created_at?: string | null
          demo_enabled?: boolean
          frequency?: Database["public"]["Enums"]["frequency_enum"]
          id?: number
          name: string
          revenue?: string | null
          siren?: string | null
          structure_type?: string | null
          vat_type?: string | null
          workers?: string | null
        }
        Update: {
          activity?: string | null
          can_admin_access?: boolean
          created_at?: string | null
          demo_enabled?: boolean
          frequency?: Database["public"]["Enums"]["frequency_enum"]
          id?: number
          name?: string
          revenue?: string | null
          siren?: string | null
          structure_type?: string | null
          vat_type?: string | null
          workers?: string | null
        }
        Relationships: []
      }
      organisations_limits: {
        Row: {
          account_number: number
          bank_number: number
          can_auto_categorise: boolean
          can_create_estimate: boolean
          can_run_formulas: boolean
          formulas_years_range: number
          free_trial_end_date: string | null
          is_trial_over: boolean
          manual_account_number: number
          organisation_id: number
          organisation_members: number
          scenarios_number: number
        }
        Insert: {
          account_number?: number
          bank_number?: number
          can_auto_categorise?: boolean
          can_create_estimate?: boolean
          can_run_formulas?: boolean
          formulas_years_range?: number
          free_trial_end_date?: string | null
          is_trial_over?: boolean
          manual_account_number?: number
          organisation_id?: number
          organisation_members?: number
          scenarios_number?: number
        }
        Update: {
          account_number?: number
          bank_number?: number
          can_auto_categorise?: boolean
          can_create_estimate?: boolean
          can_run_formulas?: boolean
          formulas_years_range?: number
          free_trial_end_date?: string | null
          is_trial_over?: boolean
          manual_account_number?: number
          organisation_id?: number
          organisation_members?: number
          scenarios_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "organisations_limits_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: true
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          }
        ]
      }
      organisations_users: {
        Row: {
          id: number
          organisation_id: number | null
          user_id: string | null
        }
        Insert: {
          id?: number
          organisation_id?: number | null
          user_id?: string | null
        }
        Update: {
          id?: number
          organisation_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organisations_users_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organisations_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          country: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          last_terms_accepted: string | null
          phone: string | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          country?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          last_terms_accepted?: string | null
          phone?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          country?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          last_terms_accepted?: string | null
          phone?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      scenarios: {
        Row: {
          color: string | null
          created_at: string | null
          id: number
          name: string
          organisation_id: number
          parent_id: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: number
          name: string
          organisation_id: number
          parent_id?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: number
          name?: string
          organisation_id?: number
          parent_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "scenarios_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scenarios_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "scenarios"
            referencedColumns: ["id"]
          }
        ]
      }
      transaction_commit: {
        Row: {
          commit_id: number
          transaction_id: number
        }
        Insert: {
          commit_id: number
          transaction_id: number
        }
        Update: {
          commit_id?: number
          transaction_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "transaction_commit_commit_id_fkey"
            columns: ["commit_id"]
            isOneToOne: false
            referencedRelation: "commits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_commit_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: true
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          }
        ]
      }
      transactions: {
        Row: {
          account_id: number
          amount: number
          auto_category: string | null
          booking_date: string | null
          category: string | null
          computed_amount: number
          created_at: string | null
          custom_category_id: number | null
          custom_name: string | null
          id: number
          informations: string | null
          inverted: boolean
          is_categorised: boolean | null
          is_ignored: boolean
          is_income: boolean | null
          is_manual: boolean
          is_splitted: boolean
          is_vat: boolean
          provider_id: string | null
          splited_transaction_id: number | null
          transaction_id: string | null
          value_date: string | null
        }
        Insert: {
          account_id: number
          amount: number
          auto_category?: string | null
          booking_date?: string | null
          category?: string | null
          computed_amount?: number
          created_at?: string | null
          custom_category_id?: number | null
          custom_name?: string | null
          id?: number
          informations?: string | null
          inverted?: boolean
          is_categorised?: boolean | null
          is_ignored?: boolean
          is_income?: boolean | null
          is_manual?: boolean
          is_splitted?: boolean
          is_vat?: boolean
          provider_id?: string | null
          splited_transaction_id?: number | null
          transaction_id?: string | null
          value_date?: string | null
        }
        Update: {
          account_id?: number
          amount?: number
          auto_category?: string | null
          booking_date?: string | null
          category?: string | null
          computed_amount?: number
          created_at?: string | null
          custom_category_id?: number | null
          custom_name?: string | null
          id?: number
          informations?: string | null
          inverted?: boolean
          is_categorised?: boolean | null
          is_ignored?: boolean
          is_income?: boolean | null
          is_manual?: boolean
          is_splitted?: boolean
          is_vat?: boolean
          provider_id?: string | null
          splited_transaction_id?: number | null
          transaction_id?: string | null
          value_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_custom_category_id_fkey"
            columns: ["custom_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_splited_transaction_id_fkey"
            columns: ["splited_transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_organisation_creator_as_member: {
        Args: {
          user_id: string
          organisation_id: number
        }
        Returns: undefined
      }
      can_add_account: {
        Args: {
          p_org_id: number
        }
        Returns: boolean
      }
      can_add_bank: {
        Args: {
          p_org_id: number
          p_provider: string
        }
        Returns: boolean
      }
      can_add_manual_account: {
        Args: {
          p_org_id: number
        }
        Returns: boolean
      }
      can_add_scenario: {
        Args: {
          p_org_id: number
        }
        Returns: boolean
      }
      can_key_read_transactions: {
        Args: {
          key: string
          account_id: number
          secret_input: string
        }
        Returns: boolean
      }
      core_category_to_text: {
        Args: {
          val: Database["public"]["Enums"]["core_category"]
        }
        Returns: string
      }
      count_categorised_transactions: {
        Args: {
          p_account_id: number
        }
        Returns: number
      }
      create_organisation_and_user_relation: {
        Args: {
          p_organisation_name: string
          p_user_id: string
        }
        Returns: {
          activity: string | null
          can_admin_access: boolean
          created_at: string | null
          demo_enabled: boolean
          frequency: Database["public"]["Enums"]["frequency_enum"]
          id: number
          name: string
          revenue: string | null
          siren: string | null
          structure_type: string | null
          vat_type: string | null
          workers: string | null
        }[]
      }
      generate_strong_unique_keys: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_auto_estimates_by_scenario: {
        Args: {
          p_organisation_id: number
          p_scenario_id: number
        }
        Returns: {
          value: number
          organisation_id: number
          date: string
          uuid: string
          core_category: Database["public"]["Enums"]["core_category"]
          custom_category_id: number
          category: string
          scenario_id: number
          formula_uuid: string
          scenario_conflict: number
          formula_shared_uuid: string
        }[]
      }
      get_auto_estimates_cells: {
        Args: {
          p_organisation_id: number
          p_start_date: string
          p_end_date: string
          p_frequency: string
          p_scenario_id: number
        }
        Returns: {
          category: string
          span: string
          sum: number
        }[]
      }
      get_closed_commits: {
        Args: {
          p_account_id: number
          p_start_date: string
          p_end_date: string
        }
        Returns: {
          account_id: number
          amount: number
          category: string | null
          core_category: Database["public"]["Enums"]["core_category"] | null
          created_at: string
          custom_category_id: number | null
          id: number
          initial_pay_date: string
          invoice_date: string
          is_demo: boolean
          new_pay_date: string
          title: string
          uuid: string
        }[]
      }
      get_estimates_by_scenario: {
        Args: {
          p_organisation_id: number
          p_scenario_id: number
        }
        Returns: {
          created_at: string
          title: string
          value: number
          organisation_id: number
          date: string
          uuid: string
          core_category: Database["public"]["Enums"]["core_category"]
          custom_category_id: number
          category: string
          scenario_id: number
          id: number
          scenario_conflict: number
          is_deleted: boolean
          is_demo: boolean
        }[]
      }
      get_estimates_cells: {
        Args: {
          p_organisation_id: number
          p_start_date: string
          p_end_date: string
          p_frequency: string
          p_scenario_id: number
        }
        Returns: {
          category: string
          span: string
          sum: number
        }[]
      }
      get_formulas_by_scenario: {
        Args: {
          p_organisation_id: number
          p_scenario_id: number
        }
        Returns: {
          created_at: string
          title: string
          expression: string
          organisation_id: number
          uuid: string
          shared_uuid: string
          core_category: Database["public"]["Enums"]["core_category"]
          custom_category_id: number
          category: string
          scenario_id: number
          scenario_conflict: number
          is_deleted: boolean
        }[]
      }
      get_futur_commits_cells: {
        Args: {
          p_accounts_id: number[]
          p_start_date: string
          p_end_date: string
          p_frequency: string
        }
        Returns: {
          category: string
          span: string
          pos: number
          neg: number
        }[]
      }
      get_negative_auto_estimates_cells: {
        Args: {
          p_organisation_id: number
          p_start_date: string
          p_end_date: string
          p_frequency: string
          p_scenario_id: number
        }
        Returns: {
          category: string
          span: string
          sum: number
        }[]
      }
      get_negative_estimates_cells: {
        Args: {
          p_organisation_id: number
          p_start_date: string
          p_end_date: string
          p_frequency: string
          p_scenario_id: number
        }
        Returns: {
          category: string
          span: string
          sum: number
        }[]
      }
      get_negative_transactions_cells: {
        Args: {
          p_accounts_id: number[]
          p_start_date: string
          p_end_date: string
          p_frequency: string
        }
        Returns: {
          category: string
          span: string
          sum: number
        }[]
      }
      get_past_unclosed_commits: {
        Args: {
          p_account_id: number
          p_start_date: string
        }
        Returns: {
          account_id: number
          amount: number
          category: string | null
          core_category: Database["public"]["Enums"]["core_category"] | null
          created_at: string
          custom_category_id: number | null
          id: number
          initial_pay_date: string
          invoice_date: string
          is_demo: boolean
          new_pay_date: string
          title: string
          uuid: string
        }[]
      }
      get_present_commits_cells: {
        Args: {
          p_accounts_id: number[]
          p_end_date: string
        }
        Returns: {
          category: string
          pos: number
          neg: number
        }[]
      }
      get_sum_transactions: {
        Args: {
          p_account_id: number
          p_start_date: string
          p_end_date: string
        }
        Returns: number
      }
      get_transactions_cells: {
        Args: {
          p_account_id: number
          p_start_date: string
          p_end_date: string
          p_frequency: string
        }
        Returns: {
          category: string
          span: string
          sum: number
        }[]
      }
      getcustomapikeyname:
        | {
            Args: Record<PropertyKey, never>
            Returns: string
          }
        | {
            Args: {
              api_input: string
            }
            Returns: string
          }
      is_over_bank_or_account_limits: {
        Args: {
          p_bank_id: number
        }
        Returns: boolean
      }
      new_get_auto_estimates_cells: {
        Args: {
          p_organisation_id: number
          p_start_date: string
          p_end_date: string
          p_frequency: string
          p_scenario_id: number
        }
        Returns: {
          category: string
          span: string
          pos: number
          neg: number
        }[]
      }
      new_get_estimates_cells: {
        Args: {
          p_organisation_id: number
          p_start_date: string
          p_end_date: string
          p_frequency: string
          p_scenario_id: number
        }
        Returns: {
          category: string
          span: string
          pos: number
          neg: number
        }[]
      }
      new_get_transactions_cells: {
        Args: {
          p_accounts_id: number[]
          p_start_date: string
          p_end_date: string
          p_frequency: string
        }
        Returns: {
          category: string
          span: string
          pos: number
          neg: number
        }[]
      }
      testheader: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      update_transactions_by_similarity: {
        Args: {
          p_info: string
          p_category: string
          p_account_id: number
        }
        Returns: {
          updated_id: number
        }[]
      }
    }
    Enums: {
      bank_provider: "bridge" | "nordigen" | "manual"
      bank_status: "created" | "reset" | "linked" | "error"
      blog_category: "blog" | "legal"
      category_type: "income" | "outcome" | "key"
      core_category: "vatIn" | "vatOut" | "otherIncome" | "otherOutcome"
      frequency_enum: "day" | "week" | "month" | "quarter" | "year"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
